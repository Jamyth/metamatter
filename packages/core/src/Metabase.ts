import { TypeBuilder } from './util/TypeBuilder';
import { ENUM_KEY, PROPERTY_KEY } from './decorators';
import type { Constructor, PropertyTree, Type, Definition } from './type';

export class Metabase {
    static getPropertyTree<T>(object: Constructor<T>): PropertyTree<T> {
        return Reflect.getMetadata(PROPERTY_KEY, object) || {};
    }

    static getTypeFromTree<T>(object: Constructor<T>): Type<T> {
        const propertyMap = Metabase.getPropertyTree(object);
        const isEnum = Reflect.getMetadata(ENUM_KEY, object) || false;
        const prefix = object.name;
        const builder = new TypeBuilder();
        builder.setType(prefix);
        builder.setIsEnum(isEnum);
        builder.setIsArray(false);
        builder.setIsSubclass(false, null);
        builder.setIsNullable(false);
        builder.setBody(propertyMap);
        return builder.build();
    }

    static generateTypeDefinitions<T>(object: Constructor<T>) {
        return this.createTypeDefinitionFromTree(Metabase.getTypeFromTree(object));
    }

    private static createTypeDefinitionFromTree<T>(property: Type<T>, prefix?: string): Definition[] {
        const name = property.isSubclass && prefix ? `${prefix}$${property.type}` : property.type;
        const definitionType = property.isEnum ? 'enum' : 'interface';
        const rawDefinition = property.toDefinition();

        const definition: Definition = {
            name,
            type: definitionType,
            definition: rawDefinition,
        };

        if (property.isEnum) {
            return [definition];
        }

        const children: Type<any>[] = property.body
            ? Object.values(property.body).filter((_: Type<any>) => !_.isPrimitive)
            : [];

        return [definition, ...children.flatMap((_) => Metabase.createTypeDefinitionFromTree(_, name))];
    }
}
