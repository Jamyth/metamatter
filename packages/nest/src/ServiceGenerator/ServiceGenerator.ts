import { RequestMethod } from "@nestjs/common";
import { Generator, RequestMethodType, ServiceFunctionInfo, ServiceMetadata } from "./Generator";
import { REQUEST_BODY_KEY } from "../decorators/RequestBody";
import { RESPONSE_DATA_KEY } from "../decorators/ResponseData";

const METHOD_METADATA_KEY = "method";
const PATH_METADATA_KEY = "path";

export class ServiceGenerator implements Generator {
    // TODO/Jamyth Refactor
    generate(controller: Function) {
        const controllerBasePath = Reflect.getMetadata(PATH_METADATA_KEY, controller);
        const serviceFunctionInfos = this.extractFunctionKeys(controller)
            .map((key) => this.extractFunctionMetadata(controller, key))
            .filter((_): _ is ServiceMetadata => _ !== null)
            .flatMap((metadata) => this.generateServiceFunctionInfo(metadata, controllerBasePath));

        return {
            name: controller.name,
            methods: serviceFunctionInfos,
        };
    }

    private extractFunctionKeys(controller: Function) {
        const controllerPrototype = controller.prototype;
        const propertyNames = Object.getOwnPropertyNames(controllerPrototype);
        const functionNames: string[] = [];

        for (const property of propertyNames) {
            if (typeof controllerPrototype[property] === "function" && property !== "constructor") {
                functionNames.push(property);
            }
        }

        return functionNames;
    }

    private extractFunctionMetadata(controller: Function, functionKey: string): ServiceMetadata | null {
        const controllerPrototype = controller.prototype;
        const descriptor = Object.getOwnPropertyDescriptor(controllerPrototype, functionKey);

        if (!descriptor) {
            return null;
        }

        const actualFn = descriptor.value;
        const requestMethod: RequestMethod = Reflect.getMetadata(METHOD_METADATA_KEY, actualFn) ?? null;
        const requestPath: string | string[] = Reflect.getMetadata(PATH_METADATA_KEY, actualFn);
        const requestBody: Function | null = Reflect.getMetadata(REQUEST_BODY_KEY, actualFn) || null;
        const responseData: Function = Reflect.getMetadata(RESPONSE_DATA_KEY, actualFn) || null;

        if (requestMethod === null) {
            return null;
        }

        return {
            method: requestMethod,
            path: requestPath,
            request: requestBody,
            response: responseData,
        };
    }

    private generateServiceFunctionInfo(config: ServiceMetadata, controllerBasePath: string): ServiceFunctionInfo[] {
        const path = config.path;

        const paths = Array.isArray(path) ? path : [path];

        return paths.map((path) => ({
            path: this.joinPath(controllerBasePath, path),
            method: this.requestMapper(config.method),
            request: config.request?.name ?? null,
            // TODO/Jamyth what if response is an array ?
            response: config.response?.name ?? null,
            requestNode: config?.request ?? null,
            responseNode: config?.response ?? null,
        }));
    }

    private joinPath(...paths: string[]) {
        const pathSegments = paths
            .join("")
            .split("/")
            .filter((_) => _ !== "");

        if (!pathSegments.length) {
            return "/";
        }

        return `/${pathSegments.join("/")}`;
    }

    private requestMapper(method: RequestMethod): RequestMethodType {
        switch (method) {
            case RequestMethod.GET:
                return "GET";
            case RequestMethod.POST:
                return "POST";
            case RequestMethod.PUT:
                return "PUT";
            case RequestMethod.DELETE:
                return "DELETE";
            case RequestMethod.PATCH:
                return "PATCH";
            case RequestMethod.ALL:
                return "ALL";
            case RequestMethod.OPTIONS:
                return "OPTIONS";
            case RequestMethod.HEAD:
                return "HEAD";
        }
    }
}
