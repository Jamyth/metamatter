import { createMetadataKey } from "../util/createMetadataKey";

export const REQUEST_BODY_KEY = createMetadataKey("REQUEST_BODY");

export function RequestBody(type: Function): MethodDecorator {
    return (target: object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) => {
        Reflect.defineMetadata(REQUEST_BODY_KEY, type, descriptor.value);
    };
}
