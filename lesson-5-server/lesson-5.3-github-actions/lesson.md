# Lesson 2 - Models & Controllers

## Review / Questions

Let’s go over the homework from last time:

- Any questions about your routes?

---

## API Design

Just wanted to chat real quick about API design. Specifically around tooling.

- There are some great tools out there to help you design your API.
- One of them is Stoplight [https://stoplight.io/](https://stoplight.io/).
- Another is ApiDog [https://apidog.com/](https://apidog.com/).
- You may not need these for the simple APIs we're building, but if you ever need to go deeper, these are great tools. They allow you to design your API ahead of time, including routes, schemas, and return data. Some of them can be used as full-fledged API documentation as well.
- There's another tool for table design called Eraser [https://www.eraser.io/](https://www.eraser.io/) that looks pretty neat too.

## Business Layer (Controllers)

Let's remember that controllers are the business logic section of the MVC framework.
We'll want to separate out the request and response logic from the router and make that part of the controller.

- In our `/controllers` folder, let's make a new file with the name of your entity. In my case that's `comic_books.ts`.
- Inside of your `routers` entity (i.e. `comic_books.ts`), let's cut out the piece of the `GET` function that starts with the request and response and includes the part where we send the response.
- Then let's create a new `async` function in the `controllers` `comic_books.ts` file that takes uses that part we cut out of the other function. TypeScript will be mad at you here, so you'll have to correctly type `req` and `res`.
- We should also export the function.
- So your file should look like:

```
import { Request, Response } from "express";

const getComicBooks = async (req: Request, res: Response) => {
  res.send("You have gotten all the comic books!");
};

export { getComicBooks };
```

- In general, we want to prefix our functions with the HTTP verb and then the name of the entity and then maybe a qualifier. So, `getComicBooks` will get all comic books. `postComicBook` will create a comic book in the system. `getComicBookById` will get a specific comic book based on the `id`. You get the idea. You'll see this pattern in a lot of APIs.
- Unlike the `routers` folder, we do not have to use a barrel route here to do our exporting. We used the barrel file in `routers` because we'll end up needing to import those items into other places (like tests). But we won't need to do that for the controllers. We're only going to be importing each specific controller into the specific router.
- So next, we want to go back to our `routers` entity file and import the controller we just made. You can do this two ways:
  - `import * as comicBookController from "../controllers/comic_books";`
  - `import { getComicBooks } from "../controllers/comic_books";`
- Now, I'm a guy that likes to name everything and not have a lot of dot notation all over my app, so I personally prefer the second way, but it literally doesn't matter. Choose whichever way makes you happy.
- Depending on which way you chose just now, you can then update your `get` function to either use `comicBookController.getComicBooks` or just `getComicBooks`. These would look like:
  - `router.route("/").get(comicBookController.getComicBooks);`
  - `router.route("/").get(getComicBooks);`
- Okay, let's test it. We should still get back the same thing we had before.

## Database Layer (Models)

Quick refresher that models are our database layer. This is where we do all of our direct connections to the database.

- Note: These are sometimes called `services` as well. So you might be that terminology in other code bases.
- For every table you have you generally want to have a model for it. Unless it's something where you have some sort of many-to-many relationship table. You can probably get that data in other models if that's the case.
- When we add our ORM in a bit (which will be Prisma), we will use Prisma to interact with the database and in our models and we won't have any direct database connections in our controllers. We want to create these individual functions inside our models so that we can test them.
- When creating these functions, we want to name them something like `getAllComicBooks`. Basically naming whatever action you're doing when you interact with the database.

- Let's go into our `/models` folder and create another file named the same as your entity. So for me that's `comic_books.ts`.
- In that file, create an `async` function that has no props and returns some fake data. So for me, that looks like:

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

- Next we will create a barrel file here because these models are not tied to a specific controller. We could use these functions elsewhere. We could be in a completely different controller and call this model if we wanted to.
- So create an `index.ts` file here in the `/models` folder.
- In that file you'll need a line like: `export * as comicBookModel from "./comic_books";`

- Now back in our controller we can call that model function.

  - Inside our `getComicBooks` function we can add `const comicBooks = await comicBookModel.getAllComicBooks();`.
  - We have to remember the `await` because we made the function `async`.
  - Then we can return `res.json(comicBooks)`.

- Let's test again and see what we get. You should get the data you defined back.

## Homework

- Create controllers for all the routes that you previously defined.
- Create all the models to go with your tables. Try to think about what your data structure in your tables might be and return data that will look like that.
