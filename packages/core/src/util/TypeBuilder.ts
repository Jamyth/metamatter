import type { Type } from "../type";

export class TypeBuilder<T = object> {
    private isPrimitive: boolean;
    private isArray: boolean;
    private isNullable: boolean;
    private isEnum: boolean;
    private isSubclass: boolean;
    private type: string | null;
    private body: { [P in keyof T]: Type<T[P]> } | null;

    constructor() {
        this.isArray = false;
        this.isNullable = false;
        this.isEnum = false;
        this.isSubclass = false;
        this.body = null;
        this.type = null;
    }

    setType = (type: string) => {
        this.type = type;
        this.isPrimitive = this.isPrimitiveTypes();
        return this;
    };

    setIsEnum = (isEnum: boolean) => {
        this.isEnum = isEnum;
        return this;
    };

    setIsSubclass = (isSubclass: boolean) => {
        this.isSubclass = isSubclass;
        return this;
    };

    setIsArray = (isArray: boolean) => {
        this.isArray = isArray;
        return this;
    };

    setIsNullable = (isNullable: boolean) => {
        this.isNullable = isNullable;
        return this;
    };

    setBody = (body: { [P in keyof T]: Type<T[P]> } | null) => {
        this.body = body;
        return this;
    };

    build = (): Type<any> => {
        if (!this.type) {
            throw new Error("Type is not defined...");
        }

        if (!this.isPrimitive && !this.body) {
            throw new Error(`Type marked as "${this.type}", but body is not defined.`);
        }

        return {
            type: this.type,
            isPrimitive: this.isPrimitive,
            isArray: this.isArray,
            isEnum: this.isEnum,
            isNullable: this.isNullable,
            isSubclass: this.isSubclass,
            body: this.body,
            toString: this.toString,
            toDefinition: this.toDefinition,
        };
    };

    toString = (_prefix?: string) => {
        if (!this.type) {
            throw new Error("Type is not defined...");
        }

        const prefix = this.isSubclass && _prefix ? `${_prefix}$` : "";
        const arrayText = this.isArray ? "[]" : "";
        const nullableText = this.isNullable ? " | null" : "";

        return prefix + this.type + arrayText + nullableText + ";";
    };

    toDefinition = (prefix?: string) => {
        if (!this.body) {
            throw new Error("body is not defined");
        }

        if (this.isEnum) {
            const keys = Object.keys(this.body);
            const value = keys.map((_) => `${_} = "${_}",`);
            return `{${value.join("")}}`;
        }

        const fields = Object.entries(this.body).reduce((acc, [key, property]: any) => {
            return Object.assign(acc, { [key]: property.toString(prefix) });
        }, {});
        return JSON.stringify(fields);
    };

    private isPrimitiveTypes = () => {
        const primitives = ["string", "number", "boolean", "Date", "void"];
        return this.type ? primitives.includes(this.type) : false;
    };
}
