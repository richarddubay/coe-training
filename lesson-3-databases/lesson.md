# Databases

## Review / Questions

- Let's go over the homework from last time:
  - Did you have any problems setting up your Github repo?
  - Any issues with the MoSCoW method?
  - Did you have any trouble with the Mermaid syntax or getting the ERD or domain diagrams made?
  - What about the ADR? Did that go well?
  - Any other questions?

## SQL vs. NoSQL (Relational vs. Non-Relational Databases)

There are really two types of databases. Relational and Non-Relational.

- Relational:
  - Structured databases with a fixed schema that store data in tables with rows and columns.
  - The tables relate to each other through foreign keys, which are just ways to connect related information in different tables. For example: a comic book database might have a `comic_book` table and a `publisher` table. We can connect a comic book to a publisher by having a `publisher_id` column in the `comic_book` table that relates back to the `id` from the `publisher` table.
  - These are best used in environments where the relationships between the data is very important.
  - Think financial systems, inventory management, etc.
  - These use SQL as their query language and therefore can use some pretty complex joins.
  - Some examples include:
    - PostgreSQL ([https://www.postgresql.org/](https://www.postgresql.org/)
    - MySQL ([https://www.mysql.com/](https://www.mysql.com/)
    - Microsoft SQL Server ([https://www.microsoft.com/en-us/sql-server](https://www.microsoft.com/en-us/sql-server)).
  - For our project we’re going to be using Postgres.
- Non-Relational:
  - These are databases that store their data in unstructured formats.
  - This data could be documents (like large JSON datasets), key-value pairs, or other things.
  - These are best used when you have a huge amount of data that may or may not be related (and might change often) and you just need the ability to store and quickly read/write that data.
  - Think social media graph data, recommendation engines, etc.
  - These _do not_ use SQL as their query language and often each have their own language for accessing their data.
  - Some examples here include Redis ([https://redis.io/](https://redis.io/)), MongoDB ([https://www.mongodb.com/](https://www.mongodb.com/)), or Amazon DynamoDB ([https://aws.amazon.com/dynamodb/](https://aws.amazon.com/dynamodb/)).

## SQL

- Stands for “Structured Query Language.”
- There are 4 basic commands (SELECT, INSERT, UPDATE, DELETE).
- SELECT: Retrieving data from the database.
- INSERT: Adding new data to the database.
- UPDATE: Modifying existing data in the database.
- DELETE: Removing data from the database.
- A (very) basic query would look something like:
  - `SELECT column FROM table WHERE condition`
  - If you wanted to select every column from the table you would use an asterisk. So … `SELECT * FROM table WHERE condition`
- The “WHERE” is used for filtering. So you could do something like `SELECT * FROM ComicBooks WHERE publisher = 'Marvel'` for example. This would return only the comic books that were published by Marvel.
- These 4 basic commands line up perfectly with the CRUD principles.
  - Create = Insert
  - Read = Select
  - Update = Update
  - Delete = Delete
- We’ll do some homework at a site called SQL Bolt that will give you a much better introduction to SQL.

## ORM

- Stands for “Object-Relational Mapping.”
- It’s a way for us to interact with our database through the models we create in code instead of having to write raw SQL. Some examples include: Prisma: [https://www.prisma.io/docs/getting-started](https://www.prisma.io/docs/getting-started), Drizzle: [https://orm.drizzle.team/docs/overview](https://orm.drizzle.team/docs/overview), and Sequelize: [https://sequelize.org/](https://sequelize.org/).
- With an ORM, generally you’ll write a function call, and the ORM will translate that into a SQL query that it will execute against your database.
- Using an ORM is somewhat safer than using SQL since the abstraction helps keep you away from SQL injection attacks.
- If you need highly-performant or complex queries, SQL might still be the way to go, but an ORM is almost perfect for the majority of your general CRUD based operations.
- Some ORMs, like Prisma, really do a great job of extracting away the SQL that is happening under the hood and allow you to use commands like `create` or `findMany`, or `delete` to work with your data.
- Others, like Drizzle, include queryable functions like `findMany`, but also allow you to stay much closer to SQL (they call it “SQL-like”) if you want to. They have functions that you can chain together to create something very akin to a regular SQL query. So our query:

```
SELECT * FROM comic_books WHERE publisher = 'Marvel'
```

would become something like:

```
const marvelComicBooks = await db.select().from(comic_books).where(eq(ComicBooks.publisher, 'Marvel'))
```

- For this training we’re going to be using Prisma.

## Migrations

- Migrations are a way to manage the changes to the structure of your database over time. Think of it like version control for your database.
- They allow you to apply incremental changes to your database as needed, such as adding tables, changing columns, or potentially deleting data (although this would be _very dangerous_).
- Migrations are basically scripts that you write that describe the change you want to make.
- Each of these changes are numbered and run in sequence.
- Each migration should probably represent one change.
- You technically should be able to migrate up or down, either making the changes or reverting those changes. In this training, we're only really going to worry about "up" migrations.
- An example: `ALTER TABLE comicbooks ADD COLUMN year_published INT;`
- Some ORMs like Prisma and Drizzle have built-in migration tools. They are built to be specific to their thing. We’re going to be using a tool called Flyway because it’s not language specific.

## Homework

- Do the SQL Tutorial at SQL Bolt ([https://sqlbolt.com/](https://sqlbolt.com/)).
