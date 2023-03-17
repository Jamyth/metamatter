import { Module as NestModule } from "@nestjs/common";
import { createMetadataKey } from "../util/createMetadataKey";
import type { ModuleMetadata } from "@nestjs/common";

export const MODULE_KEY = createMetadataKey("MODULE");

function setup(target: Function) {
    Reflect.defineMetadata(MODULE_KEY, true, target);
}

export function Module(metadata: ModuleMetadata): ClassDecorator {
    return (target: Function) => {
        setup(target);
        NestModule(metadata)(target);
    };
}
