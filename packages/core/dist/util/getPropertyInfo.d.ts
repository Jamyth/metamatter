import type { Constructor, EnumType, Type } from '../type';
interface PropertyInfo<T extends EnumType<T>> {
    isArray: boolean;
    isEnum: boolean;
    isNullable: boolean;
    isSubclass: boolean;
    prefix: string | null;
    body: T | null;
}
export declare function getPropertyInfo<T extends EnumType<T>>(object: Constructor | null, { isArray, isEnum, isNullable, isSubclass, body, prefix }: PropertyInfo<T>): Type<any>;
export {};
//# sourceMappingURL=getPropertyInfo.d.ts.map