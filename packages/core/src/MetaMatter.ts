import { TypeBuilder } from './util/TypeBuilder';
import { ENUM_KEY, PROPERTY_KEY } from './decorators';
import type { Constructor, PropertyTree, Type, Definition } from './type';

export class MetaMatter {
    static getPropertyTree<T>(object: Constructor<T>): PropertyTree<T> {
        return Reflect.getMetadata(PROPERTY_KEY, object) || {};
    }

    static getType<T>(object: Constructor<T>): Type<T> {
        const propertyMap = MetaMatter.getPropertyTree(object);
        const isEnum = Reflect.getMetadata(ENUM_KEY, object) || false;
        const prefix = object.name;
        const builder = new TypeBuilder();
        builder.setType(prefix);
        builder.setIsEnum(isEnum);
        builder.setIsArray(false);
        builder.setIsSubclass(false);
        builder.setIsNullable(false);
        builder.setBody(propertyMap);
        return builder.build();
    }

    static generateTypeDefinitions<T>(object: Constructor<T>) {
        return this.createTypeDefinitionFromTree(MetaMatter.getType(object));
    }

    private static createTypeDefinitionFromTree<T>(property: Type<T>, prefix?: string): Definition[] {
        const name = property.isSubclass && prefix ? `${prefix}$${property.type}` : property.type;
        const definitionType = property.isEnum ? 'enum' : 'interface';
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

        const stringifiedDefinitions = [
            definition,
            ...children.flatMap((_) => MetaMatter.createTypeDefinitionFromTree(_, name)),
        ].map((_) => JSON.stringify(_));
        const stringifiedDefinitionSet = Array.from(new Set([...stringifiedDefinitions]));

        return stringifiedDefinitionSet.map((_) => JSON.parse(_)).map(MetaMatter.sanitizeDefinition);
    }

    private static sanitizeDefinition(target: Definition): Definition {
        const regex = /("|,)/g;
        const enumRegex = /(=)/g;

        if (enumRegex.test(target.definition)) {
            return target;
        }

        return {
            ...target,
            definition: target.definition.replace(regex, ''),
        };
    }
}
