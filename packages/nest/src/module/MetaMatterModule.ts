import { Module } from "@nestjs/common";
import { MetaMatterController } from "./MetaMatterController";
import { APP_MODULE_KEY, GLOBAL_PREFIX_KEY } from "./keys";

interface MetaMatterModuleConfig {
    appModule: Function;
    globalPrefix?: string;
}

@Module({})
export class MetaMatterModule {
    static forRoot({ appModule, globalPrefix }: MetaMatterModuleConfig) {
        return {
            module: MetaMatterModule,
            controllers: [MetaMatterController],
            providers: [
                { provide: APP_MODULE_KEY, useValue: appModule },
                { provide: GLOBAL_PREFIX_KEY, useValue: globalPrefix },
            ],
        };
    }
}
