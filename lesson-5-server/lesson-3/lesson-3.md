# Lesson 3 - Swagger

## Review / Questions

Let’s go over the homework from last time:

- Any questions about your controllers or models?

---

## Swag

You've all probably used Swagger before so you know that it's really just a visual way to view and interact with your API endpoints. We feed Swagger some documentation and our code and it will generate interactive API documentation, in some cases including the ability to try out the API directly from the browser. Swagger uses the Open API specification which is just a way to describe the structure of our APIs. Swagger is great because it forces you to use a standard format for your API documentation, it's super easy to use, and since it generates it's documentation from your code, it's always up-to-date.

The other side of the Swagger formula here is JS Doc. JS Doc is basically just a standardized way of adding comments to your code which, when parsed, create HTML documentation for whatever you're describing.

For us, we're going to be using a combination of JS Doc and our API code to generate our Swagger documentation.

To that end, we're going to use two packages:

- First, a package called Swagger JS Doc [https://github.com/Surnet/swagger-jsdoc](https://github.com/Surnet/swagger-jsdoc) to create our API documentation from our routes. Here's a link to the documentation site if you need it: [https://swagger.io/docs/](https://swagger.io/docs/). `npm i swagger-jsdoc`.
- Second, we'll also need a package called `swagger-ui-express` [https://www.npmjs.com/package/swagger-ui-express](https://www.npmjs.com/package/swagger-ui-express). `npm i swagger-ui-express`.

There's a command that we can run that will generate all of our swagger documentation for us.

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

That `__dirname` part would allow you to run the Swagger docs from the command line if you wanted.

One note, you can see we're calling `app.use` here. This is us setting a route for the documentation and then using some middleware to serve up the Swagger docs. We'll get to middleware really soon.

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

**NEXT TOPIC (For Lesson 4)**: Express JS Middleware
Functions that you can set to run before all or certain controllers

Middleware allows you to do things before it hits your route handlers.

For example, an auth middleware (which is something we will actually build later) might allow you to check to see if someone is signed in before directing them to a particular route. So you could have an "unauthorized" route and an "authorized" route that go to the same "/" route, but the middleware will figure out which one is the right one to go to based on what it finds when it runs.

The order matters when adding middleware.

So for example, if we added an auth middleware and placed all of our routes below the middleware then the middleware would run on all the routes. But, if we were to move one of our routes above the middleware, then the middleware would not run on that particular route.

**\*\*\*** SHOW AN EXAMPLE HERE **\*\*\***

There is also a way to add a middleware to a specific route. To do that, instead of doing `app.use(whateverRoute)` you would do `whateverRoute.use(middleware)`.

For auth middleware:

1. Verify that token is in the header.
2. Verify that token is valid.
3. Pass token to other handlers.

Ways to do authentication:

- Token-based authentication: When someone signs in we will generate a token on the back end with a secret. Within that token we can put all sorts of info: name, id, role, etc. We can pull that token on the front end and get that info to use it if we need to. The downside to this method is that the data gets stale. If someone is signed in with a token, we could change their role in an admin panel somewhere from like `admin` to `not-admin`, but as long as they are signed in with that token they will still have the `admin` role. It won't change until they are signed out and then they sign back in again or if we regenerate that token.
- Session-based authentication: With this method the app would check the database on every request. So we would do something like create a token and store it in the database. And then every time we do something we would check the database again to make sure that the token was there and that it was good. The downside to this is speed. Always having to do that call into the database for every request takes time. The upside is that the data is usually never stale.

We're going to use token-based authentication in our project using JWTs. We'll create the token with the info we want, and then we will pass this through our endpoints as the `Bearer` token.

We store these in cookies or local storage. Cookies take a little more setup, but we can set it and forget it. With local storage we have to go get it every time.

Side note: I had some trouble getting the auth middleware to behave correctly so what I ended up doing was, in my middleware, just returning if the route was a route that shouldn't have auth (like my actual sign in and sign up routes).

`return next()`: `next()` just moves on to the next middleware or whatever the next thing is.

We can put info in "context" in Express using `res.locals`. So you can do something like `res.locals.user_id = 1` and then the `user_id` variable would be set in context. Then you can read that same value later: `const { user_id } = res.locals` in our controller.

Create an example here that just uses `some-random-string` or something and do not use the full fledged JWT yet. That's a later lesson.
