import { PathUtil } from "../../src/util/PathUtil";
import { strict as assert } from "assert";

describe("PathUtil", () => {
    it("Extract Path Params", () => {
        const path = "/:id";
        const expected = ["id"];

        assert.deepStrictEqual(PathUtil.extractPathParams(path), expected);
    });

    it("Extract Multiple Path Params", () => {
        const path = "/:id/:age";
        const expected = ["id", "age"];

        assert.deepStrictEqual(PathUtil.extractPathParams(path), expected);
    });

    it("Extract Multiple Path Params with normal path", () => {
        const path = "/:id/helloworld/:age";
        const expected = ["id", "age"];

        assert.deepStrictEqual(PathUtil.extractPathParams(path), expected);
    });
});
