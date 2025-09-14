import { ValidationHandler } from "@/utils/restApi/validation";
import { RestApi, type IRestModel } from "@/utils/restApi";
import { DateTimeString } from "@/utils/valueTypes/DateTimeString";
import type { ValidationMap } from "@/utils/restApi/types";

const api = import.meta.env.VITE_API_URL;

export interface Group extends IRestModel {
    name            : string,
    score           : number,
    createdDateTime : DateTimeString,
    owner           : string,
}

const handler       = new ValidationHandler<Group>();
export const GroupValidation : ValidationMap<Group> = {
    name            : handler.validateRequired('name'),
    owner           : handler.validateRequired('owner'),
};

export const GroupFormMapper = {
    createdDateTime: (value: string) => DateTimeString.fromForm(value)
};


export const GroupApi = RestApi.createApi<Group, Group>(`${api}/groups`)
    .withListMapper( json => ({
        ...json as Group,
        createdDateTime : new DateTimeString(json.createdDateTime)
    }))
    .withLoadMapper( json => ({
        ...json as Group,
        createdDateTime : new DateTimeString(json.createdDateTime)
    }))
    .withSaveMapper( obj => ({
        ...obj,
        createdDateTime : obj.createdDateTime.toString()
    }))
    .makeHooks();