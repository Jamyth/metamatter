import { TypeBuilder } from "./util/TypeBuilder";
import { ENUM_KEY, PROPERTY_KEY } from "./decorators";
import { removeDuplicateTypes } from "./util/removeDuplicateTypes";
import type { Constructor, PropertyTree, Type, Definition } from "./type";

export class MetaMatter {
    static getPropertyTree<T>(object: Constructor<T>): PropertyTree<T> {
        return Reflect.getMetadata(PROPERTY_KEY, object) || {};
    }

    static getType<T>(object: Constructor<T>): Type<T> {
        const propertyMap = MetaMatter.getPropertyTree(object);
        const isEnum = Reflect.getMetadata(ENUM_KEY, object) || false;
        const prefix = object.name;
        const builder = new TypeBuilder();
        return builder
            .setType(prefix)
            .setIsEnum(isEnum)
            .setIsArray(false)
            .setIsSubclass(false)
            .setIsNullable(false)
            .setBody(isEnum ? object : propertyMap)
            .build();
    }

    static generateTypeDefinitions<T>(object: Constructor<T>): Definition[] {
        return this.createTypeDefinitionFromTree(MetaMatter.getType(object));
    }

    private static createTypeDefinitionFromTree<T>(property: Type<T>, prefix?: string): Definition[] {
        const name = property.isSubclass && prefix ? `${prefix}$${property.type}` : property.type;
        const definitionType = property.isEnum ? "enum" : "interface";
        const rawDefinition = property.toDefinition(name);

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

        return removeDuplicateTypes(
            definition,
            ...children.flatMap((_) => MetaMatter.createTypeDefinitionFromTree(_, name)),
        );
    }
}
