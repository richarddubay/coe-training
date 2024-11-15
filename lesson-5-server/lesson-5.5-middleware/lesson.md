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
- Then, create a new file named `example.ts`.
- In that file, let's put the following code:

```
import { NextFunction, Request, Response } from "express";

export async function exampleMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  return res.status(200).send("Used the example middleware");
}
```

_All this does is return a 200 status with a message that says "Used the example middleware". Now, this isn't something you would normally do. This makes no sense. But it's a good example of how a middleware functions._

- Now in your `app.ts` file, let's import this new middleware:

```
import { exampleMiddleware } from "./middleware/example";
```

- Then down before you make any of your route calls, let's add this:

```
app.use(exampleMiddleware);
```

- Save that.
- Now let's go to Postman and try to hit any of our routes. If I go to the home route (`http://localhost:3000`) or the `comic_books` route (`http://localhost:3000/comic_books`) and attempt a GET, what I will get in return is a 200 status with the message "Used the test middleware".
- If I then move my home route above the middleware call and attempt those two calls again, I can see that the `comic_books` route still returns the "Used the test middleware." message while the home route returns the "Hello World" message like it used to.

So you can see that's where the call to the middleware happens matters. Routes above the middleware are not affected by the middleware, but routes below the call to the middleware are.

## Using Middleware with Specific Routes

There is also a way to add a middleware to a specific route. To do that, instead of doing `app.use(whateverRoute)` you would add an extra parameter to your `app.use` call that specifies the middleware to use.

To see this in action, we could type out something like `app.use("/comic_books", exampleMiddleware, comicBookRouter)` and we should still get the same behavior as before.

## Auth Middleware

For our auth middleware, here is a basic outline of what we want to do:

1. Verify that token is in the header.
2. Verify that token is valid.
3. Pass token to other handlers.

### Ways to do authentication:

There are two basic ways to do authentication.

- **Token-based authentication**: When someone signs in we will generate a token on the back end with a secret. Within that token we can put all sorts of info: name, id, role, etc. We can pull that token on the front end and get the info out of it. The downside to this method is that the data gets stale. If someone is signed in with a token, we could change their role in an admin panel somewhere from `admin` to `not-admin` for example, but as long as they are signed in with that token they will still have the `admin` role. It won't change until they are signed out and then they sign back in again or if we regenerate that token.
- **Session-based authentication**: With this method the app would check the database on every request. So we would do something like create a token and store it in the database. And then every time we do something we would check the database again to make sure that the token was there and that it was good. The downside to this is speed. Always having to do that call into the database for every request takes time. The upside is that the data is usually never stale.

We're going to use token-based authentication in our project using JSON Web Tokenss. We'll create the token with the info we want, and then we will pass this through our endpoints as the `Bearer` token.

We can store these in cookies or local storage. Cookies take a little more setup, but we can set it and forget it. With local storage we have to go get it every time. We'll leave this up to you, but we should probably just use local storage because it's easier to set up.

### Talking JWTs

#### What is a JWT?

A JWT (JSON Web Token) is a secure way to share information between two parties, like a server and client. It consists of three parts:

    1. Header: Contains metadata about the token, like the type of token (JWT) and the algorithm used to sign it.
    2. Payload: Contains the actual data (like user information or permissions). This part is usually base64-encoded.
    3. Signature: Ensures the token hasn’t been tampered with. It’s created by hashing the header and payload together with a secret key.

JWTs are often used for authentication. After a user logs in, the server generates a JWT and sends it to the client. The client then includes this token in requests to verify its identity, without the server needing to store session data.

Here’s what a typical JWT looks like:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMjM0NTY3ODkwfQ.sFlKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

Each part is separated by dots (.) and can be decoded to read the content. The signature ensures its integrity, making it useful for stateless authentication.

It's important to note that a JWT is "encoded", not "encrypted." Anyone can see a JWT and decode it and get it's data out. But it can't be modified in any way or the signature will be invalid and stop working. That's because JWTs are usually signed with a secret key, so if you change the data inside the JWT, and you don't have the secret key, the signature becomes invalid.

Encryption is the process of scrambling data so that only someone with the key can unscramble it and read it. That isn't what happens here.

#### JWT DOT IO

Let's take a look at https://jwt.io/.

Immediately what you'll notice in the main section is the default JWT that is created for example purposes, along with it's breakdown. You can see the header is made up of the algorithm and the token type. You can see at the bottom that the signature is made up of an amalgamation of the base64 encoded header, the base64 encoded payload, and the secret key.

What I really want to spend time on is the payload section. What you see there are three items. The `sub`, the `name`, and the `iat`. The `name` is just a name. Nothing really special about that. The `sub` is the identifier. It could be a user id, for example. Now, you don't have to use `sub` if you don't want to. You could legitimately use `user_id` if you wanted. In fact, it's important to note that you can put any data in here that you want. You're not relegated to a certain set of data, or to calling any of that data by certain names. In this case, `sub` is kind of a universally accepted moniker (short for "subject") that most people use and which we'll use in this class. Since it's widely accepted, if you ever wanted your app to interface with another third party, for example, there's a good chance that the third party is set up to accept `sub` and not something like `user_id`. Since our apps are pretty much just for us, we could probably get away with calling it whatever we want, but we'll keep it `sub` for consistency's sake. `iat` is short for `issued at` and it's basically just the timestamp of when the token was created (in seconds since the Unix epoch - January 1, 1970 - form). You can use this when doing calculations like to find out if a token has expired, for example.

