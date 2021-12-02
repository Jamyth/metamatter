import { SUBCLASS_KEY } from './Subclass';
import { createMetadataKey } from '../util/createMetadataKey';

export const ENUM_KEY = createMetadataKey('ENUM');

/**
 * attention:
 * Since `enum` will transpile to normal JavaScript `object`,
 * currently there is no good option to get the name of the enum, or other information
 *
 * Suggest create a class with static fields as `enum`
 *
 * Cannot use with @Subclass()
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
        if (Reflect.getMetadata(SUBCLASS_KEY, target)) {
            throw new Error(`${target.name} is marked as @Subclass, and should not be mark as "enum" `);
        }
        Reflect.defineMetadata(ENUM_KEY, true, target);
    };
}
