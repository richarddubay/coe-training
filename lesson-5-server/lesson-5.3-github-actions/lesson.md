# Lesson 3 - Github Actions

## Review / Questions

Let’s go over the homework from last time:

- Let's take a look at the models and controllers you built.
- Questions? Comments? Concerns?

---

## Github Actions

This lesson is all about setting up Github Actions for our server. On a high level what we want to have happen is that every time we create a pull request to our `main` branch in Github, we want to verify that our database is good. 

What this means practically is that we are going to create a Github Action. This action will be called `verify database` and it's sole purpose will be to run `docker compose up` to check that our database and migrations run as they should. 

### Create the Action

- First things first, in the root of the project (not just your `/server` folder), let's create a `.github` folder.
- Inside that `.github` folder, let's create a `workflows` folder.
- Inside that `workflows` folder, let's create a `verify-database.yml` file.
- Inside that file, let's copy and paste the following code:

```
name: Verify Database

on:
  pull_request:
    branches:
      - main
    paths:
      - database/**

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: execute flyway in docker 🐳
        run: docker compose up --exit-code-from flyway
```

So what have we got here?

- We name the action `Verify Database`.
- We are listening for a pull request to the `main` branch, and we're only looking for changes to files in the `database` folder. Verify that path to make sure that if you've named `database` something else, it'll still work.
- We then run a job that we've called `verify` that checks out our code and then runs `docker compose up`.
- **Note:** The `--exit-code-from` option will catch if the Flyway migrations succeed or fail, and, therefore, will either pass or fail the action based on that exit code.

### Let's Run This Action

- First things first, let's go ahead and push this file to Github. This will make it so that Github will know about this action and will be able to use it when we create a PR next.
- Now that we've pushed this file to Github, let's go ahead and make a small change to the a file in the `database` folder and then make a PR. This should trigger the action we just created.

## Homework

- Make sure that you're `verify database` and `verify schema` Github actions are working.
- Continue to work on anything that we've already covered if needed.