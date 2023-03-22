import type { Definition } from "../type";
import { sanitizeDefinition } from "./sanitizeDefinition";

export function removeDuplicateTypes(...definitions: readonly Definition[]): Definition[] {
    const stringifiedDefinitions = definitions.map((definition) => JSON.stringify(definition));
    const definitionSet = new Set(stringifiedDefinitions);
    return Array.from(definitionSet)
        .map((_) => JSON.parse(_))
        .map(sanitizeDefinition);
}
