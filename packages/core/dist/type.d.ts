declare type ExcludeArray<T> = T extends (infer U)[] ? U : T;
export declare type Constructor<T = any> = new (...args: any[]) => T;
export declare type EnumType<T> = {
    [P in keyof T]: T[P] & string;
};
export interface Type<T> {
    type: string;
    isPrimitive: boolean;
    isArray: boolean;
    isEnum: boolean;
    isNullable: boolean;
    isSubclass: boolean;
    prefix: string | null;
    body: T extends object ? (object extends T ? T : {
        [P in keyof T]: Type<ExcludeArray<T[P]>>;
    }) : null;
    toString: () => string;
    toDefinition: () => string;
}
export declare type PropertyTree<T> = Type<T>['body'];
export interface Definition {
    name: string;
    type: 'interface' | 'enum';
    definition: string;
}
export {};
//# sourceMappingURL=type.d.ts.map