import { createMetadataKey } from '../util/createMetadataKey';
import { getPropertyInfo } from '../util/getPropertyInfo';
import { ENUM_KEY } from './Enum';
import { SUBCLASS_KEY } from './Subclass';
import type { Constructor, EnumType, Type } from '../type';

export const PROPERTY_KEY = createMetadataKey('PROPERTY');

export interface PropertyOption {
    nullable?: boolean;
    isArray?: boolean;
    type?: Constructor;
}

const defaultOptions: PropertyOption = {
    nullable: false,
    isArray: false,
};

/**
 * attention:
 * This decorator used to define the type of currently property while generating client-side types
 * `Enum`, `Promise`, `Array` should explicitly provide in `options` parameter
 *
 * Nullable should consider `empty` instead of `null`
 *
 * @param {PropertyOption} options -- Provide external information of current property
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
export function Property<Enum extends EnumType<Enum>>({
    type,
    isArray = false,
    nullable = false,
}: PropertyOption = defaultOptions): PropertyDecorator {
    return (target, key) => {
        const serializedKey = String(key);

        const propertyMap: Record<string, Type<any>> = Reflect.getMetadata(PROPERTY_KEY, target.constructor) || {};

        const inferredType: Constructor = type ? type : Reflect.getMetadata('design:type', target, key);

        if (typeof inferredType === undefined) {
            console.warn(`Type of ${serializedKey} is inferred as "undefined", make sure it is correct.`);
        }

        const isEnum = Reflect.getMetadata(ENUM_KEY, inferredType) || false;
        const isSubclass = Reflect.getMetadata(SUBCLASS_KEY, inferredType) || false;
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
            prefix: isSubclass ? target.constructor.name : null,
        });

        Reflect.defineMetadata(PROPERTY_KEY, propertyMap, target.constructor);
    };
}
