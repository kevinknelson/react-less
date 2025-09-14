export class TypeParser {
    private static _emptyStrings : string[]  = ['', '0', 'false', 'null'];
    private static _emptyValues  : unknown[] = [0, false, NaN, null, undefined];
    private static _trueOptions  : string[]  = ['1', 'true', 'yes'];
    private static _falseOptions : string[]  = ['0', 'false', 'no'];

    public static isEmpty( value : unknown ): boolean {
        if( typeof value === 'string' ) {
            return TypeParser._emptyStrings.includes(value.toLowerCase());
        }
        return TypeParser._emptyValues.includes(value);
    }

    public static parseDate(raw: string): Date | null {
        const d = new Date(raw);
        return Number.isNaN(d.getTime()) ? null : d;
    }

    public static requireDate( value: Date | string ) : Date {
        const result = TypeParser.getDateOrDefault(value, null);
        if( result == null ) {
            throw new Error(`Invalid date value ${JSON.stringify(value)} submitted to TypeParser.requireDate`);
        }
        return result;
    }

    public static getDateOrDefault( value: Date | string | null | undefined, defaultValue : Date | string | null = null): Date | null {
        let result     = defaultValue ?? null;
        if( value instanceof Date ) {
            result     = value;
        }
        else if( value !== undefined && value !== null && value !== '' ) {
            result     = TypeParser.parseDate(value);
        }

        if( result instanceof Date ) {
            return result;
        }
        if( defaultValue instanceof Date ) {
            return defaultValue;
        }
        if( typeof defaultValue === 'string' ) {
            return TypeParser.parseDate(defaultValue);
        }
        
        return defaultValue;
    }

    public static requireBool( value: string | boolean | number | null | undefined ) : boolean {
        const result = TypeParser.getBoolOrDefault(value, null);
        if( result == null ) {
            throw new Error(`Invalid boolean value ${JSON.stringify(value)} submitted to TypeParser.requireBool`);
        }
        return result;
    }

    public static getBoolOrDefault( value: string | boolean | number | null | undefined, defaultValue : boolean | null = null ): boolean | null {
        const stringValue   = value?.toString().toLowerCase() ?? '';
        if( TypeParser._trueOptions.includes(stringValue) ) {
            return true;
        }
        if( TypeParser._falseOptions.includes(stringValue) ) {
            return false;
        }
        return defaultValue;
    }

    public static requireInt( value: string | number ) : number {
        const result = TypeParser.getIntOrDefault(value);
        if( result == null ) {
            throw new Error(`Invalid integer value ${JSON.stringify(value)} submitted to TypeParser.requireInt`);
        }
        return result;
    }

    public static getIntOrDefault( value: string | number | null | undefined, defaultValue : number | null = null ): number | null {
        if( typeof value === "number" ) {
            return value;
        }
        if( typeof value === "string" ) {
            const parsed = parseInt(value, 10);
            if( !isNaN(parsed) ) {
                return parsed;
            }
        }
        return defaultValue;
    }

    public static requireFloat( value: string | number ) : number {
        const result = TypeParser.getFloatOrDefault(value);
        if( result == null ) {
            throw new Error(`Invalid float value ${JSON.stringify(value)} submitted to TypeParser.requireFloat`);
        }
        return result;
    }

    public static getFloatOrDefault( value: string | number | null | undefined, defaultValue : number | null = null ): number | null {
        if( typeof value === "number" ) {
            return value;
        }
        if( typeof value === "string" ) {
            const parsed = parseFloat(value);
            if( !isNaN(parsed) ) {
                return parsed;
            }
        }
        return defaultValue;
    }
}