import { MetaMatter } from "@metamatter/core";
import { MODULE_KEY } from "./decorators/Module";
import { CONTROLLER_KEY } from "./decorators/Controller";
import { Generator } from "./ServiceGenerator/Generator";
import { ServiceGenerator } from "./ServiceGenerator/ServiceGenerator";

export class ApplicationInterfaceParser {
    private entryModule: Function;
    private serviceGenerator: Generator;

    constructor(mainModule: Function) {
        this.entryModule = mainModule;
        this.serviceGenerator = new ServiceGenerator();
    }

    generate() {
        const modules = this.extractAllModules();
        const controllers = this.extractAllControllers(modules);

        const services = controllers.map((controller) => this.serviceGenerator.generate(controller));
        // TODO/Jamyth Refactor
        const types = services.flatMap((service) =>
            service.methods.flatMap((method) => {
                const requestTypes = method.requestNode
                    ? MetaMatter.generateTypeDefinitions(method.requestNode as any)
                    : [];
                const responseTypes = method.responseNode
                    ? MetaMatter.generateTypeDefinitions(method.responseNode as any)
                    : [];

                return [...requestTypes, ...responseTypes];
            }),
        );

        const uniqueTypes = Array.from(new Set(types.map((_) => JSON.stringify(_)))).map((_) => JSON.parse(_));
        console.info("services", JSON.stringify(services, null, 4));
        console.info("Type Definitions", uniqueTypes);
    }

    private extractAllModules() {
        const modules = [this.entryModule];
        const seen = new Set<Function>();

        while (modules.length > 0) {
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
