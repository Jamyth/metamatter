import { RequestMethod } from "@nestjs/common";
export type RequestMethodType = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "ALL" | "OPTIONS" | "HEAD";

export interface ServiceMetadata {
    method: RequestMethod;
    path: string | string[];
    request: Function | null;
    response: Function | null;
}

export interface ServiceFunctionInfo {
    method: RequestMethodType;
    path: string;
    request: string | null;
    response: string | null;
    requestNode: Function | null;
    responseNode: Function | null;
}

export interface Service {
    name: string;
    methods: ServiceFunctionInfo[];
}

export abstract class Generator {
    abstract generate(controller: Function): Service;
}
