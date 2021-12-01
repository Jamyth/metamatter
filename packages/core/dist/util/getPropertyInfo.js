"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPropertyInfo = void 0;
var TypeBuilder_1 = require("./TypeBuilder");
var Property_1 = require("../decorators/Property");
function getPropertyInfo(object, _a) {
    var isArray = _a.isArray, isEnum = _a.isEnum, isNullable = _a.isNullable, isSubclass = _a.isSubclass, body = _a.body, prefix = _a.prefix;
    var builder = new TypeBuilder_1.TypeBuilder();
    builder.setIsArray(isArray);
    builder.setIsNullable(isNullable);
    builder.setIsEnum(isEnum);
    builder.setIsSubclass(isSubclass, prefix);
    if (object !== null) {
        switch (object) {
            case String:
            case Number:
            case Boolean:
                builder.setType(object.name.toLowerCase());
                break;
            case Date:
                builder.setType(Date.name);
                break;
            default: {
                var propertyMap = body
                    ? body
                    :
                        Reflect.getMetadata(Property_1.PROPERTY_KEY, object);
                builder.setBody(propertyMap || null);
                builder.setType(object.name);
                break;
            }
        }
    }
    else {
        builder.setType('void');
    }
    return builder.build();
}
exports.getPropertyInfo = getPropertyInfo;
//# sourceMappingURL=getPropertyInfo.js.map