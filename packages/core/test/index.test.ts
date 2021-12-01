import { strict as assert } from 'assert';
import { Metabase, Property, Enum, Subclass } from '../src';

@Enum()
class UserRoleView {
    static readonly ADMIN = 'ADMIN';
    static readonly USER = 'USER';
}

@Subclass()
class Wallet {
    @Property()
    balance: number;
}

class User {
    @Property({ nullable: true, isArray: true, type: Wallet })
    wallet: Wallet;

    @Property()
    name: string;

    @Property()
    role: UserRoleView;
}

describe('Metabase', () => {
    it('get Property Tree', () => {
        const definitions = Metabase.generateTypeDefinitions(User);
        console.info(definitions);
    });

    it('Should export with prefix', () => {
        const expect = '{"wallet":"User$Wallet[] | null","name":"string","role":"UserRoleView"}';

        const definitions = Metabase.generateTypeDefinitions(User);
        const user = definitions.find((_) => _.name === User.name);

        assert.deepStrictEqual(user?.definition, expect);
    });
});
