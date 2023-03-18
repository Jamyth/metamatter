import { Controller as NestController } from "@nestjs/common";
import { createMetadataKey } from "../util/createMetadataKey";
import type { ControllerOptions } from "@nestjs/common";

export const CONTROLLER_KEY = createMetadataKey("CONTROLLER");

function setup(target: Function) {
    Reflect.defineMetadata(CONTROLLER_KEY, true, target);
}

export function Controller(): ClassDecorator;
export function Controller(prefix: string | string[]): ClassDecorator;
export function Controller(options: ControllerOptions): ClassDecorator;
export function Controller(prefixOrOptions?: string | string[] | ControllerOptions): ClassDecorator {
    return (target: Function) => {
        setup(target);

        if (prefixOrOptions !== undefined) {
            NestController(prefixOrOptions as any)(target);
        } else {
            NestController()(target);
        }
    };
}
