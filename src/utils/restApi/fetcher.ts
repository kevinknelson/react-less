// /utils/rest-api/fetcher.ts
import type { IRestResponse } from './types';

const doWrap = (import.meta.env.VITE_RESTAPI_WRAP ?? '').toLowerCase() === 'true';

// Accept an object (we'll stringify it), a string, or nothing.
// We intentionally don't expose BodyInit here; this type is only for the *input*
// you pass to this helper, which we convert into a proper RequestInit.body.
export type JsonInit = Omit<RequestInit, 'body'> & { body?: unknown };

export interface UserError<T = unknown> extends Error {
    status?: number;
    response?: IRestResponse<T>;
    sendResponse?: true;
}

// ----------------- small helpers (no any) -----------------
function isObject(v: unknown): v is Record<string, unknown> {
    return typeof v === 'object' && v !== null;
}

function toRequestBody(input: unknown): string | undefined {
    if (input == null) return undefined;                 // undefined for fetch
    if (typeof input === 'string') return input;         // pass-through string
    return JSON.stringify(input);                        // JSON for objects/arrays/other primitives
}

export class Fetcher {
    /**
     * Always return an IRestResponse<T>.
     * - When doWrap=true, we wrap raw payloads.
     * - When doWrap=false, we assume the server already returns IRestResponse<T>.
     */
    private wrapResponse<T>(payload: unknown): IRestResponse<T> {
        if (doWrap) {
            if (isObject(payload) && 'isSuccess' in payload) {
                // Helpful diagnostic if server already wrapped
                 
                console.error(
                    '[RestApi] VITE_RESTAPI_WRAP=true, but response already has `isSuccess`. ' +
                    'Possible double wrapping or misconfigured API.'
                );
            }
            return { isSuccess: true, message: null, errors: null, payload: payload as T };
        }
        return payload as IRestResponse<T>;
    }

    public fetch = async <T>(url: string, init?: RequestInit): Promise<IRestResponse<T>> => {
        const res  = await fetch(url, init);
        const json = this.wrapResponse<T>(await res.json());

        if (!res.ok) {
            const err: UserError<T> = new Error(`${res.status}: ${json?.message ?? res.statusText}`);
            err.status = res.status;
            throw err;
        }
        if (json && json.isSuccess === false) {
            const err: UserError<T> = new Error(json.message || 'Request failed');
            err.sendResponse = true;
            err.response = json;
            throw err;
        }
        return json;
    };

    public fetchWithMutation = async <T>(
        url: string,
        { arg }: { arg: JsonInit }
    ): Promise<IRestResponse<T>> => {
        const init: RequestInit = {
            method  : arg?.method ?? 'POST',
            headers : { 'Content-Type': 'application/json', ...(arg?.headers ?? {}) },
            body    : toRequestBody(arg?.body),
        };
        return this.fetch<T>(url, init);
    };
}
