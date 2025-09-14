// File: utils/restApi/use-form.tsx
import React from 'react';
import type {IRestModel, PropertyMap, RestApiFormHooks, ValidationMap} from '@/utils/restApi/types';
import {useNavigate} from "react-router-dom";

export type UseFormReturn<T> = {
    data          : T;
    errors        : Record<keyof T & string, string>;
    isDirty       : boolean;
    isMutating    : boolean;
    isLoaded      : boolean;
    message       : string;

    handleChange  : (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    handleBlur    : (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    handleSubmit  : (e: React.FormEvent) => Promise<boolean>;
    reset         : () => void;

    // escape hatches / advanced
    setField: (key: keyof T & string, value: string) => void;
    setError: (key: keyof T & string, message: string | null) => void;
};

export function useForm<T extends IRestModel>(
    api          : RestApiFormHooks<T>,
    formMappers ?: PropertyMap<T>,
    validators  ?: ValidationMap<T>,
    id           : string | number | null = null,
    returnUrl    : string | null = null,
): UseFormReturn<T> {
    if (id === undefined || id === '') {
        throw new Error('[useForm] Invalid id: id must be null (for add) or a valid value (for edit).');
    }

    // Always call useGetById, but handle null id gracefully
    const navigate  = useNavigate();
    const result    = api.useGetById(id || null);
    const isLoaded  = id === null || !!result?.payload;

    const initialData = id
        ? result?.payload || ({} as T)
        : ({} as T);

    const isEditMode                = id != null;
    const { submit: create }        = api.useCreate();
    const { submit: update }        = isEditMode ? api.useUpdate(id as string | number) : api.useUpdate((0 as unknown) as string); // TODO: ensure api.useUpdate is never called when id is null
    const submitFn                  = isEditMode ? update : create;

    // Shared logic for form state, validation, etc.
    const [data, setData]           = React.useState<T>(initialData);
    const [errors, setErrors]       = React.useState<Record<keyof T & string, string>>({} as Record<keyof T & string, string>);
    const [isDirty, setDirty]       = React.useState<boolean>(false);
    const [message, setMessage]     = React.useState<string>('Loading...');
    const [isMutating, setMutating] = React.useState(false);

    // last synced snapshot & id for reset / clobber rules
    const lastSynced = React.useRef<T | null>(null);
    const lastLoadedId = React.useRef<string | number | null>(null);

    // Initial sync + resync on id change or when not dirty
    React.useEffect(() => {
        if (id === null || !result?.payload) {
            setMessage(id === null ? '' : 'Loading...');
            return;
        }

        const incomingId = result.payload.id;
        const idChanged = incomingId !== undefined && incomingId !== lastLoadedId.current;

        if (idChanged || !isDirty || lastSynced.current === null) {
            if (lastSynced.current !== result.payload) {
                setData(result.payload);
                setErrors({} as Record<keyof T & string, string>);
                setDirty(false);
                lastSynced.current = result.payload;
                lastLoadedId.current = incomingId ?? null;
            }
        }
    }, [id, result?.payload, isDirty]);

    // Helpers
    const validateField = React.useCallback((key: keyof T & string, value: unknown) => {
        const fn = validators?.[key];
        if (!fn) return null;
        const result = fn(value as string);
        return result.isValid ? null : result.message;
    }, [validators]);

    const setField = React.useCallback((key: keyof T & string, value: string) => {
        setData(prev => {
            const current = prev[key] as unknown;
            let nextValue: unknown = value;

            if (formMappers && formMappers[key]) {
                nextValue = formMappers[key](value);
            }
            else if( typeof current === 'number' ) {
                nextValue = value === '' ? '' : Number(value);
            }

            return {...prev, [key]: nextValue};
        });
        setDirty(true);
    }, [formMappers]);

    const setError = React.useCallback((key: keyof T & string, message: string | null) => {
        setErrors(prev => {
            const next = { ...prev };
            if (!message) delete next[key];
            else next[key] = message;
            return next;
        });
    }, []);

    const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const el = e.target;
        const key = el.name as keyof T & string;

        setField(key, e.target.value);
    }, [setField]);

    const handleBlur = React.useCallback((e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const el = e.target;
        const key = el.name as keyof T & string;
        const raw = el.type === 'checkbox' ? (el as HTMLInputElement).checked : el.value;

        el.classList.add('touched');

        const err = validateField(key, raw);
        setError(key, err);
    }, [setError, validateField]);

    const runAllValidators = React.useCallback(() => {
        const next: Record<string, string> = {};
        if (!validators) return next;

        for (const k in validators) {
            const key = k as keyof T & string;
            const fn = validators[key];
            if (!fn) continue;
            const result = fn(String(data[key]));
            if (!result.isValid) next[key] = result.message;
        }
        return next;
    }, [data, validators]);

    const handleSubmit = React.useCallback(async (e: React.FormEvent): Promise<boolean> => {
        e.preventDefault();
        if (isMutating) return false; // prevent double submit

        setMutating(true);

        try {
            const clientErrors = runAllValidators();
            if (Object.keys(clientErrors).length > 0) {
                setErrors(clientErrors as Record<keyof T & string, string>);
                return false;
            }

            const payload: T = lastLoadedId.current
                ? ({ ...data, id: lastLoadedId.current } as T)
                : data;

            const res = await submitFn(payload);

            if (res?.isSuccess) {
                setErrors({} as Record<keyof T & string, string>);
                setDirty(false);
                if (res.payload) {
                    setData(res.payload);
                    lastSynced.current = res.payload;
                }
                if( returnUrl ) {
                    navigate(returnUrl);
                }
                return true;
            } else if (res?.errors) {
                setErrors(res.errors as Record<keyof T & string, string>);
                if (!isLoaded) setMessage('Please resolve the errors above.');
                return false;
            }
            return false;
        } finally {
            setMutating(false);
        }
    }, [data, isMutating, isLoaded, navigate, returnUrl, runAllValidators, submitFn]);

    const reset = React.useCallback(() => {
        const baseline = lastSynced.current ?? (result?.payload ?? ({} as T));
        setData(baseline);
        setErrors({} as Record<keyof T & string, string>);
        setDirty(false);
    }, [result]);

    return {
        data,
        errors,
        isDirty,
        isMutating,
        isLoaded,
        message,

        handleChange,
        handleBlur,
        handleSubmit,
        reset,

        setField,
        setError
    };
}
