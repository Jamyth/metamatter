<p align="center">
  <a href="" target="blank"><img src="https://i.imgur.com/6NTy8Xr.png" width="120" alt="Nest Logo" /></a>
</p>

  <p align="center">A Type Generation Library for building exportable backend type definition, easily to adopt in different <a href="https://www.typescriptlang.org/" target="_blank">TypeScript </a>based backend development</p>
    <p align="center">
<a href="https://www.npmjs.com/package/@metamatter/core" target="_blank"><img src="https://img.shields.io/npm/v/@metamatter/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/package/@metamatter/core" target="_blank"><img src="https://img.shields.io/npm/l/@metamatter/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/package/@metamatter/core" target="_blank"><img src="https://img.shields.io/npm/dm/@metamatter/core.svg" alt="NPM Downloads" /></a>
<a href="https://lgtm.com/projects/g/Jamyth/metamatter/context:javascript" target="_blank">
<img src="https://img.shields.io/lgtm/grade/javascript/g/Jamyth/metamatter.svg?logo=lgtm&logoWidth=18" alt="Language grade: JavaScript"/>
</a>
<a href="https://lgtm.com/projects/g/Jamyth/metamatter/alerts/" target="_blank">
<img src="https://img.shields.io/lgtm/alerts/g/Jamyth/metamatter.svg?logo=lgtm&logoWidth=18" alt="Total Alerts"/>
</a>
</p>

## Description

MetaMatter is a library for building runtime type definition generation. It is built with <a href="https://www.typescriptlang.org/" target="_blank">TypeScript</a> and combines the concepts of `Meta-Programming`, to create `type-safe`, `scalable` environment for (mainly) Frontend development.

## Philosophy

There are numbers of libraries for building a <a href="https://nodejs.org" target="_blank">Node.js</a> server-side applications. However, there is an issue when it comes to communicate between Frontend and Backend no matter which backend language we are using. <strong>`Type Definitions`</strong>, would be troublesome when it comes to `Agile` development style. Frequent updates on APIs makes it hard to develop projects in a `type-safe` environment.

MetaMatter aims to address this issue, by providing a lightweight, less configuration tools.

## Installation

```bash
> yarn add @metamatter/core
# or
> npm install @metamatter/core
```

## Usage

There are three decorators at the moment.

-   <strong>`@Property()`</strong>
-   <strong>`@Enum()`</strong>
-   <strong>`@Subclass()`</strong>

## `@Property()`

This is the basic decorator to tell the program to store the decorated field as part of the definition output.

> Due to the limitation of Reflection in TypeScript, `union types`, `interface`, `enum`, `Promise`, `Array` are not working as expected, the implementation would not be as usual as it be.

### Example

```ts
import { Property } from '@metamatter/core';

class User {
    @Property()
    username: string;

    @Property({ isArray: true, type: String })
    hobbies: string[];

    @Property({ nullable: true })
    phone?: string;
}

// Will produce the follow output:
const definition = {
    name: 'User',
    type: 'interface',
    definition: '{username: string, hobbies: string[], phone: string | null}',
};
```

## `@Enum()`

This decorator will work the same way as `enum` does, but in `JavaScript`, `enum` will be translated to a frozen object, which cannot be able to apply any decorators, so we suggest keeping the enum in a `class form` with `static fields`.

> Due to the limitation of Reflection in TypeScript, `union types`, `interface`, `enum`, `Promise`, `Array` are not working as expected, the implementation would not be as usual as it be.

### Example

```ts
import { Enum } from '@metamatter/core';

@Enum()
class UserRole {
    static readonly ADMIN = 'ADMIN';
    static readonly USER = 'USER';
}

// Will produce the follow output:
const definition = {
    name: 'UserRole',
    type: 'enum',
    definition: '{ADMIN: "ADMIN", USER: "USER"}',
};
```

## `@Subclass()`

At some point that your application might grow in size, some class might share the same name but in different structure, in that way the program might generate two different interfaces with the same name, this is not what we want. That's why we need @Subclass decorator.

> Since nested class cannot apply decorators as well, we need to declare it outside the class and assign it as a static property of another class

### Example (Suggested)

```ts
import { Subclass, Property } from '@metamatter/core';

@Subclass()
class Wallet {
    @Property()
    balance: number;
}

class User {
    static Wallet = Wallet;

    @Property({ type: User.Wallet })
    wallet: InstanceType<typeof User.Wallet>;
}
```

### Example

```ts
import { Subclass, Property } from '@metamatter/core';

@Subclass()
class Wallet {
    @Property()
    balance: number;
}

class User {
    @Property()
    wallet: Wallet;
}
```

> The above examples work the same way, but just in different style.

## `MetaMatter`

This is the main class of the library, it provide two simple functions

-   <strong>`getPropertyTree`</strong>
-   <strong>`generateTypeDefinition`</strong>

## `MetaMatter.getPropertyTree`

It accepts a class as parameter and it will return a complete `Type` tree of all of it's properties.

### Example

```ts
// What a Type look like
interface Type<T> {
    type: string;
    isPrimitive: boolean;
    isArray: boolean;
    isEnum: boolean;
    isNullable: boolean;
    isSubclass: boolean;
    body: T extends object ? (object extends T ? T : { [P in keyof T]: Type<ExcludeArray<T[P]>> }) : null;
    toString: (prefix?: string) => string;
    toDefinition: (prefix?: string) => string;
}
```

```ts
import { MetaMatter, Property } from '@metamatter/core';

class User {
    @Property()
    name: string;

    @Property()
    age: number;
}

const tree = MetaMatter.getPropertyTree(User);

// Output
const tree = {
    name: {
        type: 'string',
        isPrimitive: true,
        isArray: false,
        isEnum: false,
        isNullable: false,
        isSubclass: false,
        body: null,
        toString: () => 'string',
        toDefinition: () => '';
    },
    age: {
        type: 'number',
        isPrimitive: true,
        isArray: false,
        isEnum: false,
        isNullable: false,
        isSubclass: false,
        body: null,
        toString: () => 'number',
        toDefinition: () => '';
    },
}
```

## `MetaMatter.generateTypeDefinition`

It accepts a class as parameter and it will produce an array of `Definition`.

### Example

```ts
// What a Definition look like
interface Definition {
    name: string;
    type: 'interface' | 'enum';
    definition: string;
}
```

```ts
import { MetaMatter, Property, Subclass } from '@metamatter/core';

@Subclass()
class Wallet {
    @Property()
    balance: number;
}

class User {
    @Property()
    name: string;

    @Property()
    age: number;

    @Property({ nullable: true })
    wallet?: Wallet;
}

const definitions = MetaMatter.generateTypeDefinition(User);

// Output
const definitions = [
    {
        name: 'User',
        type: 'interface',
        definition: '{name: string, age: number, wallet: User$Wallet | null}',
    },
    {
        name: 'User$Wallet',
        type: 'interface',
        definition: '{balance: number}',
    },
];
```
