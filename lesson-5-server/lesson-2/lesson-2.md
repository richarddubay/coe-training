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

## Homework

-
