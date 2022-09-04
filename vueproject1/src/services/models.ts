export enum StateValue {
    Ok = 0,
    Error = 1
}

export interface ApiResult<Type> {
    State: StateValue,
    Error: string,
    Value: Type
}

export interface User {
    displayname: string
}

export interface Contract {
    id: number,
    name: string,
    company: string,
    city: string,
    expires: string,
    latitude: number,
    longitude: number,
}

export interface Product {
    id: number,
    name: string,
    amount: number,
    color: string
}
