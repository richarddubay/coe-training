# Lesson 6 - Prisma

## Review / Questions

Let’s go over the homework from last time:

- How did your validation work out?
- Any questions?

---

## Prisma

Welcome to Prisma! https://www.prisma.io/docs/getting-started

### What is Prisma?

Prisma is an ORM. We talked a little bit about ORMs back in lesson 3, but here's a refresher:

- Stands for “Object-Relational Mapping.”
- It’s a way for us to interact with our database through the models we create in code instead of having to write raw SQL.
- It automates our CRUD operations (creating, reading, updating, and deleting data) in a database using an intuitive, type-safe API.

Prisma specifically allows us to define our database schema in a `.prisma` file, and then it will generate the correct corresponding database structure. It also generates Typescript types based on the schema we've defined.

### How do I use Prisma?

- The first thing we need to do is to install Prisma as a dev dependency. `npm i --save-dev prisma`
- Next, we'll run `npx prisma init --datasource-provider postgresql` to initalize Primsa. This will create a `prisma` folder and the `schema.prisma` file.
- Let's look at that file. Basically all we've got at this point is a file that's telling us that we're using Postgres and that it can find the url of the database in our `.env` file. Looking back at the terminal, it is giving us some "next step" instructions so let's follow those.

#### Step 1

> Set the `DATABASE_URL` in the `.env` file to point to your existing database.

Our database should have tables, so we shouldn't have to worry about that last part.

So how do we define the `DATABASE_URL`? Great question. Well, first of all, you can see that running the Prisma `init` command has updated your `.env` file with some things, one of which is a default `DATABASE_URL`. So we just need to update it to match our actual database information.

What it gives us:

```
DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public"
```

What it should be:

```
DATABASE_URL="postgresql://postgres:password@localhost:5433/comic_book_store_db?schema=public"
```

Can you see the differences?

- `johndoe` becomes whatever your database username is. In this case, `postgres`.
- `randompassword` becomes whatever your database password is. In this case, `password`.
- `5432` should be whatever port you are actually using when you run your database. In this case we used `5433`.
- Lastly, `mydb` should be replaced with the name of your database. For us, that's `comic_book_store_db`.

_**Note**_: You can find all this info in your `docker-compose.yml` file if you've forgotten it.

#### Step 2

> Run `prisma db pull` to turn your database schema into a Prisma schema.

In our `package.json` file, let's create a script to run this command so we can use it whenever we make changes to our database. In the `scripts` section of the `package.json` file, add the following command:

```
"prisma:pull": "prisma db pull",
```

Make sure that your database is running (run `docker compose up`) and then head to the command line and run this new script. You should see that it says that it wrote stuff to the `schema.prisma` file. Let's go see what it did. Open up the `schema.prisma` file and take a look at the tables that it created. You should be able to pretty closely match up one-to-one with the SQL you wrote to create your tables.

#### Step 3

> Run prisma generate to generate the Prisma Client. You can then start querying your database.

The next step is to run `prisma generate` to generate the client. To do this we're going to add another script to the `package.json` file. In the `scripts` section, add this:

```
"prisma:generate": "prisma generate",
```

When you run this, it will probably auto install `@prisma/client` for you. If not, you can also install it as a dependency by running `npm i @prisma/client`. After running the `generate` command, it will then tell you that it generated the Prisma Client and give you a directory to find it. In our case the command line tells us that it generated the client in `./node_modules/@prisma/client`, but in actuality what we want to look at is in `./node_modules/.prisma/client/index.d.ts`. So let's go there and see what we've got.

If you search through this file for something like `comic_books` (or another table that you created), you can see all the things that were created in an effort to help you interact with your database. `prisma generate` reads your schema file and generates the code you need for database interaction including all the functions you need to create, read, update, and delete items in your database _AND_ TypeScript types based on your schema. Which will come in handy when we're trying to use our schema types later.

A couple of notes:

- You have to install Prisma first and create your schema before installing Prisma Client. Meaning, you can't run `prisma generate` on a file that doesn't have a schema. It just won't work.
- You will need to run these two commands (`pull` and `generate`) every time you manually change your database schema. For example, if you add a migration to add another field to one of you tables, you'll need to run these again so that everything is up to date.

### Okay, we're all set up. Now what?

Now let's use all this Prisma stuff in our app.

First, let's create a little utility for the Prisma client that we can import into all our files. In your `/utils` folder, create a new file called `prisma.ts`. In that file, paste the following:

```
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();
```

You could, theoretically, just add this into each file you want to use the Prisma client in, but since we'll potentially be importing this into a lot of files, this will be cleaner in the long run.

Next we have to update our models (the database layer) and controllers (our business layer) to use Prisma to actually manipulate the database. In doing so, we'll be removing any hardcoded data and actually getting our database to function like a database and our API calls to function like API calls.

#### Models

Let's start with the models. For each one of the function we've declared here, let's update them to use the Prisma client. The info found in the Prisma Client documentation here (https://www.prisma.io/docs/orm/prisma-client/queries/crud) will be really helpful to us in this step.

