import { createMetadataKey } from "../util/createMetadataKey";

export const PLATFORM_KEY = createMetadataKey("DOMAIN");

export function Platform(platform: string | string[]): ClassDecorator & MethodDecorator {
    return (target: object | Function, propertyKey?: string | symbol, descriptor?: TypedPropertyDescriptor<any>) => {
        const domainKeys = typeof platform === "string" ? [platform] : platform;
        if (propertyKey !== undefined && descriptor !== undefined) {
            Reflect.defineMetadata(PLATFORM_KEY, domainKeys, descriptor.value);
        } else {
            Reflect.defineMetadata(PLATFORM_KEY, domainKeys, target);
        }
    };
}
