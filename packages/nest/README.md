<p align="center">
  <a href="" target="blank"><img src="https://i.imgur.com/6NTy8Xr.png" width="120" alt="Nest Logo" /></a>
</p>

  <p align="center">A Type Generation Library for building exportable backend type definition, easily to adopt in different <a href="https://www.typescriptlang.org/" target="_blank">TypeScript </a>based backend development</p>
    <p align="center">
<a href="https://www.npmjs.com/package/@metamatter/nest" target="_blank"><img src="https://img.shields.io/npm/v/@metamatter/nest.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/package/@metamatter/nest" target="_blank"><img src="https://img.shields.io/npm/l/@metamatter/nest.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/package/@metamatter/nest" target="_blank"><img src="https://img.shields.io/npm/dm/@metamatter/nest.svg" alt="NPM Downloads" /></a>
<img alt="npms.io (quality)" src="https://img.shields.io/npms-io/quality-score/@metamatter/nest">
<img alt="npms.io (maintenance)" src="https://img.shields.io/npms-io/maintenance-score/@metamatter/nest">
<img alt="Codacy grade" src="https://img.shields.io/codacy/grade/02bb098082d74638bba0fd5fa622b5b7">
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

## Plug and Play

If you want to use the package without any configuration. Do this.

```ts
import { MetaMatterModule } from "@metamatter/nest";

@Module({
    imports: [
        MetaMatterModule.forRoot({
            appModule: AppModule,
            globalPrefix: undefined,
        }),
    ],
})
export class AppModule {}
```

Send a `GET` request to `/metamatter/api`, and you can see a immediate result

```bash
> curl http://localhost:3000/metamatter/api
```

## Usage

-   <strong>`@Module()`</strong>
-   <strong>`@Controller()`</strong>
-   <strong>`@RequestBody(type)`</strong>
-   <strong>`@ResponseData(type?)`</strong>
-   <strong>`@ResponseArrayData(type?)`</strong>
