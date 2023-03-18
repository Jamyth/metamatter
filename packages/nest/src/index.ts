import { Module as NestModule, Controller as NestController, Get, Post, Patch, Body, Put } from "@nestjs/common";
import { Module } from "./decorators/Module";
import { Controller } from "./decorators/Controller";
import { RequestBody } from "./decorators/RequestBody";
import { ApplicationInterfaceParser } from "./ApplicationInterfaceParser";
import { RequireModule } from "./RequireModule";
import { Property, Enum } from "@metamatter/core";
import { ResponseData } from "./decorators/ResponseData";

@Enum()
class Color {
    static readonly RED = "RED";
    static readonly BLUE = "BLUE";
    static readonly GREEN = "GREEN";
}

class Wallet {
    @Property()
    balance: number;
}

class Person {
    @Property()
    name: string;

    @Property()
    color: Color;

    @Property({ nullable: true })
    wallet: Wallet;
}

@NestController()
class InternalController {}

@Controller("/cat/")
class OtherController {
    @Post()
    @RequestBody(Person)
    createForm() {}

    @Put("/:id")
    @ResponseData(Wallet)
    updateCat() {}
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

new ApplicationInterfaceParser(AppModule).generate();
