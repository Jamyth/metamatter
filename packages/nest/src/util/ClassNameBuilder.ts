export class ClassNameBuilder {
    private isArrayType: boolean;

    constructor(private module: Function) {
        this.isArrayType = false;
    }

    setIsArrayType(isArrayType: boolean) {
        this.isArrayType = isArrayType;
        return this;
    }

    build(): string {
        if (this.isArrayType) {
            return `${this.module.name}[]`;
        }

        return this.module.name;
    }
}
