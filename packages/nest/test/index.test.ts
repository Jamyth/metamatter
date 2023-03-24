import { strict as assert } from "assert";
import { Platform, PLATFORM_KEY, Module, Controller, ApplicationInterfaceParser } from "../src";
import { Get } from "@nestjs/common";

describe("@Platform", () => {
    it("As Class Decorator", () => {
        @Platform("a")
        class TestController {}

        @Platform(["a", "b"])
        class TestABController {}

        const testControllerList = Reflect.getMetadata(PLATFORM_KEY, TestController);
        const testabControllerList = Reflect.getMetadata(PLATFORM_KEY, TestABController);

        assert.deepStrictEqual(testControllerList, ["a"]);
        assert.deepStrictEqual(testabControllerList, ["a", "b"]);
    });

    it("As Method Decorator", () => {
        class TestController {
            @Platform("a")
            run() {}
        }

        class TestABController {
            @Platform(["a", "b"])
            run() {}
        }

        const runMethodList = Reflect.getMetadata(PLATFORM_KEY, TestController.prototype.run);
        const abRunMethodList = Reflect.getMetadata(PLATFORM_KEY, TestABController.prototype.run);

        assert.deepStrictEqual(runMethodList, ["a"]);
        assert.deepStrictEqual(abRunMethodList, ["a", "b"]);
    });

    it("e2e", () => {
        const generateKey = "generate";

        @Controller()
        @Platform(generateKey)
        class ShouldGenerateController {
            @Get()
            get() {}
        }

        @Controller()
        class ShouldPartiallyGenerateController {
            @Get()
            @Platform(generateKey)
            get() {}

            @Get()
            @Platform("other")
            getList() {}
        }

        @Controller()
        class ShouldNotGenerateController {
            @Get()
            ignore() {}
        }

        @Module({
            controllers: [ShouldGenerateController, ShouldPartiallyGenerateController, ShouldNotGenerateController],
        })
        class AppModule {}

        const services = new ApplicationInterfaceParser(AppModule, {
            platform: generateKey,
            globalPrefix: undefined,
        }).generate().services;

        const controllerNames = services.map((_) => _.name);
        const expectedControllerNames = ["ShouldGenerateController", "ShouldPartiallyGenerateController"];
        assert.deepStrictEqual(controllerNames, expectedControllerNames);

        const service = services.find((_) => _.name === ShouldPartiallyGenerateController.name);
        assert.notEqual(service, undefined);
        const method = "get";
        assert.deepStrictEqual(service!.methods.length, 1);
        assert.deepStrictEqual(service!.methods[0].name, method);
    });
});
