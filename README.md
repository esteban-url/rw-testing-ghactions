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

### 3. Generate the UserExample scaffold

Generate the scaffold for the `UserExample` model:

```sh
yarn rw g scaffold UserExample

``

This will give you everything you need to create "users" in your app, including some of the tests.

Make sure everything is still working

```sh
yarn rw test
```

redwood has generated the basic tests for our services, they interact with your test database.

You should see something like this:

```sh
 PASS   web  web/src/lib/formatters.test.tsx
 PASS   api  api/src/services/userExamples/userExamples.test.ts

Test Suites: 2 passed, 2 total
Tests:       21 passed, 21 total
Snapshots:   0 total
Time:        3.587 s
Ran all test suites related to changed files in 2 projects.
```

### 3. Setup Github Actions

Create a new file in the `.github/workflows` folder called `ci.yml` and add the following content:

```yml
name: Redwood CI

on:
  push:
    branches: ['main']
  pull_request:
    branches: ['main']

env:
  DATABASE_URL: postgres://postgres:postgres@localhost:5432/postgres
  TEST_DATABASE_URL: postgres://postgres:postgres@localhost:5432/postgres

jobs:
  build:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [16.x]
        # See supported Node.js release schedule at https://nodejs.org/en/about/releases/

    services:
      # Label used to access the service container
      postgres:
        # Docker Hub image
        image: postgres
        # Provide the password for postgres
        env:
          POSTGRES_PASSWORD: postgres
        # Set health checks to wait until postgres has started
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          # Maps tcp port 5432 on service container to the host
          - 5432:5432

    steps:
      - uses: actions/checkout@v3
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
      # install all the dependencies
      - run: yarn install
      # build the redwood app
      - run: yarn rw build
      # run the api tests
      - run: yarn rw test api --no-watch
      # run the web tests
      - run: yarn rw test web --no-watch
```

If you push your changes to the `main` branch on Github the CI action will breaks down like this:

![CI results](readme_images/ci-results-1.png)

1. Set up job
2. Initializes the containers and creates our postgres instance
3. Checkout the code
4. Sets up Node.js
5. Installs the redwood dependencies
6. Builds the redwood app
7. Runs the api tests
8. Runs the web tests
9. Cleans up the environment

You can see the details [here](https://github.com/esteban-url/rw-testing-ghactions/actions/runs/3485657682/jobs/5831385280)

### 4. Setup CI on a pull request

We want to make sure that the tests are run on every pull request, so we can make sure that the code is working as expected.

Update the `ci.yml` file by removing the `push` event, the first lines should look like this:

```yml
name: Redwood CI for Pull Requests

on:
  pull_request:
    branches: ['main']

...
```

Now, if you create a pull request, the CI action will run and you will see something like this:

![CI on a PR](readme_images/ci-pr-1.png)

Once the Github action is done, you can see the results in the "Conversation" tab:

![CI passing on a PR](readme_images/ci-pr-2.png)

Check out the actual PR [here](<https://github.com/esteban-url/rw-testing-ghactions/pull/1>)

### 5. Deploy de database chances to an actual database

Now we want to use another action to deploy the database chances to an actual database, so we can test the app in a real environment.

Create a new file in the `.github/workflows` folder called `cd.yml` and add the following content:

```yml
name: Redwood CD for database deployment
on:
  push:
    branches: ['main']

env:
  DATABASE_URL: postgres://postgres:postgres@localhost:5432/postgres
  TEST_DATABASE_URL: postgres://postgres:postgres@localhost:5432/postgres

jobs:
  build:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [16.x]
        # See supported Node.js release schedule at https://nodejs.org/en/about/releases/

    services:
      # Label used to access the service container
      postgres:
        # Docker Hub image
        image: postgres
        # Provide the password for postgres
        env:
          POSTGRES_PASSWORD: postgres
        # Set health checks to wait until postgres has started
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          # Maps tcp port 5432 on service container to the host
          - 5432:5432

    steps:
      - uses: actions/checkout@v3
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
      # install all the dependencies
      - run: yarn install
      # build the redwood app
      - run: yarn rw build
      # run the api tests
      - run: yarn rw test api --no-watch
      # run the web tests
      - run: yarn rw test web --no-watch
      # run migrations on the actual database
      - run: yarn rw prisma migrate deploy
      # run seed script in the actual db
      - run: yarn rw prisma db seed
```

The main chances are:

- We only run the action on push events to the `main` branch
- We run the migrations and seed scripts after the tests.

  ```yml
  # run migrations on the actual database
      - run: yarn rw prisma migrate deploy
      # run seed script in the actual db
      - run: yarn rw prisma db seed
  ```

When you push to a PR, you get validation that the tests are passing so you are sure that the code is working as expected.

### 6 Set up the github secrets

Because you are using an actual postgres instance in your Github action, you need to set up the secrets for the database connection, so that the user and password stay confidential.

Go to the "Settings" tab in your Github repo and click on "Secrets" then "Actions", then click on "New repository secret".

In the name field, type `DATABASE_URL`

The value field is the actual secret so it should be something like this: `postgres://[USER_NAME]:[PASSWORD]@[HOST]:[PORT]/postgres`

Now click on `Add secret`.

This will create a new secret that you can use in your Github actions. in this case he connection string for the database where we will deploy the changes.

More info on github secrets [here](https://docs.github.com/en/actions/security-guides/encrypted-secrets#creating-encrypted-secrets-for-a-repository)

Now you can use the secret in your Github action by using the `${{ secrets.DATABASE_URL }}` syntax.

```yml
...

env:
  DATABASE_URL: ${{ secrets.DATABASE_URL }}
...
```

 Now you can merge the PR and the database changes will be deployed to the actual database. ✨
