import { RequestMethod } from "@nestjs/common";
import { Generator } from "./Generator";

type RequestMethodType = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "ALL" | "OPTIONS" | "HEAD";

const METHOD_METADATA_KEY = "method";
const PATH_METADATA_KEY = "";

export class ServiceGenerator implements Generator {
    generate(controller: Function) {
        const methodNames = Object.getOwnPropertyNames(controller.prototype).filter((_) => _ !== "constructor");
        const methods = methodNames
            .map((_) => {
                const descriptor = Object.getOwnPropertyDescriptor(controller.prototype, _);

                const requestMethod = Reflect.getMetadata(METHOD_METADATA_KEY, descriptor!.value);

                if (typeof requestMethod === "number") {
                    const method = this.requestMapper(requestMethod);

                    return {
                        methodName: _,
                        methodType: method,
                    };
                }

                return null;
            })
            .filter((_) => _ !== null);

        return {
            name: `${controller.name}AJAXService`,
            methods,
        };
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
