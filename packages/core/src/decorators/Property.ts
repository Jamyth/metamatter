import { createMetadataKey } from "../util/createMetadataKey";
import { getPropertyInfo } from "../util/getPropertyInfo";
import { ENUM_KEY } from "./Enum";
import { SUBCLASS_KEY } from "./Subclass";
import type { Constructor, EnumType, Type } from "../type";

export const PROPERTY_KEY = createMetadataKey("PROPERTY");

interface Option {
    nullable?: boolean;
    type?: Constructor;
}

export type PropertyOption = Pick<Option, "nullable">;

export interface ArrayPropertyOption {
    nullable?: boolean;
    type: Constructor;
}

const defaultOptions: Option = {
    nullable: false,
};

function extractPropertyOfType(inferred: Constructor) {
    const isArray = inferred.name === "Array";
    const isEnum = Reflect.getMetadata(ENUM_KEY, inferred) || false;
    const isSubclass = Reflect.getMetadata(SUBCLASS_KEY, inferred) || false;

    return {
        isArray,
        isEnum,
        isSubclass,
    };
}

function assertConcreteTypeProvided(
    serializedKey: string,
    inferred: Constructor,
    provided: Constructor<any> | undefined,
) {
    const UNRESOLVABLE_TYPES = [Array.name, Promise.name];
    return UNRESOLVABLE_TYPES.forEach((name) => {
        if (inferred.name === name && !provided) {
            throw new Error(`Type of ${serializedKey} is inferred as "${name}", but type is not provided.`);
        }
    });
}

/**
 * attention:
 * This decorator used to define the type of currently property while generating client-side types
 * `Enum`, `Promise`, `Array` should explicitly provide in `options` parameter
 *
 * Nullable should consider `empty` instead of `null`
 * Nullable field should not have union type of null, e.g. 'string | null'
 *
 * @param {Option} options -- Provide external information of current property
 *
 * @example
 * class UserView {
 *     \@Property()
 *     name: string;
 *
 *     \@Property()
 *     age: number
 *
 *     \@Property({ nullable: true })
 *     phone?: string
 * }
 */
export function Property<Enum extends EnumType<Enum>>(options?: ArrayPropertyOption): PropertyDecorator;
export function Property<Enum extends EnumType<Enum>>(options?: PropertyOption): PropertyDecorator;
export function Property<Enum extends EnumType<Enum>>({
    type,
    nullable = false,
}: Option = defaultOptions): PropertyDecorator {
    return (target, key) => {
        const serializedKey = String(key);

        const propertyMap: Record<string, Type<any>> = Reflect.getMetadata(PROPERTY_KEY, target.constructor) || {};

        let inferredType: Constructor = Reflect.getMetadata("design:type", target, key);

        const { isArray } = extractPropertyOfType(inferredType);

        if (typeof inferredType === "undefined") {
            console.warn(`Type of ${serializedKey} is inferred as "undefined", make sure it is correct.`);
        }

        assertConcreteTypeProvided(serializedKey, inferredType, type);

        if (type) {
            inferredType = type;
        }

        const { isSubclass, isEnum } = extractPropertyOfType(inferredType);

        let body: Enum | null = null;

        if (isEnum) {
            body = Object.entries(inferredType).reduce(
                (acc, [key, value]: [string, string]) => Object.assign(acc, { [key]: value }),
                {} as Enum,
            );
        }

        propertyMap[serializedKey] = getPropertyInfo(inferredType, {
            isArray,
            isSubclass,
            isNullable: nullable,
            isEnum,
            body,
        });

        Reflect.defineMetadata(PROPERTY_KEY, propertyMap, target.constructor);
    };
}
