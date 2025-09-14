import type { ValidationResult } from "./types";


export class ValidationHandler<T> {
    public validateRequired (key: keyof T & string, message : string = 'Required') : ( value : string ) => ValidationResult<T> {
        return ( value : string ) => {
            if( value === null || value === undefined || value === '' ) {
                return { isValid: false, key, message };
            }
            return { isValid: true, key, message: '' };
        }
    }

    public validateMatch (key: keyof T & string, regex : RegExp, allowEmpty : boolean = false, message : string = 'Invalid value') : ( value : string ) => ValidationResult<T> {
        return ( value : string ) => {
            const isEmpty = ( value === null || value === undefined || value === '' );
            const isValid = allowEmpty && isEmpty ? true : regex.test(value);
            if( !isValid ) {
                return { isValid: false, key, message };
            }
            return { isValid: true, key, message: '' };
        }
    }

    public validateEmail( key: keyof T & string, allowEmpty : boolean = false, message : string = 'Invalid email address' ) : ( value : string ) => ValidationResult<T> {
        const emailRegex = /^[\w'+-]+(?:\.[\w'+-]+)*@[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)*\.[a-z]{2,63}$/i;
        return this.validateMatch(key, emailRegex, allowEmpty, message);
    }
}

