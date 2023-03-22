import { Get, Controller, Inject } from "@nestjs/common";
import { ApplicationInterfaceParser } from "../ApplicationInterfaceParser";
import { APP_MODULE_KEY, GLOBAL_PREFIX_KEY } from "./keys";

@Controller("metamatter")
export class MetaMatterController {
    constructor(
        // eslint-disable-next-line @typescript-eslint/no-parameter-properties -- DI
        @Inject(APP_MODULE_KEY) readonly appModule: Function,
        // eslint-disable-next-line @typescript-eslint/no-parameter-properties -- DI
        @Inject(GLOBAL_PREFIX_KEY) readonly globalPrefix: string | undefined,
    ) {}

    @Get("/api")
    generateServiceAndTypeDefinition() {
        const parser = new ApplicationInterfaceParser(this.appModule, { globalPrefix: this.globalPrefix });
        return parser.generate();
    }
}
