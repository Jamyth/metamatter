import type { Constructor, PropertyTree, Type, Definition } from './type';
export declare class Metabase {
    static getPropertyTree<T>(object: Constructor<T>): PropertyTree<T>;
    static getTypeFromTree<T>(object: Constructor<T>): Type<T>;
    static generateTypeDefinitions<T>(object: Constructor<T>): Definition[];
    private static createTypeDefinitionFromTree;
}
//# sourceMappingURL=Metabase.d.ts.map