In our `/models/comic_books.ts` file, let's import the Prisma client: `import { prisma } from "../utils/prisma";`

Now let's update each of our models functions to use the Prisma client.

**DELETE**

```
export const deleteComicBook = async (comicBookId: number) => {
  return `Deleted comic book with id: ${comicBookId}`;
};
```

to

```
export const deleteComicBook = async (comicBookId: number) => {
  // This is an option we could use where we would not actually delete the record but just update the
  // deleted_at date instead. This is probably the more RIGHT way to do it.
  // const deletedComicBook = await prisma.comic_books.update({
  //   where: {
  //     id: comicBookId,
  //   },
  //   data: {
  //     ...comicBook,
  //     deleted_at: new Date();
  //   }
  // });
  // return deletedComicBook;
  const deletedComicBook = await prisma.comic_books.delete({
    where: {
      id: comicBookId,
    },
  });
  return deletedComicBook;
};
```

As noted here, it's probably _more correct_ to not actually delete the data but to just mark it as deleted by updating the `deleted_at` date. It's simpler for now to just do the actual deletion, but this gives us an idea of how we would do that if we wanted to.

**GET ALL**

```
export const getAllComicBooks = async () => {
   return [
      {
         id: 1,
         title: "Avengers",
         issue_number: 1,
         publisher_id: 2,
         published_date: "2018-05-02",
         created_at: new Date(),
      },
      {
         id: 2,
         title: "Batman",
         issue_number: 1,
         publisher_id: 1,
         published_date: "2016-06-15",
         created_at: new Date(),
      },
   ];
};
```

to

```
export const getAllComicBooks = async () => {
  const comicBooks = await prisma.comic_books.findMany({
    orderBy: {
      id: "asc",
    },
  });
  return comicBooks;
};
```

We removed the hardcoded return data and actual go and get the data from the database here.

**GET BY ID**

```
export const getComicBookById = async (comicBookId: number) => {
   return [
      {
         id: comicBookId,
         title: "Avengers",
         issue_number: 1,
         publisher_id: 2,
         published_date: "2018-05-02",
         created_at: new Date(),
      },
   ];
};
```

to

```
export const getComicBookById = async (comicBookId: number) => {
  const comicBook = await prisma.comic_books.findUnique({
    where: {
      id: comicBookId,
    },
  });
  return comicBook;
};
```

Again, here we just remove the hardcoded return data for actual data from the database. Notice the difference between using `findMany` for the "get all" and `findUnique` for the "get by id."

**POST**

```
export const postComicBook = async () => {
   return `Created comic book`;
};
```

to

```
export const postComicBook = async (comicBook: ComicBookType) => {
  const newComicBook = await prisma.comic_books.create({
    data: {
      ...comicBook,
      created_at: new Date(),
    },
  });
  return newComicBook;
};
```

There are a couple things here to notice. First, we're using Prisma's `create` function to create the new comic book record. Second, we've added a `comicBook` parameter being passed in to this function. In the controller we're going to arrange all the data from the `body` of the request and pass it in here for processing. So we had to pass that param. Also note the `ComicBookType` type. This was mentioned earlier, but part of what happens when we run `prisma generate` is that it creates TypeScript types for us. We can take advantage of those types here. So at the top of this file, we'll add the following:

```
import type { comic_books as ComicBooks } from "@prisma/client";

type ComicBookType = Omit<
  ComicBooks,
  "created_at" | "deleted_at" | "id" | "updated_at"
>;
```

This gets the type for `comic_books` from the Prisma client and then we remove some fields that we don't want to have to necessarily include on every request. Not all comic books records will have `deleted_at` or `updated_at` dates, and we don't want to have to pass around the `created_at` date or `id` on every request. So we remove them from the type that we'll use. Alternatively, you could define your own type with the data that you want it to have, but taking advantage of a type that's already created for us makes sense here.

**PUT**

```
export const putComicBook = async (
  comicBookId: number,
) => {
   return `Updated comic book with id: ${comicBookId}`;
};
```

to

```
export const putComicBook = async (
  comicBookId: number,
  comicBook: ComicBookType
) => {
  const updatedComicBook = await prisma.comic_books.update({
    where: {
      id: comicBookId,
    },
    data: {
      ...comicBook,
      updated_at: new Date(),
    },
  });
  return updatedComicBook;
};
```

Here again we are adding the `comicBook` data param (of `ComicBookType` type) and we're using the `update` function from Prisma to update the record's data.

#### Controllers

Next, we'll look at updating the controllers (or business layer) to handle all the logic we need in order to correctly process the data that we're getting from each request and send it to our models.

