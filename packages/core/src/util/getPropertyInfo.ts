import { TypeBuilder } from './TypeBuilder';
import { PROPERTY_KEY } from '../decorators/Property';
import type { Constructor, EnumType, Type } from '../type';

interface PropertyInfo<T extends EnumType<T>> {
    isArray: boolean;
    isEnum: boolean;
    isNullable: boolean;
    isSubclass: boolean;
    body: T | null;
}

export function getPropertyInfo<T extends EnumType<T>>(
    object: Constructor | null,
    { isArray, isEnum, isNullable, isSubclass, body }: PropertyInfo<T>,
) {
    const builder = new TypeBuilder();
    builder.setIsArray(isArray);
    builder.setIsNullable(isNullable);
    builder.setIsEnum(isEnum);
    builder.setIsSubclass(isSubclass);

    if (object !== null) {
        switch (object) {
            case String:
            case Number:
            case Boolean:
                builder.setType(object.name.toLowerCase());
                break;
            case Date:
                builder.setType(Date.name);
                break;
            default: {
                const propertyMap: { [P in keyof T]: Type<T[P]> } = body
                    ? body
                    : // TODO
                      // Find out why use `object` instead of `object.constructor`
                      Reflect.getMetadata(PROPERTY_KEY, object);
                builder.setBody(propertyMap || null);
                builder.setType(object.name);
                break;
            }
        }
    } else {
        builder.setType('void');
    }

    return builder.build();
}
