import useSWR, { mutate } from 'swr';
import useSWRMutation from 'swr/mutation';
import { Notify, Spinner } from '@/utils/ui';
import type { IRestModel, IRestResponse, RestApiHooks, SearchParams } from './types';
import { Fetcher, type JsonInit } from './fetcher';
import { useEffect, useMemo, useRef } from 'react';

export type { IRestModel };
export type { IRestResponse };

/* -------------------- tiny helpers -------------------- */

function isObject(v: unknown): v is Record<string, unknown> {
    return typeof v === 'object' && v !== null;
}
function hasResponse<T>(e: unknown): e is { response: IRestResponse<T> } {
    return isObject(e) && 'response' in e && isObject((e as { response: unknown }).response);
}
function hasMessage(e: unknown): e is { message?: string } {
    return isObject(e) && 'message' in e;
}
function omitId<T extends IRestModel>(o: T): Omit<T, 'id'> {
    // Shallow copy, then remove `id`
    const copy = { ...o } as Omit<T, 'id'> & { id?: unknown };
    delete (copy as Record<'id', unknown>).id;
    return copy as Omit<T, 'id'>;
}

type SaveInput<T extends IRestModel> = T | Omit<T, 'id'>;

export class RestApi<TListType extends IRestModel, TDetailType extends IRestModel> {
    private baseUrl: string;
    public  fetcher: Fetcher;

    // Mappers accept spreadable "raw" shapes; outputs are concrete
    private listMapper ?: (json: Partial<TListType> & Record<string, unknown>) => TListType;
    private loadMapper    ?: (json: Partial<TDetailType>  & Record<string, unknown>) => TDetailType;
    private saveMapper    ?: (entity: SaveInput<TDetailType>) => SaveInput<TDetailType> | unknown;

    private getListUrl(): string { return `${this.baseUrl}`; }
    private getEntityUrl(id: number | string): string { return `${this.baseUrl}/${id}`; }

    constructor(baseUrl: string) {
        this.fetcher = new Fetcher();
        this.baseUrl = baseUrl;
    }

    static createApi<TS extends IRestModel, TD extends IRestModel>(baseUrl: string) {
        return new RestApi<TS, TD>(baseUrl);
    }

    withListMapper(fn: (json: Partial<TListType> & Record<string, unknown>) => TListType): this {
        this.listMapper = fn;
        return this;
    }
    withLoadMapper(fn: (json: Partial<TDetailType> & Record<string, unknown>) => TDetailType): this {
        this.loadMapper = fn;
        return this;
    }
    withSaveMapper(fn: (entity: SaveInput<TDetailType>) => SaveInput<TDetailType> | unknown): this {
        this.saveMapper = fn;
        return this;
    }

    private applyLoadOne = (resp?: IRestResponse<TDetailType>): IRestResponse<TDetailType> | undefined => {
        if (!resp || !resp.isSuccess) return resp;
        const payload = resp.payload; // TDetail
        const mapped  = this.loadMapper
            ? this.loadMapper(payload as Partial<TDetailType> & Record<string, unknown>)
            : payload;
        return { ...resp, payload: mapped };
    };

    private applyLoadMany = (resp?: IRestResponse<TListType[]>): IRestResponse<TListType[]> | undefined => {
        if (!resp || !resp.isSuccess) return resp;
        const payload = resp.payload; // TSummary[]
        const map     = this.listMapper;
        if (payload && map) {
            const mapped = payload.map(item =>
                map(item as Partial<TListType> & Record<string, unknown>)
            );
            return { ...resp, payload: mapped };
        }
        return resp; // identity if no mapper
    };

    private applySave(entity: SaveInput<TDetailType>): unknown {
        return this.saveMapper ? this.saveMapper(entity) : entity;
    }

    /* ----------------- SWR cache helpers ----------------- */

    private refreshList(showSpinner: (isVisible: boolean, message: string) => void = () => {}) {
        showSpinner(true, 'Refreshing list...');
        mutate(this.getListUrl(), undefined, { revalidate: true }).finally(() => showSpinner(false, 'Refreshing list...'));
    }

    private refreshOptimistic(updated: TDetailType) {
        const entityUrl = this.getEntityUrl(updated.id);
        mutate(
            entityUrl,
            (prev?: IRestResponse<TDetailType>) => (prev ? { ...prev, payload: updated } : undefined),
            false
        );
        this.refreshList(); // revalidate list instead of synthesizing summaries locally
    }

    private removeFromCache(id: string | number) {
        mutate(this.getEntityUrl(id), undefined, false);
        this.refreshList();
    }

    /* -------------------- Hook factory -------------------- */

    private _hooks?: RestApiHooks<TListType, TDetailType>;

