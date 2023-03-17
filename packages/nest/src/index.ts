import { Module as NestModule, Controller as NestController, Get, Post, Patch } from "@nestjs/common";
import { Module } from "./decorators/Module";
import { Controller } from "./decorators/Controller";
import { ApplicationInterfaceParser } from "./ApplicationInterfaceParser";
import { RequireModule } from "./RequireModule";

@NestController()
class InternalController {}

@Controller()
class OtherController {
    @Post()
    createForm() {}
}

@Controller()
class MyController {
    @Get()
    getList() {}

    @Patch()
    updateSomething() {}
}

@Module({
    imports: [RequireModule],
    controllers: [OtherController, InternalController],
})
export class AnotherRequireModule {}

@NestModule({})
class NonRequireModule {}

@NestModule({
    imports: [AnotherRequireModule, NonRequireModule],
    controllers: [MyController],
})
class AppModule {}

new ApplicationInterfaceParser(AppModule).generateService();
