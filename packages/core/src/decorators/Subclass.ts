import { createMetadataKey } from '../util/createMetadataKey';

export const SUBCLASS_KEY = createMetadataKey('SUBCLASS');

/**
 * attention:
 * This decorator helps the generator understand the current class is a subclass,
 * and it will automatically append '$' in between two classes to create a suitable interface
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
        Reflect.defineMetadata(SUBCLASS_KEY, true, target);
    };
}
