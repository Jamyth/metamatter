import type { Definition } from "../type";

export function sanitizeDefinition(target: Definition): Definition {
    const regex = /("|,)/g;
    const enumRegex = /(=)/g;

    if (enumRegex.test(target.definition)) {
        return target;
    }

    return {
        ...target,
        definition: target.definition.replace(regex, ""),
    };
}
