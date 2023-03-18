import { createMetadataKey } from "../util/createMetadataKey";

export const RESPONSE_DATA_KEY = createMetadataKey("RESPONSE_DATA");

export function ResponseData(type?: Function): MethodDecorator {
    return (target: object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) => {
        Reflect.defineMetadata(RESPONSE_DATA_KEY, type ?? null, descriptor.value);
    };
}
