type ExcludeArray<T> = T extends (infer U)[] ? U : T;

export type Constructor<T = any> = new (...args: any[]) => T;
export type EnumType<T> = { [P in keyof T]: T[P] & string };
export interface Type<T> {
    type: string;
    isPrimitive: boolean;
    isArray: boolean;
    isEnum: boolean;
    isNullable: boolean;
    isSubclass: boolean;
    body: T extends object ? (object extends T ? T : { [P in keyof T]: Type<ExcludeArray<T[P]>> }) : null;
    toString: (prefix?: string) => string;
    toDefinition: (prefix?: string) => string;
}

export type PropertyTree<T> = Type<T>['body'];
export interface Definition {
    name: string;
    type: 'interface' | 'enum';
    definition: string;
}
