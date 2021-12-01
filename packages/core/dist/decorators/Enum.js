"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Enum = exports.ENUM_KEY = void 0;
var createMetadataKey_1 = require("../util/createMetadataKey");
exports.ENUM_KEY = (0, createMetadataKey_1.createMetadataKey)('ENUM');
function Enum() {
    return function (target) {
        Reflect.defineMetadata(exports.ENUM_KEY, true, target);
    };
}
exports.Enum = Enum;
//# sourceMappingURL=Enum.js.map