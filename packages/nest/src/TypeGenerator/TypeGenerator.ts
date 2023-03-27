import type { Definition } from "@metamatter/core";
import { MetaMatter, removeDuplicateTypes } from "@metamatter/core";
import type { TypeGeneratorBase } from "./TypeGeneratorBase";
import { REQUEST_BODY_KEY } from "../decorators/RequestBody";
import { RESPONSE_DATA_KEY } from "../decorators/ResponseData";
import { PLATFORM_KEY } from "../decorators/Platform";

export class TypeGenerator implements TypeGeneratorBase {
    private readonly platform: string | null;

    constructor(platform: string | undefined) {
        this.platform = platform ?? null;
    }

    generate(controllers: Function[]): Definition[] {
        return removeDuplicateTypes(
            ...controllers.flatMap((controller) => {
                const serviceFunctionInfos = this.extractFunctionKeys(controller).flatMap((key) =>
                    this.extractFunctionMetadata(controller, key),
                );

                return serviceFunctionInfos.flatMap((_) => MetaMatter.generateTypeDefinitions(_ as any));
            }),
        );
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

    private extractFunctionMetadata(controller: Function, functionKey: string): Function[] {
        const controllerPrototype = controller.prototype;
        const descriptor = Object.getOwnPropertyDescriptor(controllerPrototype, functionKey);
        const nodes: Function[] = [];

        if (!descriptor) {
            return nodes;
        }

        const actualFn = descriptor.value;
        const classPlatformKeys: string[] = Reflect.getMetadata(PLATFORM_KEY, controller) || [];
        const platformKeys: string[] = Reflect.getMetadata(PLATFORM_KEY, actualFn) || [];
        const requestBody: Function | null = Reflect.getMetadata(REQUEST_BODY_KEY, actualFn) || null;
        const responseData: Function | null = Reflect.getMetadata(RESPONSE_DATA_KEY, actualFn) || null;

        const shouldSkip = this.platform !== null && ![...platformKeys, ...classPlatformKeys].includes(this.platform);

        if (shouldSkip) {
            return [];
        }

        if (requestBody !== null) {
            nodes.push(requestBody);
        }
        if (responseData !== null) {
            nodes.push(responseData);
        }

        return nodes;
    }
}
