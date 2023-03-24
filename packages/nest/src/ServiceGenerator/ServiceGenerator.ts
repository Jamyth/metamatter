import { RequestMethod } from "@nestjs/common";
import type {
    ServiceGeneratorBase,
    RequestMethodType,
    Service,
    ServiceFunctionInfo,
    ServiceMetadata,
} from "./ServiceGeneratorBase";
import { REQUEST_BODY_KEY } from "../decorators/RequestBody";
import { RESPONSE_DATA_KEY, RESPONSE_ARRAY_DATA_KEY } from "../decorators/ResponseData";
import { ClassNameBuilder } from "../util/ClassNameBuilder";
import { PLATFORM_KEY } from "../decorators/Platform";

const METHOD_METADATA_KEY = "method";
const PATH_METADATA_KEY = "path";

export interface ParserConfig {
    globalPrefix: string | undefined;
    platform: string | undefined;
}

export class ServiceGenerator implements ServiceGeneratorBase {
    private globalPrefix: string;
    private platform: string | null;

    constructor(config: ParserConfig) {
        const { globalPrefix, platform } = config;
        this.globalPrefix = globalPrefix || "";
        this.platform = platform ?? null;
    }

    generate(controllers: Function[]): Service[] {
        return controllers
            .map((controller) => {
                const controllerBasePath = Reflect.getMetadata(PATH_METADATA_KEY, controller);

                const serviceFunctionInfos = this.extractFunctionKeys(controller)
                    .map((key) => this.extractFunctionMetadata(controller, key))
                    .filter((_): _ is ServiceMetadata => _ !== null)
                    .flatMap((metadata) => this.generateServiceFunctionInfo(metadata, controllerBasePath));

                if (!serviceFunctionInfos.length) {
                    return null;
                }

                return {
                    name: controller.name,
                    methods: serviceFunctionInfos,
                };
            })
            .filter((_): _ is Service => _ !== null);
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
        const responseData: Function | null = Reflect.getMetadata(RESPONSE_DATA_KEY, actualFn) || null;
        const classPlatformKeys: string[] = Reflect.getMetadata(PLATFORM_KEY, controller) || [];
        const platformKeys: string[] = Reflect.getMetadata(PLATFORM_KEY, actualFn) || [];
        const isResponseArray: boolean = Reflect.getMetadata(RESPONSE_ARRAY_DATA_KEY, actualFn) || false;

        const shouldSkip = this.platform !== null && ![...platformKeys, ...classPlatformKeys].includes(this.platform);

        if (requestMethod === null || shouldSkip) {
            return null;
        }

        return {
            name: functionKey,
            isResponseArray,
            method: requestMethod,
            path: requestPath,
            request: requestBody,
            response: responseData,
        };
    }

    private generateServiceFunctionInfo(config: ServiceMetadata, controllerBasePath: string): ServiceFunctionInfo[] {
        const path = config.path;

        const paths = Array.isArray(path) ? path : [path];

        return paths.map((path) => {
            const request = config.request ? new ClassNameBuilder(config.request).build() : null;
            const response = config.response
                ? new ClassNameBuilder(config.response).setIsArrayType(config.isResponseArray).build()
                : null;

            return {
                name: config.name,
                path: this.joinPath(this.globalPrefix, controllerBasePath, path),
                method: this.requestMapper(config.method),
                request,
                response,
            };
        });
    }

    private joinPath(...paths: string[]) {
        const pathSegments = paths
            .join("/")
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
