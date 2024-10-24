# Lesson 7 - Auth

## Review / Questions

Let’s go over the homework from last time:

- How did your Prisma set up work?
- Are all your tables connected to your database and are your endpoints functioning correctly?
- Any questions, comments, concerns?

---

## Auth

Let's talk about auth. Sounds fun, right?

Now generally we wouldn't build out our own auth anymore. Typically we'd reach for some library to handle auth related things. It's pretty complex work and because of the sensitive nature of user names and passwords, it's not something that we want to have to deal with. We'll pass it off to things like Auth0 or NextAuth (for our NextJS projects). But in our case, we're going to build it ourselves because we can. When your applications get big enough to warrant a service, definitely reach for one, but for now, let's see how we can get auth working for our applications.

### First Things First ... A Refresher

The first thing we want to do here is just take a look back at what we've already done related to authentication. If you'll remember, in our middleware lesson, we did a few things:

- We wrote a couple of auth related utility functions, one to generate a JWT and one to verify a JWT.
- Then we wrote a small `authMiddleware` that took in a JWT passed as a `Bearer` token, verified it with that utility function using a secret key, and then put the `user_id` on the context to be used later.
- Lastly, we set up the routes in our `app.ts` file so that they used that middleware if necessary.

### Okay, so what's next?

In talking about authentication for our application, what are the major goals that we need to accomplish?

1. On the backend, hiding the necessary routes behind a login is key. We don't want just anyone being able to use our endpoints for their nefarious purposes.
2. Then on the front end, a person needs to be able to either (a) sign up for an account or (b) sign in to their account.

So, we've pretty much handled the important stuff for the backend, but the backend work is not done. We have hidden the necessary routes behind the `authMiddleware` (so we have to have a token to access them). What we haven't done is give the person using our site the ability to sign up or sign in. So that's what we're going to handle in this lesson.

### Sign Up

You can't sign in if you can't sign up, so let's handle sign up first.

## Homework

- Continue to work on anything that we've already covered if needed.
- Expand on auth. Make sure auth is working as it should across the board.
