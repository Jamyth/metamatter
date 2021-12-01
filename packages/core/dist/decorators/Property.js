"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Property = exports.PROPERTY_KEY = void 0;
var createMetadataKey_1 = require("../util/createMetadataKey");
var getPropertyInfo_1 = require("../util/getPropertyInfo");
var Enum_1 = require("./Enum");
var Subclass_1 = require("./Subclass");
exports.PROPERTY_KEY = (0, createMetadataKey_1.createMetadataKey)('PROPERTY');
var defaultOptions = {
    nullable: false,
    isArray: false,
};
function Property(_a) {
    var _b = _a === void 0 ? defaultOptions : _a, type = _b.type, _c = _b.isArray, isArray = _c === void 0 ? false : _c, _d = _b.nullable, nullable = _d === void 0 ? false : _d;
    return function (target, key) {
        var serializedKey = String(key);
        var propertyMap = Reflect.getMetadata(exports.PROPERTY_KEY, target.constructor) || {};
        var inferredType = type ? type : Reflect.getMetadata('design:type', target, key);
        if (typeof inferredType === undefined) {
            console.warn("Type of ".concat(serializedKey, " is inferred as \"undefined\", make sure it is correct."));
        }
        var isEnum = Reflect.getMetadata(Enum_1.ENUM_KEY, inferredType) || false;
        var isSubclass = Reflect.getMetadata(Subclass_1.SUBCLASS_KEY, inferredType) || false;
        var body = null;
        if (isEnum) {
            body = Object.entries(inferredType).reduce(function (acc, _a) {
                var _b;
                var _c = __read(_a, 2), key = _c[0], value = _c[1];
                return Object.assign(acc, (_b = {}, _b[key] = value, _b));
            }, {});
        }
        propertyMap[serializedKey] = (0, getPropertyInfo_1.getPropertyInfo)(inferredType, {
            isArray: isArray,
            isSubclass: isSubclass,
            isNullable: nullable,
            isEnum: isEnum,
            body: body,
            prefix: isSubclass ? target.constructor.name : null,
        });
        Reflect.defineMetadata(exports.PROPERTY_KEY, propertyMap, target.constructor);
    };
}
exports.Property = Property;
//# sourceMappingURL=Property.js.map