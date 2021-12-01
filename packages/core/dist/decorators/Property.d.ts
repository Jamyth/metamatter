import type { Constructor, EnumType } from '../type';
export declare const PROPERTY_KEY: string;
export interface PropertyOption {
    nullable?: boolean;
    isArray?: boolean;
    type?: Constructor;
}
export declare function Property<Enum extends EnumType<Enum>>({ type, isArray, nullable, }?: PropertyOption): PropertyDecorator;
//# sourceMappingURL=Property.d.ts.map