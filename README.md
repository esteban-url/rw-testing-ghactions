# Testing Redwood in Github actions

Just want to skip to the code?

- [Here's the repo](<https://github.com/esteban-url/rw-testing-ghactions>)
- [Here's the complete guide](#guide)

## Introduction

Having a good testing strategy is important for any project. Redwood has a few different types of tests that you can write to make your app more robust and be able to ship with more confidence. In this guide we'll focus on how to run your Redwood tests in Github Actions, so you can test your app them on every push or pull request.

We will setup a tiny project with very few tests but we include a postgres database thats created and used in every test run on Github. If you need to set up test for an existing project, or want to write better tests, check out the (amazing) [Testing](https://redwoodjs.com/docs/testing) section of the docs.

### Why I wrote this and some acknowledgements

This guide was inspired and kickstarted by a question raised in the Makers Hour, the person who asked the question went on to fix their issue and posted the solution in the [Redwood Community](<https://community.redwoodjs.com/t/api-tests-fail-in-github-actions-but-pass-locally/4251>).

When they asked that question and very shortly after posted their workaround it got my interest and decided to implement it in my own project. This solved a different problem I was having: I wanted a robot to run all the test on my app, including creating a database just for the tests. Thanks Asher!

As I got everything working on my app I thought about writing this guide to help others who might be interested in doing the same. The on the Makers Hour I was asked to write it, giving me the final push to do it.

The Redwood Makers Hour is a weekly event where we get together to talk about our projects, encourage and help each other out. If you want to join us, you can find us every wednesday on [Discord](<https://discord.com/channels/679514959968993311/824020028835102740>) Thanks fellow Makers!

I also want to thank the Redwood team for all the hard work they put into this project which makes my life easier, and the community for being so welcoming, helpful and friendly.

### Continuous Integration

Continuous Integration (CI) is the practice of automatically running your tests on every push or pull request. This is a great way to catch bugs before they're merged into your main branch.

### Github Actions

Github Actions is a service that allows you to run a series of commands on a virtual machine. You can use it to run tests, deploy your app, or do anything else you can think of. It's free for public repositories and has a free tier for private repositories.

For more information on Github Actions, check out the [Github Actions docs](https://docs.github.com/en/actions).

## Guide

This is the step by step guide to setup redwood app on your own CI pipeline with Github Actions.

## 1. Create a redwood app

```sh
yarn create redwood-app rw-testing-ghactions
```

Go into the app

```sh
cd rw-testing-ghactions
```

Make sure everything is working

```sh
yarn rw test
```

You should see something like this:

```sh
...

 PASS   api  api/src/directives/requireAuth/requireAuth.test.ts
 PASS   api  api/src/directives/skipAuth/skipAuth.test.ts

Test Suites: 2 passed, 2 total
Tests:       3 passed, 3 total
Snapshots:   0 total
Time:        1.669 s
Ran all test suites.

Watch Usage: Press w to show more.
```

## 2. Modify the prisma schema

For the purpose of this guide we will use the `User` model that comes with the redwood app.

We will also change the db to `postgresql`, since that's what we'll be using in our Github Actions.

> At this point make sure you have a postgres instance ready to use. Here's a handy guide to [set it up locally](https://redwoodjs.com/docs/local-postgres-setup). we will need the connection string so our Redwood app knows where to store the data.

On to the changes, modify your `schema.prisma` file to look like this:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider      = "prisma-client-js"
  binaryTargets = "native"
}

// Define your own datamodels here and run `yarn redwood prisma migrate dev`
// to create migrations for them and apply to your dev DB.
// TODO: Please remove the following example:
model UserExample {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
}


```

Add your connection strings to your `.env` file:

> Make sure you don't commit this file to your repo, since it contains sensitive information.

```env
DATABASE_URL=postgres://postgres:postgres@localhost:54322/postgres
TEST_DATABASE_URL=postgres://postgres:postgres@localhost:54322/postgres
```

You need one connection string for your development database and one for your test database. you can read more info about it [here](https://redwoodjs.com/docs/testing#the-test-database).

Edit the `scripts/seed.ts` file, uncomment the contents of the array that contain the "fake" users. It should look like this:

```ts
    ...

    const data: Prisma.UserExampleCreateArgs['data'][] = [
      // To try this example data with the UserExample model in schema.prisma,
      // uncomment the lines below and run 'yarn rw prisma migrate dev'
      //
      { name: 'alice', email: 'alice@example.com' },
      { name: 'mark', email: 'mark@example.com' },
      { name: 'jackie', email: 'jackie@example.com' },
      { name: 'bob', email: 'bob@example.com' },
    ]
    console.log(
      "\nUsing the default './scripts/seed.{js,ts}' template\nEdit the file to add seed data\n"
    )

    ...
```

Create the migration and migrate your database:

```sh
yarn rw prisma migrate dev --name init
```
