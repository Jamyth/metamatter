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
exports.TypeBuilder = void 0;
var TypeBuilder = (function () {
    function TypeBuilder() {
        var _this = this;
        this.setType = function (type) {
            _this.type = type;
            _this.isPrimitive = _this.isPrimitiveTypes();
            return _this;
        };
        this.setIsEnum = function (isEnum) {
            _this.isEnum = isEnum;
            return _this;
        };
        this.setIsSubclass = function (isSubclass, prefix) {
            _this.isSubclass = isSubclass;
            _this.prefix = prefix;
            return _this;
        };
        this.setIsArray = function (isArray) {
            _this.isArray = isArray;
            return _this;
        };
        this.setIsNullable = function (isNullable) {
            _this.isNullable = isNullable;
            return _this;
        };
        this.setBody = function (body) {
            _this.body = body;
            return _this;
        };
        this.build = function () {
            if (!_this.type) {
                throw new Error('Type is not defined...');
            }
            if (!_this.isPrimitive && !_this.body) {
                throw new Error("Type marked as \"".concat(_this.type, "\", but body is not defined."));
            }
            return {
                type: _this.type,
                isPrimitive: _this.isPrimitive,
                isArray: _this.isArray,
                isEnum: _this.isEnum,
                isNullable: _this.isNullable,
                isSubclass: _this.isSubclass,
                prefix: _this.prefix,
                body: _this.body,
                toString: _this.toString,
                toDefinition: _this.toDefinition,
            };
        };
        this.toString = function () {
            if (!_this.type) {
                throw new Error('Type is not defined...');
            }
            var prefix = _this.isSubclass && _this.prefix ? "".concat(_this.prefix, "$") : '';
            var arrayText = _this.isArray ? '[]' : '';
            var nullableText = _this.isNullable ? ' | null' : '';
            return prefix + _this.type + arrayText + nullableText;
        };
        this.toDefinition = function () {
            if (!_this.body) {
                throw new Error('body is not defined');
            }
            if (_this.isEnum) {
                return JSON.stringify(_this.body);
            }
            var fields = Object.entries(_this.body).reduce(function (acc, _a) {
                var _b;
                var _c = __read(_a, 2), key = _c[0], property = _c[1];
                return Object.assign(acc, (_b = {}, _b[key] = property.toString(), _b));
            }, {});
            return JSON.stringify(fields);
        };
        this.isPrimitiveTypes = function () {
            var primitives = ['string', 'number', 'boolean', 'Date', 'void'];
            return _this.type ? primitives.includes(_this.type) : false;
        };
        this.isArray = false;
        this.isNullable = false;
        this.isEnum = false;
        this.isSubclass = false;
        this.prefix = null;
        this.body = null;
        this.type = null;
    }
    return TypeBuilder;
}());
exports.TypeBuilder = TypeBuilder;
//# sourceMappingURL=TypeBuilder.js.map