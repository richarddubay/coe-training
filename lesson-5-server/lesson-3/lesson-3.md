# Lesson 3 - Swagger

## Review / Questions

Let’s go over the homework from last time:

- Let's look at your controllers and models.
- Any questions about your controllers or models?

---

## Swag

Now that we have routers and models and controllers, let's documenting our API.

There are two parts of the API documentation formula we'll need to look at. The first is Swagger. You've all probably used Swagger before so you know that it's really just a visual way to view and interact with your API endpoints. We feed Swagger some documentation and our code and it will generate interactive API documentation, in some cases including the ability to try out the API directly from the browser. Swagger uses the Open API specification which is just a way to describe the structure of our APIs. Swagger is great because it forces you to use a standard format for your API documentation, it's super easy to use, and since it generates it's documentation from your code, it's always up-to-date.

The other part of the API documentation formula is JS Doc. JS Doc is basically just a standardized way of adding comments to your code which, when parsed, create HTML documentation for whatever you're describing. You've probably seen this in action when you hover over a function call and you get the fancy information that helps you know what to pass and what's returned.

For us, we're going to be using a combination of JS Doc and our API code to generate our Swagger documentation.

To that end, we're going to use two packages:

- First, a package called Swagger JS Doc [https://github.com/Surnet/swagger-jsdoc](https://github.com/Surnet/swagger-jsdoc) to create our API documentation from our routes. Here's a link to the documentation site if you need it: [https://swagger.io/docs/](https://swagger.io/docs/). Install it using `npm i swagger-jsdoc`.
- Second, we'll also need a package called `swagger-ui-express` [https://www.npmjs.com/package/swagger-ui-express](https://www.npmjs.com/package/swagger-ui-express). This is what allows us to actually serve the documentation. You can install it using `npm i swagger-ui-express`.

Next we need to set up our Swagger specification (or configuration). This can just live in your `app.ts` file. You can move it somewhere else if you want but you don't have to.

```
... other imports
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Comic Book Store",
      version: "1.0.0",
      description:
        "This is the Swagger API documentation for the Comic Book Store.",
    },
  },
  apis: ["./routers/*.ts"], // files containing annotations as above
};

const swaggerSpec = swaggerJsDoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
```

It's going to yell at us about types. You'll have to install the types for each of these following the directions the error gives you:

- `npm i --save-dev @types/swagger-jsdoc`
- `npm i --save-dev @types/swagger-ui-express`

You'll want to change out the title and the description, and make sure that the `apis` array is pointing to the correct place for your routers.

You can also change that `apis` line to be something like:

```
apis: ['./routers/**.ts', `${__dirname}/routers/\*.ts`],
```

That `__dirname` part would allow you to run the Swagger docs from the command line if you wanted. You can add this or not ... totally up to you.

One note, you can see we're calling `app.use` here. This is exactly like we did with our first route so it should look familiar to you.

Now let's add our first JS Doc bit. In the `comic_books` router, let's add this right above the `getAllComicBooks` route:

```
// GET all comic books
/**
 * @openapi
 * /comic_books:
 *   get:
 *     description: Get a list of all the comic books.
 *     tags: [Comic Books]
 *     responses:
 *       200:
 *         description: Returns a JSON list of all the comic books.
 */
```

At the top of the `comic_books` router file, before the `const router = Router()` line, paste the following:

```
/**
 * @swagger
 * tags:
 *   name: Comic Books
 *   description: Comic book routes
 */
```

This will define a "tag" that will allow you to group your routes together as you go across routers. This helps to keep your routes separate in the documentation.

Now that we have all that, let's add `console.log('swaggerSpec = ', swaggerSpec)` right after it's declaration and then run our server. When we do that we can see that what's output to the console is our actual Open API Swagger documentation. Which is pretty cool.

Now if you go to `http://localhost:3001/api-docs` in your browser, you should see your actual Swagger documentation site is up and running.

Note: Because these JS Doc comments are essentially YAML, it's going to be very finicky about your spacing. Once you get one working, it might be good to just copy and paste so that all the other ones match up.

## Homework

- Continue working on adding any routes/controllers/models you need.
- Get the Swagger docs set up and working for each of the routes you've defined.
