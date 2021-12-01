"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subclass = exports.SUBCLASS_KEY = void 0;
var createMetadataKey_1 = require("../util/createMetadataKey");
exports.SUBCLASS_KEY = (0, createMetadataKey_1.createMetadataKey)('SUBCLASS');
function Subclass() {
    return function (target) {
        Reflect.defineMetadata(exports.SUBCLASS_KEY, true, target);
    };
}
exports.Subclass = Subclass;
//# sourceMappingURL=Subclass.js.map