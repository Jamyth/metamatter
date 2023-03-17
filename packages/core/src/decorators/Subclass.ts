import { createMetadataKey } from "../util/createMetadataKey";
import { ENUM_KEY } from "./Enum";

export const SUBCLASS_KEY = createMetadataKey("SUBCLASS");

/**
 * attention:
 * This decorator helps the generator understand the current class is a subclass,
 * and it will automatically append '$' in between two classes to create a suitable interface
 *
 * If the class is used in more than one place, you should not use \@Subclass()
 *
 * Cannot use with @Enum()
 *
 * @output
 * ```ts
 * OuterClass.InnerClass -> OuterClass$InnerClass
 * ```
 * @example
 * \@Subclass()
 * class InnerClass {
 *     \@Property()
 *     fieldA: string;
 *
 *     \@Property()
 *     fieldB: string;
 * }
 *
 * class OuterClass {
 *     static InnerClass = InnerClass
 *
 *     \@Property({ type: OuterClass.Inner })
 *     inner: InstanceType<typeof OuterClass.Inner>
 * }
 */
export function Subclass(): ClassDecorator {
    return (target) => {
        if (Reflect.getMetadata(ENUM_KEY, target)) {
            throw new Error(`${target.name} is marked as @Enum, and should not be mark as "subclass" `);
        }
        Reflect.defineMetadata(SUBCLASS_KEY, true, target);
    };
}