```
import { Request, Response } from "express";
import { comicBookModel } from "../models";

const deleteComicBook = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const numericId = parseInt(id);
    const comicBook = await comicBookModel.getComicBookById(numericId);

    if (comicBook) {
      const deletedComicBook = await comicBookModel.deleteComicBook(numericId);
      res.status(204).json({
        message: "Deleted comic book",
        comicBook: {
          id: deletedComicBook.id,
          title: deletedComicBook.title,
          issue_number: deletedComicBook.issue_number,
          publisher_id: deletedComicBook.publisher_id,
          published_date: deletedComicBook.published_date,
          created_at: deletedComicBook.created_at,
        },
      });
    } else {
      res.status(404).send("No driver with that id exists");
    }
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error,
    });
  }
};

const getComicBooks = async (req: Request, res: Response) => {
  try {
    const comicBooks = await comicBookModel.getAllComicBooks();
    res.status(200).json(comicBooks);
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error,
    });
  }
};

const getComicBookById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const numericId = parseInt(id);
    const comicBook = await comicBookModel.getComicBookById(numericId);
    if (comicBook) {
      res.status(200).json(comicBook);
    } else {
      res.status(404).json({
        message: "A comic book with that id could not be found.",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error,
    });
  }
};

const postComicBook = async (req: Request, res: Response) => {
  try {
    const { title, issue_number, publisher_id, published_date } = req.body;

    const newComicBook = {
      title,
      issue_number,
      publisher_id,
      published_date,
    };

    if (
      !newComicBook.title ||
      !newComicBook.issue_number ||
      !newComicBook.publisher_id ||
      !newComicBook.published_date
    ) {
      return res
        .status(400)
        .send(
          "A comic book needs a title, issue number, publisher id, and published date."
        );
    }

    const comicBookResponse = await comicBookModel.postComicBook(newComicBook);

    return res.status(201).json({
      message: "Comic book created successfully.",
      comicBook: comicBookResponse,
    });
  } catch (error) {
    res.status(500).json({
      message: `There was an error adding the new comic book: ${error}`,
      error: error,
    });
  }
};

const putComicBook = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const numericId = parseInt(id);
    const { title, issue_number, publisher_id, published_date } = req.body;

    const comicBookToUpdate = {
      title,
      issue_number,
      publisher_id,
      published_date,
    };

    const comicBookResponse = await comicBookModel.putComicBook(
      numericId,
      comicBookToUpdate
    );
    return res.status(200).json({
      message: "Comic book updated successfully",
      comicBook: comicBookResponse,
    });
  } catch (error) {
    res.status(500).json({
      message: `There was an error updating the comic book: ${error}`,
      error: error,
    });
  }
};

export {
  deleteComicBook,
  getComicBooks,
  getComicBookById,
  postComicBook,
  putComicBook,
};
```

Highlights:

- We imported `prisma` in this file too, and we're using it in the `deleteComicBook` function to make sure that we actually have a comic book record to delete.
- This is where we return the response to the calling agent. You'll notice that there are many different pieces of information we can return, and many different ways that we can return it. We can return the `status`, we can `send` a set of data or a message, we can also just return `json` with a mix of different things. None of this is specific to Prisma, by the way. This is just Express.
- We also added `try / catch` blocks here to try to handle errors as gracefully as possible.

Now if we were to test out these endpoints, we should be able to create, read, update, and delete a record attached to your real database.

## Addendum: Github Action for Verifying the Database Schema

Remember Github Actions? They're back!

Now that we have Prisma up and running, we can add a Github Action to verify that our database schema is correct. The purpose here is two-fold:

- to verify that we can run the Prisma `pull` and `generate` commands.
- to update the repo with any schema changes that we might be missing.

Warning: If this action actually does update the schema and push to the repo, you will have to pull from the repo again before doing anything else, otherwise you run the risk of overwriting these changes.

🛑 Full disclosure up front: As of this lesson, I haven't been able to actually get the "write the changes to the repo" part to work. So this is a mostly theoretical exercise. 

So let's get started. In your `.github/workflows` folder, create a new file called `verify-schema-update.yml`. Inside of this file, add the following:

```
name: Verify Schema Update

on:
  workflow_call:
  workflow_run:
    workflows: ["Verify Database"]
    types:
      - completed

defaults:
  run:
    working-directory: ./server

env:
  DATABASE_URL: postgresql://postgres:password@localhost:5433/f1_fantasy_league_db?schema=public

jobs:
  verify:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@v3
      - name: execute flyway in docker 🐳
        run: docker compose up -d
      - name: Server Install
        run: npm i
      - name: Prisma Pull
        run: npm run prisma:pull
      - name: Prisma Generate
        run: npm run prisma:generate
      - name: Debug Git Status
        run: git status
      - name: Check for modified snapshots / database schema
        id: snapshot-check
        run: echo ::set-output name=modified::$(if git status | grep "nothing to commit"; then echo "false"; else echo "true"; fi)
      - name: Commit any updated snapshots / database schema changes
        if: steps.snapshot-check.outputs.modified == 'true'
        uses: stefanzweifel/git-auto-commit-action@v5
        with:
          commit_message: Commit for snapshot update
      - name: Spin Down Docker 🐳
        run: docker compose down
```

## Homework

- Continue to work on anything that we've already covered if needed.
- Expand on the Prisma stuff we just learned, making connections to all your tables to the database.
