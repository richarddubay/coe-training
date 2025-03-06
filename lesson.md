# Project Planning

## Review / Questions

- Is there anything from the previous lesson that you want to talk or ask questions about?

## Your Course Project

- What did you decide to build?

## Project Initialization

You can do this a couple of different ways:

### Way One

    > mkdir <Your Project Name>
    > cd <Your Project Name>
    > git init

Then go make a repo, and hook it up to this project. Github will tell you what commands to run.

### Way Two

Before we do anything else, let’s go to Github and create a new repo.

- Go to your personal Github site.
- Click on `Repositories` in the main tab bar.
- Click the `New` button.
- Give your repo a name.
- You can give it a description if you’d like.
- Leave it `public`.
- Go ahead and check the box to add the README file.
- For right now you don’t need to add the `.gitignore` or the `license` unless you specifically want to.
- Click `Create respository`.
- Go ahead and clone that bad boy down.

Note: By having Github add the README file, it automatically does all the “hooking up” things you need it to do. Without the README file, you’ll need to run a few commands to get things hooked up. In our case, we’ll need the README file anyway, so why go through the hassle of the other way, right?

## MoSCoW Method

The _MoSCoW Method_ is a project planning method that we’re going to use on our project. I encourage you to read the linked article ([https://en.wikipedia.org/wiki/MoSCoW_method](https://en.wikipedia.org/wiki/MoSCoW_method)), but here’s the gist of it:

There are 4 main sections that everything that we’re going to build for this project will go into. The capital letters in `MoSCoW` stand for the four sections.

### M: Must Have

These are the absolute musts for this project to be functional and successful. This can be for a sprint or for the whole of the project … it all depends on what your time box is. In our case, our time box is the time we have for this training so it’s imperative that these items be just the items that our MVP has to ship with.

For example: A comic book selling site must have a way to purchase comic books.

### S: Should Have

These are items that the project should have. They are important, but they aren’t necessary to ship the MVP. The difference between “must have” and “should have” could potentially be very small.

For example: Since we’re talking MVP, maybe signing in and tracking orders isn’t of the utmost priority when compared to being able to purchase a comic book. Or maybe the books don’t have dedicated series pages yet. If that's the case, then we have a candidate for a “should have” item.

### C: Could Have

These are “we’d love to have this if we have time” features.

For example: The site could have a dedicated admin section where someone could manage users and/or the book data.

### W: Won’t Have (or Wish List)

These are items that we just won’t have time for during this planning period.

For example: The site won’t have comic book data other than title, publisher, cover image, and price.

### README

In your README, you’ll want to create a section like this:

```
# Your App Name

## Introduction

## Purpose

## Features

### Must Have
- Ability to ...

### Should Have
- Ability to ...

### Could Have
- Ability to ...

### Won't Have
- Ability to ...
```

So, for the comic book site, it might look like:

```
# Comic Book Store

## Introduction

This is a personal comic book store app being built currently as a training exercise.

## Purpose

The purpose of this site will be to sell my comic books for lots of money and fund the rest of my life. Or, at least, a nice dinner.

## Features

### Must Have
- A person must be able to add a comic book to the cart.
- A person must be able to purchase a comic book.
...

### Should Have
- A person should be able to sign in.
- A person should be able to see details about the comic book they are purchasing.
...

### Could Have
- The site could have individual comic book pages that show the details of the book.
- The site could have an admin section where someone could manage customers, orders, and comic book data.
...

### Won't Have
- The site will not have a way for customers to contact customer service.
- The site will not have a way for customers to comment on what they think about a particular book.
...
```

## ERD / Domain Diagrams

We’re going to make two diagrams in our README file.

### ERD

An ERD is a “Entity Relationship Diagram.” It focuses on the structure of data in a database. It shows how the different entities (like tables and their particular fields in a database) are related. Is it a 1-to-1, a many-to-many, a 1-to-many, a many-to-1 relationship? This diagram should tell you.

### Domain Diagram

A “domain diagram” is a visual representation of the key concepts within a domain, but at a higher level than an ERD. Where an ERD focuses on more of the technical details (like how fields in tables in the database relate to each other), a domain diagram may only show that certain entities relate to each other. A domain diagram usually does not call out any `id` type fields in a table and often includes functions that a particular entity might include.

### An Simple Example

The comic book site we talked about earlier might have some tables like:

- Customer: The customers
- ComicBook: The comic books
- Orders: Orders that have been placed
- OrderItems: The actual items in an order.

An ERD might show:

    +------------+      +-----------------+       +------------+
    |  Customer  |      |  Order          |       | ComicBook  |
    |------------|      |-----------------|       |------------|
    | id (PK)    |1     | id (PK)         |1     n| id (PK)    |
    | name       |------| orderDate       |-------| title      |
    | email      |      | customerId (FK) |       | author     |
    +------------+      +-----------------+       | price      |
                                |1                | publisher  |
                                |                 +------------+
                                |n
                        +-----------------+
                        |OrderItem        |
                        |-----------------|
                        | id (PK)         |
                        | orderId (FK)    |
                        | comicBookId (FK)|
                        | quantity        |
                        +-----------------+

The associated domain diagram notes that:

- A customer can place multiple orders.
- An order can contain multiple order items.
- Each order item is associated with a specific comic book.

So the diagram might look something like:

    +---------------+       +---------+       +------------+
    | Customer      |       |  Order  |       | ComicBook  |
    +---------------+       +---------+       +------------+
    | Name          |1     n| Date    |1    n | Title      |
    | Email         |-------| Total   |-------| Author     |
    | createOrder() |       +---------+       | Publisher  |
    +---------------+         |1              +------------+
                              |
                              |n
                        +-------------+
                        | OrderItem   |
                        +-------------+
                        | Quantity    |
                        +-------------+

Or … it might leave out the fields altogether and just show the entities:

    +-----------+1     n+---------+1     n+-----------+
    | Customer  |-------|  Order  |-------| ComicBook |
    +-----------+       +---------+       +-----------+
                              |1
                              |n
                        +-----------+
                        | OrderItem |
                        +-----------+

### Mermaid JS

[https://mermaid.js.org/syntax/entityRelationshipDiagram.html](https://mermaid.js.org/syntax/entityRelationshipDiagram.html)

The way that we're going to create these diagrams is with Mermaid JS.

Mermaid is a tool for using text and code to create these diagrams in our Markdown files.

We can use a VSCode extension like: [https://marketplace.visualstudio.com/items?itemName=bierner.markdown-mermaid](https://marketplace.visualstudio.com/items?itemName=bierner.markdown-mermaid) to preview the diagrams in VSCode.

See the [ERDiagrams](https://github.com/richarddubay/coe-training/tree/lesson-2-project-planning/ERDiagrams.md) document for examples.

## ADRs

ADRs, or “Architectural Decision Records” are documents that we can create for capturing important architectural decisions made during the course of creating our project.

How many times have you been in a project where you asked yourself “Why does this project use two tables called User and User2” or any other “why is this project this way?” kind of questions? These documents are important because they serve to answer those questions.

To create our ADRs we’re going to use a tool called … wait for it … “ADR Tools!” We can find that package at this link: [https://github.com/npryce/adr-tools](https://github.com/npryce/adr-tools). You can either install it globally or get it from Homebrew if you use that. The point is that you want to be able to use it from the command line.

Once we have that installed, we can:

- Run `adr init doc/architecture/decisions`. This will create a `.adr-dir` file in the root that tells the ADR tool where to put the architectural decision files. And it will create the folder structure and put a default ADR in it.
- You can create a new one with the `adr new` command like: `adr new "Title of Your Decision"`.

## Homework

- Create your Github repository with a README.
- Create your MoSCoW method planning section in your README.
- Use Mermaid to create a domain diagram and an entity relationship diagram in your README.
- Read the ADR article found at [https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions).
- Create at least one new ADR about a decision made for your project.
