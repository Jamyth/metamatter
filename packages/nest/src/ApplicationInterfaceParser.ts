import { MODULE_KEY } from "./decorators/Module";
import { CONTROLLER_KEY } from "./decorators/Controller";
import type { ServiceGeneratorBase } from "./ServiceGenerator/ServiceGeneratorBase";
import type { ParserConfig } from "./ServiceGenerator/ServiceGenerator";
import { ServiceGenerator } from "./ServiceGenerator/ServiceGenerator";
import type { TypeGeneratorBase } from "./TypeGenerator/TypeGeneratorBase";
import { TypeGenerator } from "./TypeGenerator/TypeGenerator";

const defaultParserConfig: ParserConfig = {
    globalPrefix: undefined,
    platform: undefined,
};

export class ApplicationInterfaceParser {
    private entryModule: Function;
    private serviceGenerator: ServiceGeneratorBase;
    private typeGenerator: TypeGeneratorBase;

    constructor(mainModule: Function, private readonly parserConfig: ParserConfig = defaultParserConfig) {
        this.entryModule = mainModule;
        this.serviceGenerator = new ServiceGenerator(parserConfig);
        this.typeGenerator = new TypeGenerator();
    }

    generate() {
        const modules = this.extractAllModules();
        const controllers = this.extractAllControllers(modules);

        const services = this.serviceGenerator.generate(controllers);
        const types = this.typeGenerator.generate(controllers);

        return {
            services,
            types,
        };
    }

    private extractAllModules() {
        const modules = [this.entryModule];
        const seen = new Set<Function>();

        while (modules.length > 0) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- length checked
            const module = modules.pop()!;
            if (seen.has(module)) {
                continue;
            }
            seen.add(module);
            const subModules = this.getSubModules(module);
            modules.push(...subModules);
        }

        return Array.from(seen);
    }

    private extractAllControllers(modules: Function[]) {
        const controllers = modules.flatMap((module) => {
            return this.getControllers(module);
        });

        return Array.from(new Set(controllers));
    }

    private isClassMarked(key: string, target: Function): boolean {
        return Reflect.getMetadata(key, target) || false;
    }

    private getSubModules(module: Function) {
        const MODULE_METADATA_KEY = "imports";
        const imports: Function[] = Reflect.getMetadata(MODULE_METADATA_KEY, module) || [];

        return imports.filter((subModule) => {
            return typeof subModule === "function" && this.isClassMarked(MODULE_KEY, subModule);
        });
    }

    private getControllers(module: Function) {
        const CONTROLLER_METADATA_KEY = "controllers";
        const controllers: Function[] = Reflect.getMetadata(CONTROLLER_METADATA_KEY, module) || [];

        return controllers.filter((controller) => {
            return (typeof controller === "function" && Reflect.getMetadata(CONTROLLER_KEY, controller)) || false;
        });
    }
}
