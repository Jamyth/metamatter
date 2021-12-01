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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Metabase = void 0;
var TypeBuilder_1 = require("./util/TypeBuilder");
var decorators_1 = require("./decorators");
var Metabase = (function () {
    function Metabase() {
    }
    Metabase.getPropertyTree = function (object) {
        return Reflect.getMetadata(decorators_1.PROPERTY_KEY, object) || {};
    };
    Metabase.getTypeFromTree = function (object) {
        var propertyMap = Metabase.getPropertyTree(object);
        var isEnum = Reflect.getMetadata(decorators_1.ENUM_KEY, object) || false;
        var prefix = object.name;
        var builder = new TypeBuilder_1.TypeBuilder();
        builder.setType(prefix);
        builder.setIsEnum(isEnum);
        builder.setIsArray(false);
        builder.setIsSubclass(false, null);
        builder.setIsNullable(false);
        builder.setBody(propertyMap);
        return builder.build();
    };
    Metabase.generateTypeDefinitions = function (object) {
        return this.createTypeDefinitionFromTree(Metabase.getTypeFromTree(object));
    };
    Metabase.createTypeDefinitionFromTree = function (property, prefix) {
        var name = property.isSubclass && prefix ? "".concat(prefix, "$").concat(property.type) : property.type;
        var definitionType = property.isEnum ? 'enum' : 'interface';
        var rawDefinition = property.toDefinition();
        var definition = {
            name: name,
            type: definitionType,
            definition: rawDefinition,
        };
        if (property.isEnum) {
            return [definition];
        }
        var children = property.body
            ? Object.values(property.body).filter(function (_) { return !_.isPrimitive; })
            : [];
        return __spreadArray([definition], __read(children.flatMap(function (_) { return Metabase.createTypeDefinitionFromTree(_, name); })), false);
    };
    return Metabase;
}());
exports.Metabase = Metabase;
//# sourceMappingURL=Metabase.js.map