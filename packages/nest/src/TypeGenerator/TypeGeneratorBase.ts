import type { Definition } from "@metamatter/core";

export abstract class TypeGeneratorBase {
    abstract generate(controllers: Function[]): Definition[];
}
