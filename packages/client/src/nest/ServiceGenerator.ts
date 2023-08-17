import fs from "fs";
import path from "path";
import { createConsoleLogger } from "@iamyth/logger";
import { PrettierUtil } from "@iamyth/devtool-utils";
import type { Service, ServiceFunctionInfo, RequestMethodType } from "@metamatter/nest";
import { PathUtil } from "../util/PathUtil";

export type HttpFunctionDeclaration = (
    method: RequestMethodType,
    path: string,
    pathParams: string[],
    request: string | null,
) => string;

export interface ServiceGeneratorOptions {
    serviceDirectory: string;
    typeImportPath: string;
    httpLibraryImportStatement: string;
    httpFunctionDeclaration: HttpFunctionDeclaration;
}

export class ServiceGenerator {
    private readonly logger = createConsoleLogger("NestServiceGenerator");
    private readonly serviceDirectory: string;
    private readonly typeImportPath: string;
    private readonly httpLibraryImportStatement: string;
    private readonly httpFunctionDeclaration: HttpFunctionDeclaration;

    constructor(options: ServiceGeneratorOptions) {
        this.serviceDirectory = options.serviceDirectory;
        this.typeImportPath = options.typeImportPath;
        this.httpLibraryImportStatement = options.httpLibraryImportStatement;
        this.httpFunctionDeclaration = options.httpFunctionDeclaration;
    }

    generate(services: Service[]) {
        try {
            this.prepareEmptyFolder();
            this.generateServices(services);
            this.formatService();
        } catch (error) {
            console.error(error);
            process.exit(1);
        }
    }

    private prepareEmptyFolder() {
        this.logger.task("preparing service folder...");
        const directory = this.serviceDirectory;
        const folderExist = fs.existsSync(directory);
        if (folderExist) {
            if (fs.statSync(directory).isDirectory()) {
                fs.rmSync(directory, { recursive: true });
            } else {
                throw new Error(`Path ${directory} is not a directory`);
            }
        }
        fs.mkdirSync(directory, { recursive: true });
    }

    private generateServices(services: Service[]) {
        this.logger.task("generating services...");
        const classNameReplacer = (name: string) => {
            return name.replace(/Controller/, "AJAXService");
        };

        services.forEach((service) => {
            const serviceName = classNameReplacer(service.name);
            const filename = `${serviceName}.ts`;
            const types = service.methods
                .flatMap(({ request, response }) => [request, response])
                .filter((_): _ is NonNullable<string> => _ !== null);
            const importStatements = this.generateImportStatement(types);
            const methods = this.generateServiceFunction(service.methods);

            const content = `${importStatements}\n\nexport class ${serviceName} { ${methods} }`;

            const filepath = path.join(this.serviceDirectory, filename);
            fs.writeFileSync(filepath, content, { encoding: "utf-8" });
            console.info(`writing to ${path.relative(".", filepath)}`);
        });
    }

    private generateImportStatement(types: string[]) {
        return `${this.httpLibraryImportStatement}\nimport type { ${types.join(",")} } from '${this.typeImportPath}';`;
    }

    private generateServiceFunction(operations: ServiceFunctionInfo[]) {
        const toFunctionArguments = (variables: string[], request: string | null) => {
            const requestArgument = request ? `request: ${request}` : "";
            return variables.join(": string | number, ") + requestArgument;
        };

        return operations
            .map((operation) => {
                const { method, name, path, request, response } = operation;
                console.info(`paring ${method} - ${name} - ${path}`);
                const pathParams = PathUtil.extractPathParams(path);
                const responseType = response === null ? "void" : response;
                return `static ${name}(${toFunctionArguments(
                    pathParams,
                    request,
                )}): Promise<${responseType}> { return ${this.httpFunctionDeclaration(
                    method,
                    path,
                    pathParams,
                    request,
                )} }`;
            })
            .join("\n\n");
    }

    private formatService() {
        this.logger.task("formatting service folder");
        PrettierUtil.format(this.serviceDirectory);
    }
}
