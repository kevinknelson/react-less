export interface IRestResponse<T> {
    isSuccess   : boolean;
    message     : string | null;
    errors      : Record<string, string> | null;
    payload     : T | null;
}

export interface IRestModel {
    id      : number | string;
}

export type ValidationResult<T> = {
    isValid : boolean;
    key     : keyof T & string;
    message : string;
}

export type ValidationMap<T>        = Partial<Record<keyof T & string, (value: string) => ValidationResult<T>>>;
export type PropertyMap<T>          = Partial<Record<keyof T & string, (value: string) => unknown>>
export type SearchParams            = Record<string, string | number | boolean | null | undefined>;

export type ValidationCallback<T>   = () => ValidationMap<T>;
export type MapperCallback<T>       = () => PropertyMap<T>;


//    getValidators   : () => Partial<Record<keyof TDetail & string, (value: string) => ValidationResult<TDetail>>>;
//    getFormMappers  : () => Partial<Record<keyof TDetail & string, (value: string) => unknown>>;


export type RestApiFormHooks<T extends IRestModel> = {
    useGetById      : (id: string | number | null) => IRestResponse<T> | undefined;
    useCreate       : () => {
        submit          : (payload: T) => Promise<IRestResponse<T>>;
        response        : IRestResponse<T> | undefined;
        error           : unknown;
        isMutating      : boolean;
    };
    useUpdate       : (id: string | number) => {
        submit          : (payload: T) => Promise<IRestResponse<T>>;
        response        : IRestResponse<T> | undefined;
        error           : unknown;
        isMutating      : boolean;
    };
    useDelete       : (id: string | number) => {
        submit          : () => Promise<IRestResponse<T>>;
        response        : IRestResponse<T> | undefined;
        error           : unknown;
        isMutating      : boolean;
    };
}
export type RestApiHooks<TSummary extends IRestModel, TDetail extends IRestModel>  = RestApiFormHooks<TDetail> & {
    useGetAll       : () => IRestResponse<TSummary[]> | undefined;
    useSearch       : (params: SearchParams | null) => IRestResponse<TSummary[]> | undefined;
};