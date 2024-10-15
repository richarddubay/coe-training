# Lesson 4 - Middleware

## Review / Questions

Let’s go over the homework from last time:

- Let's look at your Swagger documentation.
- Any questions about Swagger / JS Doc?

---

## Express JS Middleware

Functions that you can set to run before all or certain controllers

Middleware allows you to do things before it hits your route handlers.

For example, an auth middleware (which is something we will actually build later) might allow you to check to see if someone is signed in before directing them to a particular route. So you could have an "unauthorized" route and an "authorized" route that go to the same "/" route, but the middleware will figure out which one is the right one to go to based on what it finds when it runs.

**PRO TIP**:The order matters when adding middleware.

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

## Homework

- Continue working on adding any routes/controllers/models or documentation you might need.
- Make sure your auth middleware is working to the best of it's abilities.
