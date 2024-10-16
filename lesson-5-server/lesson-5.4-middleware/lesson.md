# Lesson 4 - Middleware

## Review / Questions

Let’s go over the homework from last time:

- Let's look at your Swagger documentation.
- Any questions about Swagger / JS Doc?

---

## Express JS Middleware

Functions that you can set to run before all or certain controllers

Middleware allows you to do things before it hits your route handlers.

For example, an auth middleware (which is something we will actually build) might allow you to check to see if someone is signed in before directing them to a particular route. So you could have an "unauthorized" route and an "authorized" route that go to the same "/" (home) route, but the middleware will figure out which one is the right one to go to based on what it finds when it runs.

**PRO TIP**:The order matters when adding middleware.

So for example, if we added an auth middleware and placed all of our routes below the middleware then the middleware would run on all the routes. But, if we were to move one of our routes above the middleware, then the middleware would not run on that particular route.

## A Simple Example

Let's create a simple example to see this at work before we dig into something more significant (like that auth middleware we've mentioned).

- First, in your `server` folder, create a new `middleware` folder.
- Then, create a new file named `test.ts`.
- In that file, let's put the following code:

```
import { NextFunction, Request, Response } from "express";

export async function testMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  return res.status(200).send("Used the test middleware");
}
```

_All this does is return a 200 status with a message that says "Used the test middleware". Now, this isn't something you would normally do. This makes no sense. But it's a good example of how a middleware functions._

- Now in your `app.ts` file, let's import this new middleware:

```
import { testMiddleware } from "./middleware/test";
```

- Then down before you make any of your route calls, let's add this:

```
app.use(testMiddleware);
```

- Save that.
- Now let's go to Postman and try to hit any of your routes. In my case, if I go to the home route (`http://localhost:3000`) or the `comic_books` route (`http://localhost:3000/comic_books`) and attempt a GET, what I will get in return is a 200 status with the message "Used the test middleware".
- If I then move my home route above the middleware call and attempt those two calls again, I can see that the `comic_books` route still returns the "Used the test middleware." message while the home route returns the "Hello World" message like it used to.

So you can see that where the call to the middleware happens matters.

## Using Middleware with Specific Routes

There is also a way to add a middleware to a specific route. To do that, instead of doing `app.use(whateverRoute)` you would do `whateverRoute.use(middleware)`.

To see this in action, we could type out something like `app.use("/comic_books", testMiddleware, comicBookRouter)` and we should still get the same behavior as before.

## Auth Middleware

For auth middleware, here is a basic outline of what we want to do:

1. Verify that token is in the header.
2. Verify that token is valid.
3. Pass token to other handlers.

### Ways to do authentication:

There are two basic ways to do authentication.

- **Token-based authentication**: When someone signs in we will generate a token on the back end with a secret. Within that token we can put all sorts of info: name, id, role, etc. We can pull that token on the front end and get the info out of it. The downside to this method is that the data gets stale. If someone is signed in with a token, we could change their role in an admin panel somewhere from `admin` to `not-admin` for example, but as long as they are signed in with that token they will still have the `admin` role. It won't change until they are signed out and then they sign back in again or if we regenerate that token.
- **Session-based authentication**: With this method the app would check the database on every request. So we would do something like create a token and store it in the database. And then every time we do something we would check the database again to make sure that the token was there and that it was good. The downside to this is speed. Always having to do that call into the database for every request takes time. The upside is that the data is usually never stale.

We're going to use token-based authentication in our project using JWTs. We'll create the token with the info we want, and then we will pass this through our endpoints as the `Bearer` token.

We can store these in cookies or local storage. Cookies take a little more setup, but we can set it and forget it. With local storage we have to go get it every time. We'll leave this up to you, but we should probably just use local storage because it's easier to set up.

Side note: I had some trouble getting the auth middleware to behave correctly so what I ended up doing was, in my middleware, just returning if the route was a route that shouldn't have auth (like my actual sign in and sign up routes).

`return next()`: `next()` just moves on to the next middleware or whatever the next thing is.

We can put info in "context" in Express using `res.locals`. So you can do something like `res.locals.user_id = 1` and then the `user_id` variable would be set in context. Then you can read that same value later: `const { user_id } = res.locals` in our controller.

Create an example here that just uses `some-random-string` or something and do not use the full fledged JWT yet. That's a later lesson.

## Homework

- Continue working on adding any routes/controllers/models or documentation you might need.
- Make sure your auth middleware is working to the best of it's abilities.
