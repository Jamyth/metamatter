import { createMetadataKey } from '../util/createMetadataKey';

export const ENUM_KEY = createMetadataKey('ENUM');

/**
 * attention:
 * Since `enum` will transpile to normal JavaScript `object`,
 * currently there is no good option to get the name of the enum, or other information
 *
 * Suggest create a class with static fields as `enum`
 *
 * @example
 * \@Enum()
 * class UserRole {
 *      static readonly ADMIN = 'ADMIN';
 *      static readonly USER = 'USER';
 * }
 *
 * class UserView {
 *      \@Property()
 *      role: UserRole
 * }
 */
export function Enum(): ClassDecorator {
    return (target) => {
        Reflect.defineMetadata(ENUM_KEY, true, target);
    };
}
