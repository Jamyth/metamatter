import { createMetadataKey } from "../util/createMetadataKey";

export const RESPONSE_DATA_KEY = createMetadataKey("RESPONSE_DATA");
export const RESPONSE_ARRAY_DATA_KEY = createMetadataKey("RESPONSE_ARRAY_DATA");

export function ResponseData(type?: Function): MethodDecorator {
    return (target: object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) => {
        Reflect.defineMetadata(RESPONSE_ARRAY_DATA_KEY, false, descriptor.value);
        Reflect.defineMetadata(RESPONSE_DATA_KEY, type ?? null, descriptor.value);
    };
}

export function ResponseArrayData(type?: Function): MethodDecorator {
    return (target, propertyKey, descriptor: TypedPropertyDescriptor<any>) => {
        Reflect.defineMetadata(RESPONSE_ARRAY_DATA_KEY, true, descriptor.value);
        ResponseData(type)(target, propertyKey, descriptor);
    };
}
