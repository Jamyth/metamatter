import { DefinitionGenerator } from "../core/DefinitionGenerator";
import { ServiceGenerator } from "./ServiceGenerator";
import type { Definition } from "@metamatter/core";
import type { Service } from "@metamatter/nest";
import type { DefinitionGeneratorOptions } from "../core/DefinitionGenerator";
import type { ServiceGeneratorOptions } from "./ServiceGenerator";

export interface NestAPIClientBaseOption {
    endpointURL: string;
}

export type NestAPIClientOptions = NestAPIClientBaseOption & ServiceGeneratorOptions & DefinitionGeneratorOptions;

export class NestAPIClient {
    private readonly endpointURL: string;
    private readonly definitionGenerator: DefinitionGenerator;
    private readonly serviceGenerator: ServiceGenerator;

    constructor(options: NestAPIClientOptions) {
        const { endpointURL, definitionPath, ...serviceOptions } = options;
        this.endpointURL = endpointURL;
        this.definitionGenerator = new DefinitionGenerator({ definitionPath });
        this.serviceGenerator = new ServiceGenerator({ ...serviceOptions });
    }

    async run() {
        try {
            const data = await this.fetchDefinition();

            this.definitionGenerator.generate(data.types);
            this.serviceGenerator.generate(data.services);
        } catch (error) {
            console.error(error);
            process.exit(1);
        }
    }

    private async fetchDefinition(): Promise<{ services: Service[]; types: Definition[] }> {
        const data = await fetch(this.endpointURL);

        return data.json();
    }
}
