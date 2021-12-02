import { strict as assert } from 'assert';
import { MetaMatter, Property, Enum, Subclass } from '../src';

describe('@Property', () => {
    class User {
        @Property()
        name: string;

        @Property()
        age: number;

        ignored: string;
    }

    const userType = MetaMatter.generateTypeDefinitions(User)[0];

    it('generate correct', () => {
        const expected = '{name:string;age:number;}';

        assert.deepEqual(userType.definition, expected);
    });

    it('Array types', () => {
        class NameList {
            @Property({ isArray: true, type: String })
            names: string[];
        }
        const nameListType = MetaMatter.generateTypeDefinitions(NameList)[0];

        const expected = '{names:string[];}';

        assert.deepStrictEqual(nameListType.definition, expected);
    });

    it('Nullable Types', () => {
        class User {
            @Property({ nullable: true })
            phone?: number;
        }
        const userType = MetaMatter.generateTypeDefinitions(User)[0];
        const expected = '{phone:number | null;}';

        assert.deepStrictEqual(userType.definition, expected);
    });

    it('Nullable Array Types', () => {
        class User {
            @Property({ nullable: true, isArray: true, type: Number })
            bankAccounts?: number[];
        }
        const userType = MetaMatter.generateTypeDefinitions(User)[0];
        const expected = '{bankAccounts:number[] | null;}';

        assert.deepStrictEqual(userType.definition, expected);
    });

    it('Field without @Property will not be exported', () => {
        const expected = '{name:string;age:number;ignore:string;}';
        assert.notDeepEqual(userType.definition, expected);
    });
});

describe('@Subclass', () => {
    class D {
        @Property()
        anything: string;
    }
    @Subclass()
    class C {
        @Property()
        d: D;
    }

    @Subclass()
    class B {
        @Property()
        c: C;
    }

    @Subclass()
    class A {
        @Property()
        b: B;
    }

    const definition = MetaMatter.generateTypeDefinitions(A);

    it('First class marked with @Subclass will not have prefix', () => {
        const name = 'A';
        const a = definition.find((_) => _.name === name);
        assert.deepEqual(!!a, true);
    });

    it('Nested class will have deeply chained prefix', () => {
        const names = ['A$B', 'A$B$C'];
        const actual = names.every((_) => definition.map((_) => _.name).includes(_));
        assert.deepEqual(actual, true);
    });

    it('Nested class without @Subclass will not be prefixed', () => {
        const name = 'D';
        const actual = definition.map((_) => _.name).includes(name);
        assert.deepEqual(actual, true);
    });
});

describe('@Enum', () => {
    @Enum()
    class Role {
        static readonly ADMIN = 'ADMIN';
        static readonly USER = 'USER';
    }

    const definition = MetaMatter.generateTypeDefinitions(Role)[0];

    it('Create a definition of type "enum"', () => {
        assert.deepStrictEqual(definition.type, 'enum');
    });
});

describe('MetaMatter', () => {
    @Enum()
    class Status {
        static readonly ENABLED = 'ENABLED';
        static readonly DISABLED = 'DISABLED';
    }

    @Subclass()
    class Bank {
        @Property()
        balance: number;

        @Property()
        holder: string;

        @Property()
        status: Status;
    }

    class User {
        @Property()
        name: string;

        @Property()
        age: number;

        @Property({ isArray: true, type: Bank })
        bankAccounts: Bank[];

        @Property()
        status: Status;
    }

    const definitions = MetaMatter.generateTypeDefinitions(User);

    it('No duplicate types will be generated', () => {
        const expected = 3;
        assert.deepStrictEqual(definitions.length, expected);
    });
});