    public makeHooks(): RestApiHooks<TListType, TDetailType> {
        if (this._hooks) return this._hooks;

        // Use arrow functions so `this` is captured lexically; no `const api = this`
        const useFetch = <R,>(
            url: string | null,
            mapFn: (resp?: IRestResponse<R>) => IRestResponse<R> | undefined,
            labels: { loading: string; fail: string }
        ): IRestResponse<R> | undefined => {
            const { data, error, isLoading, isValidating } = useSWR<IRestResponse<R>>(url, this.fetcher.fetch);

            // Spinner control via effect with transition tracking (avoid repeated starts)
            const showSpinner = !!url && (isLoading || (isValidating && !data && !error));
            const wasShowingRef = useRef(false);
            useEffect(() => {
                // start only on transition false -> true
                if (showSpinner && !wasShowingRef.current) {
                    Spinner.start(labels.loading);
                    wasShowingRef.current = true;
                    return;
                }
                // end only on transition true -> false
                if (!showSpinner && wasShowingRef.current) {
                    Spinner.end();
                    wasShowingRef.current = false;
                }
            }, [showSpinner, labels.loading]);

            // While visible, update message if it changes
            useEffect(() => {
                if (wasShowingRef.current && showSpinner && typeof Spinner.setText === 'function') {
                    Spinner.setText(labels.loading);
                }
            }, [labels.loading, showSpinner]);

            // Ensure spinner ends on unmount if still showing
            useEffect(() => {
                return () => {
                    if (wasShowingRef.current) {
                        Spinner.end();
                        wasShowingRef.current = false;
                    }
                };
            }, []);

            // Notify errors via effects
            useEffect(() => {
                if (!error) return;
                const msg = hasMessage(error) && error.message ? error.message : 'Network error';
                Notify.error(msg);
            }, [error]);

            useEffect(() => {
                if (!data || data.isSuccess !== false) return;
                Notify.error(data.message || labels.fail);
            }, [data, labels.fail]);

            const source: IRestResponse<R> | undefined =
                hasResponse<R>(error) ? (error as { response: IRestResponse<R> }).response : data;

            // Memoize mapped response so identity is stable across renders when `source` is unchanged
            return useMemo(() => mapFn(source), [source, mapFn]);
        };

        const useGetAll = (): IRestResponse<TListType[]> | undefined =>
            useFetch<TListType[]>(
                this.getListUrl(),
                this.applyLoadMany,
                { loading: 'Loading...', fail: 'Fetch failed' }
            );

        const useGetById = (id: string | number | null): IRestResponse<TDetailType> | undefined => {
            const url = id != null ? this.getEntityUrl(id) : null;
            return useFetch<TDetailType>(
                url,
                this.applyLoadOne,
                { loading: 'Loading...', fail: 'Fetch failed' }
            );
        };

        const useCreate = () => {
            const { trigger, data, error, isMutating } =
                useSWRMutation<IRestResponse<TDetailType>, Error, string, JsonInit>(
                    this.getListUrl(),
                    this.fetcher.fetchWithMutation
                );

            const submit = async (payload: TDetailType): Promise<IRestResponse<TDetailType>> => {
                Spinner.start('Saving...');
                try {
                    const body = this.applySave(omitId(payload));
                    const resp = await trigger({ method: 'POST', body } as JsonInit);
                    if (resp?.isSuccess) {
                        Notify.success('Save successful');
                        this.refreshOptimistic(payload);
                    } else {
                        Notify.error(resp?.message || 'Save failed');
                    }
                    return this.applyLoadOne(resp) as IRestResponse<TDetailType>;
                } finally {
                    Spinner.end();
                }
            };

            return { submit, response: this.applyLoadOne(data), error, isMutating };
        };

        const useUpdate = (id: string | number) => {
            const { trigger, data, error, isMutating } =
                useSWRMutation<IRestResponse<TDetailType>, Error, string, JsonInit>(
                    this.getEntityUrl(id),
                    this.fetcher.fetchWithMutation
                );

            const submit = async (payload: TDetailType): Promise<IRestResponse<TDetailType>> => {
                Spinner.start('Saving...');
                try {
                    const body = this.applySave(payload);
                    const resp = await trigger({ method: 'PUT', body } as JsonInit);
                    if (resp?.isSuccess) {
                        Notify.success('Update successful');
                        this.refreshOptimistic(payload);
                    } else {
                        Notify.error(resp?.message || 'Update failed');
                    }
                    return this.applyLoadOne(resp) as IRestResponse<TDetailType>;
                } finally {
                    Spinner.end();
                }
            };

            return { submit, response: this.applyLoadOne(data), error, isMutating };
        };

        const useDelete = (id: string | number) => {
            const { trigger, data, error, isMutating } =
                useSWRMutation<IRestResponse<TDetailType>, Error, string, JsonInit>(
                    this.getEntityUrl(id),
                    this.fetcher.fetchWithMutation
                );

            const submit = async (): Promise<IRestResponse<TDetailType>> => {
                Spinner.start('Deleting...');
                try {
                    const resp = await trigger({ method: 'DELETE' } as JsonInit);
                    if (resp?.isSuccess) {
                        Notify.success('Delete successful');
                        this.removeFromCache(id);
                    } else {
                        Notify.error(resp?.message || 'Delete failed');
                    }
                    return this.applyLoadOne(resp) as IRestResponse<TDetailType>;
                } finally {
                    Spinner.end();
                }
            };

            return { submit, response: this.applyLoadOne(data), error, isMutating };
        };

        const useSearch = (params: SearchParams | null): IRestResponse<TListType[]> | undefined => {
            const qs = params
                ? new URLSearchParams(
                    Object.entries(params).reduce<Record<string, string>>((acc, [k, v]) => {
                        if (v !== undefined && v !== null) acc[k] = String(v);
                        return acc;
                    }, {})
                ).toString()
                : '';
            const url = params ? `${this.baseUrl}/search?${qs}` : null;

            return useFetch<TListType[]>(
                url,
                this.applyLoadMany,
                { loading: 'Searching...', fail: 'Search failed' }
            );
        };

        return (this._hooks = {
            useGetAll,
            useGetById,
            useSearch,
            useCreate,
            useUpdate,
            useDelete,
        });
    }
}