### Enough Explanation ... Let's Implement it Already!

First things first, in order to create, decode, and verify our JWTs we're going to need the `jsonwebtoken` package. So let's install that: `npm i --save-dev jsonwebtoken`.

You also might need to install the types for `jsonwebtoken`: `npm i --save-dev @types/jsonwebtoken`.

We're also going to need a secret key. To create a secrety key we'll run the following command in our terminal: `openssl rand -base64 32`. This will create a 32 byte random string in base64 format. Let's add this secret key to our `.env` file with the name `JWT_SECRET_KEY`.

Next, we're going to need a couple of functions. Initially we're going to need a function to verify and decode the contents of the JWT we pass to it. Down the road we'll need another function to actually generate a JWT, so we might as well go ahead and create that now.

Let's create a `/utils` folder in the root of our `/server` folder. Inside the `/utils` folder, let's create a file named `auth.ts`.

Inside that file, paste the following:

```
import jwt from "jsonwebtoken";
import "dotenv/config";

interface JWTPayload {
  sub: number
}

const secretKey = process.env.JWT_SECRET_KEY ?? "some-random-key";

export const generateAccessToken = async (userId: number): Promise<string> => {
  const payload: JWTPayload = { sub: userId };
  return jwt.sign(payload, secretKey, {
    expiresIn: "1d",
  });
};

export const verifyAccessToken = async (
  accessToken: string
): Promise<string | JWTPayload> => {
  return jwt.verify(accessToken, secretKey) as string | JWTPayload;
};
```

Now we need the actual auth middleware function. In your `/middleware` folder, create a new file named `auth.ts`. Inside that file, paste the following:

```
import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/auth";

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authToken = req.headers.authorization?.split(" ")[1];

  if (authToken) {
    try {
      const token = await verifyAccessToken(authToken);
      if (token) {
        res.locals.user_id = token.sub;
        return next();
      }
    } catch (error) {
      return res.status(401).send("Missing auth token");
    }
  }
  return res.status(401).send("Missing auth token");
}
```

Two items to note in this middleware:

1. `return next()`: `next()` just moves on to the next middleware or whatever the next thing is. We either are going to move on to the next middleware or we're going to return an error.
2. We can put info in "context" in Express using `res.locals`. So you can do something like `res.locals.user_id = token.sub;` (like we do here) and then the `user_id` variable would be set in context. Then you can read that same value later: `const { user_id } = res.locals` in our controller.

Now we will do just like we did with the test middleware and import this into the `app.ts` file and see if it works. All I did was change the import to use `authMiddleware` instead of `testMiddleware` and where we were calling the `testMiddleware` on the `/comic_books` route to use `authMiddleware` instead. When you test this in Postman (or your testing software of choice), you should still get "Hello World!" on the home route, but the `/comic_books` route should now give you an error that it is missing an auth token. Which is true. We didn't actually give it a JWT, did we? Let's do that now.

On jwt.io, let's fill in some data in the "payload" section. You can leave this with the default data, or you can change it to be whatever you want it to be. Done? Great. In the "verify signature" section, let's put the secret key you generated in the spot where it says "your-256-bit-secret". You'll notice as you make changes that the encoded token changes (as it should).

Once you're happy with the data in your payload and you've pasted in your secret, let's copy that encoded token. Now, back in Postman, find the "Authorization" tab, change the drop down to "Bearer Token" and paste your encoded token in the box it gives you. Now click "Send" again. You should now get back the data you expect!

---

A couple of extra things:

- When we get to testing down the road, it will be helpful if we can sort of override what the `authMiddleware` returns. So to handle that, we're going to add this bit at the beginning of the `authMiddleware` function:

```
if (process.env.NODE_ENV === "test") {
  res.locals.user_id = 1;
  return next();
}
```

What this does it just says, "hey, if you're testing right now, let's just set the `user_id` to 1 and assume you're signed in."

- The other thing to note is that you might potentially have some issues with the `authMiddleware` not playing super nicely. It might not want to work for all the routes that it's supposed to or it might try to work for routes that it isn't. If you run into that, one thing you can do is just tell your middleware directly about the routes that you want it to skip. So you could do something like:

```
if (req.path.startsWith("/auth")) {
  return next(); // Skip authMiddleware for /auth routes
}
```

This will tell your middleware that if the path starts with `/auth` then we don't want to try to process a token for this. There is no reason you would want to see if you were correctly signed in if you were actually trying to sign in, right?

---

So to recap, we learned about middleware, what it does and how to implement it. We've also learned about JSON Web Tokens and how to combine middleware and JWTs to verify that you're signed in when attempting to hit an API endpoint.

## Homework

- Continue working on adding any routes/controllers/models or documentation you might need.
- Make sure your auth middleware is working and that it correctly blocks the routes it's supposed to.
