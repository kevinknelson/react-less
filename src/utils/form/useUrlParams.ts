// File: utils/router/useUrlParams.ts
import { useSearchParams } from "react-router-dom";
import { TypeParser } from "@/utils/form/TypeParser";

function fail(msg: string): never {
    throw new Error(msg);
}

export type UrlParams = {
    require(name: string): string;
    get(name: string, defaultValue: string | null): string | null;

    /** Boolean (1,0,yes,no,true,false). */
    requireBool(name: string): boolean;
    getBool(name: string, defaultValue: boolean | null): boolean | null;

    /** Integer. */
    requireInt(name: string): number;
    getInt(name: string, defaultValue: number | null): number | null;

    /** Float. */
    requireFloat(name: string): number;
    getFloat(name: string, defaultValue: number | null): number | null;

    /** Date. */
    requireDate(name: string): Date;
    getDate(name: string, defaultValue: Date | string | null): Date | null;

    has(name: string): boolean;

    raw: URLSearchParams;
};

export function useUrlParams(): UrlParams {
    const [sp] = useSearchParams();

    const require = (name: string): string => {
        const raw = sp.get(name); // string | null
        if (TypeParser.isEmpty(raw)) {
            throw new Error(
                `Required query parameter "${name}" is empty ${JSON.stringify(raw)}.`
            );
        }
        return raw as string;
    };

    const get = (name: string, defaultValue: string | null = null): string | null => {
        const raw = sp.get(name);
        return TypeParser.isEmpty(raw) ? defaultValue : (raw as string);
    };

    const requireBool = (name: string): boolean => {
        // If missing/empty, TypeParser.requireBool will throw
        return TypeParser.requireBool(sp.get(name));
    };

    const getBool = (name: string, defaultValue: boolean | null = null): boolean | null => {
        return TypeParser.getBoolOrDefault(sp.get(name), defaultValue);
    };

    const requireInt = (name: string): number => {
        const raw = sp.get(name);
        if (TypeParser.isEmpty(raw)) {
            return fail(`Required integer query parameter "${name}" is missing or empty.`);
        }
        return TypeParser.requireInt(raw as string);
    };

    const getInt = (name: string, defaultValue: number | null = null): number | null => {
        return TypeParser.getIntOrDefault(sp.get(name), defaultValue);
    };

    const requireFloat = (name: string): number => {
        const raw = sp.get(name);
        if (TypeParser.isEmpty(raw)) {
            return fail(`Required float query parameter "${name}" is missing or empty.`);
        }
        return TypeParser.requireFloat(raw as string);
    };

    const getFloat = (name: string, defaultValue: number | null = null): number | null => {
        return TypeParser.getFloatOrDefault(sp.get(name), defaultValue);
    };

    const requireDate = (name: string): Date => {
        const raw = sp.get(name);
        if (TypeParser.isEmpty(raw)) {
            return fail(`Required date query parameter "${name}" is missing or empty.`);
        }
        return TypeParser.requireDate(raw as string);
    };

    const getDate = (
        name: string,
        defaultValue: Date | string | null = null
    ): Date | null => {
        return TypeParser.getDateOrDefault(sp.get(name), defaultValue);
    };

    const has = (name: string) => sp.has(name);

    return {
        require,
        get,
        requireBool,
        getBool,
        requireInt,
        getInt,
        requireFloat,
        getFloat,
        requireDate,
        getDate,
        has,
        raw: sp,
    };
}
