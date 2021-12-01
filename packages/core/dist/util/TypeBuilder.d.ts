import type { Type } from '../type';
export declare class TypeBuilder<T = object> {
    private isPrimitive;
    private isArray;
    private isNullable;
    private isEnum;
    private isSubclass;
    private prefix;
    private type;
    private body;
    constructor();
    setType: (type: string) => this;
    setIsEnum: (isEnum: boolean) => this;
    setIsSubclass: (isSubclass: boolean, prefix: string | null) => this;
    setIsArray: (isArray: boolean) => this;
    setIsNullable: (isNullable: boolean) => this;
    setBody: (body: { [P in keyof T]: Type<T[P]>; } | null) => this;
    build: () => Type<any>;
    toString: () => string;
    toDefinition: () => string;
    private isPrimitiveTypes;
}
//# sourceMappingURL=TypeBuilder.d.ts.map