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

In talking about authentication for our application, what are the major goals we need to accomplish?

1. On the backend, hiding the necessary routes behind a login is key. We don't want just anyone being able to use our endpoints for their nefarious purposes.
2. Then on the front end, a person needs to be able to either (a) sign up for an account or (b) sign in to their account.

So, we've pretty much handled the important stuff for the backend, but the backend work is not done. We have hidden the necessary routes behind the `authMiddleware` (so we have to have a token to access them). What we haven't done is give the person using our site the ability to sign up or sign in. So that's what we're going to handle in this lesson.

### Sign Up

You can't sign in if you can't sign up, so let's handle sign up first.

For a person to sign up for an account, they will typically enter their first name, last name, email address and a password of their choosing. Depending on the system, sometimes there are other fields we need, or other information that a person would need to provide, but those four things are pretty standard.

#### First, a test route

The first thing we'll need is an API route that the front end can call with the information the person has provided. So let's set that up.

In your `/routers` folder, let's create a new file named `auth.ts`.

In that file, we're going to create a `/signup` route. One thing I like to do is to create a test version of the route first to make sure that we can actually hit the route, then we'll come back and make sure it does what it is supposed to do. So, in that file, let's paste in the following code:

```
import { Router } from "express";

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Auth routes
 */
const router = Router();

// POST: Sign up a person (add)
/**
 * @openapi
 * /signup:
 *   post:
 *     description: Creates a new account.
 *     tags: [Auth]
 *     responses:
 *       201:
 *         description: Returns the JSON info for the created account.
 *       500:
 *         description: Returns error information if the API calls fails.
 */
router.route("/signup").post((req, res) => {
  res.status(201).send("Signup successful");
});

export default router;
```

So we're importing Router from Express, defining the "router", and then creating a `/signup` route that just returns a "Signup successful" message. Simple enough, right?

You'll notice that we've also included some Swagger documentation for the route. Please feel free to change that to whatever you want your documentation to show. You should have Swagger documentation for each of your routes.

Since we've added a new file, we'll need to go into our `index.ts` barrel file and update our exports. Inside that file, add the following line:

```
export { default as authRouter } from "./auth";
```

So now we've created a test `/signup` route, and we've updated the barrel file to export it. But, before we can test this, we need to do one other thing. Do you know what it is?

We'll need to update the `app.ts` file so that there is actually a route to hit. So go to your `app.ts` file and before the place where we call the `authMiddleware`, paste in this:

```
app.use("/auth", authRouter);
```

One thing that I'm not sure that I mentioned before is that the routes defined in this file are like parent routes. So any route in a router file is a segment after the route defined here. So ... for our `/signup` route that we defined in our `authRouter`, the actual route isn't just `/signup`, but `/auth/signup`.

Question: Do you know why we want to put this `app.use` for the auth route before the `authMiddleware`?
Answer: It's because we don't want to have our auth routes hidden behind a login. You shouldn't have to be signed in in order to sign up or sign in. In fact, that seems pretty impossible, doesn't it?

Okay, now let's test this new route. Open up your API testing environment of choice, type in `http://localhost:3001/auth/signup`, make sure you're doing a `POST` request, and give it a go. You should see the "Signup successful" message and a status of 201.

#### Now, let's make it do something real.

Now that we know the route is functioning as it should, we can go ahead and make it do what it was meant to do.

What do you suppose we need to do in order to make this route functional? What are we missing?

If you said "a model", you'd be wrong. In this case, we don't need a model because while it's true that we have to create a new account for the person (which is a database call), we've already hopefully created this model in our `users` or `account` route. So we can just call that method from that model and we're good.

The correct answer is that we're missing a controller. We need some business logic that will handle the info that the client is sending in and create the account with it.

So in our `/controllers` folder, let's create a new file named `auth.ts`.

In that file, we're going to create a function called `postSignUp`. This function needs to do 5 things (you might want to create these as comments inside your function):

- Step 1: Validate email and password
- Step 2: Hash the password
- Step 3: Create the account
- Step 4: Generate an access token
- Step 5: Return the response

Let's add a `try/catch` as well. So right now you're function should look something similar to this:

```
const postSignUp = async (req: Request, res: Response) => {
  try {
    // Step 1: Validate the email and password
    // Step 2: Hash the password
    // Step 3: Create the account
    // Step 4: Generate an access token
    // Step 5: Return the response
  } catch (error) {
    res.status(500).json({
      message: `There was an error creating a new account: ${error}`,
      error,
    });
  }
};
```

**Step 1: Validate the email and password**
Generally we would want to make sure that the input coming in to the function makes sense. In this case, we would do something like verify that the email address is, in fact, an email address, and that the password met the criteria that we set forth for passwords (upper case, lower case, special characters, numbers, etc.). For now, we're going to skip this for time but feel free to go back and give this a shot when you have time.

**Step 2: Hash the password**
Hashing the password is important because the last thing we want to do is to store the actual password in the database. That's a little too _not secure_ for my blood. So we use a package called `bcryptjs` (https://github.com/dcodeIO/bcrypt.js) to hash our passwords. `bcrypt` is often seen as an industry standard when it comes to password hashing. Here's how this works:

We send to `bcrypt` the password that the person signing up (or signing in) wants to use along with something called a `salt round`. If you're unfamiliar, a `salt round` is basically just a unit of how complicated the hash gets. Each password is put through what amounts to a "magic box" where some egregiously difficult computations are done 2^n number of times where "n" is the `salt round` number. We typically use a `salt round` of 10. So for each password, it goes through the magic computations 2^10 (or 1024) times.

What happens inside the magic computation is anyone's guess, but we do know that it takes the password, adds a random value to it (called a `salt` - which we do not control), and then hashes it. This random `salt` value ensures that if two people have the same password, their stored hashed password will be different from each other. This helps protect against attacks and makes figuring out someone's password much more difficult.

What you end up with looks like a random string of characters, but it includes not only the password, but also the `salt` and the `salt round` value all jumbled together. This is how it knows how to un-hash it later when you're trying to use your password to sign in.

To hash our password, we'll do the following:

- Install `bcrypt`. In our terminal, run: `npm i bcryptjs`
- You might also need to install it's types: `npm i --save-dev @types/bcryptjs`
- Back in our `postSignUp` function let's `import bcrypt from "bcryptjs"` and then, under step #2, paste the following:

```
const hashedPassword = await bcrypt.hash(req.body.password, 10);
```

The `.hash()` function is the magic function we talked about earlier. It takes the password and the `salt round` value and does it's thing. What you get on the other side is the password all hashed and ready for you to store.

**We'll be right back after this short break**
Now, before we move on to creating the account, let's test what we have.

- Jump down to `Step 5` and put in the following: `return res.status(201).json({ hashedPassword });`
- In your `auth.ts` router, change the `/signup` route to this: `router.route("/signup").post(postSignUp);` You might need to import `postSignUp` from your controller.
- Now let's test it. In your API testing application of choice, go to the "Body" tab and create some data there:

```
{
    "first_name": "Tony",
    "last_name": "Stark",
    "identifier": "ironman@marvel.com",
    "password": "password"
}
```

Now let's run this. What we should see returned in the hashed password. You'll notice that as you run it multiple times the hashed password continues to change. It'll never be the same twice. Thanks `bcrypt`!

_We now return you to your regularly scheduled program._

**Step 3: Create the account**
This is where we're going to use that `post` function that you've hopefully already written to actually create the account.

Let's head back to your auth controller. Under `Step 3`, paste the following:

```
    const newAccount = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      identifier: req.body.identifier,
      password: hashedPassword,
    };
    const account = await accountModel.postAccount(newAccount);
```

We're just creating an object with the data from the request body (including the fancy new hashed password) and sending that request to our `postAccount` model which should save that account to the database.

We can test this too. In `Step 5`, change `hashedPassword` to `account`, and run the `/signup` endpoint. You should get some JSON data back with your new account. That should be enough to prove that it works. But we're overachievers here in this training class. So let's open up Beekeeper Studio and go look at the `account` table and see what we see. You should see your new account all nice and snug up in there.

**Step 4: Generate an access token**
The last thing we need to do before we can call it a day with the `/signup` route is to generate an access token that the front end will be able to use to make all the other API calls it needs to make on this particular person's behalf. So under `Step 4`, paste this:

```
const accessToken = await generateAccessToken(account.id);
```

Side note: We created the `generateAccessToken` function a while back when we talked about middleware. Essentially we just pass it an `id` and it creates a JWT using that `id` and the secret key. We also set the expiration date of that JWT to 1 day.

Side note #2: You've probably already realized this, but by generating an access token here, we are effectively signing the person in when they create the account. You can, of course, hold off on doing this part and force the person to actually sign in as a separate step if you wanted to.

Last but not least, we need to change the code under `Step 5` once again. This time, replace `account` with `accessToken`.

There. We're all done. Now when you run the endpoint you should get back a JWT.

**NOTES**

- If you try to create an account with the same email more than once you will get an error. In our instance, we set the email address to be a unique identifier when we created the table field, so you can't have more than one account with the same email address.
- When we get to the front end of our project, we'll want to remember that there are going to be certain routes that we want to be signed in for (like a `/profile` page, for example). We will have to check the JWT that we get back from the API against the known data we have for the user to make sure that they match before serving them an authenticated page. Just because we _have_ a JWT in storage or on the session or context doesn't mean that it's the _right_ token.

### Sign In

Now that we can sign up, it just makes sense that we should be able to sign in, right? So how do we do that?

#### Auth Route

We're basically just going to follow the same pattern as we did for the `/signup` route. So the first step will be to add a `/signin` route to our auth router. We'll make this with a test route again first to make sure it works, then we'll add in the `postSignIn` auth controller and get that working.

Back in our `auth.ts` route file, let's add the code we need for our test `/signin` route:

```
// POST: Sign in a person
/**
 * @openapi
 * /signin:
 *   post:
 *     description: Signs in a person.
 *     tags: [Auth]
 *     responses:
 *       201:
 *         description: Returns the JSON info for the signed in account.
 *       500:
 *         description: Returns error information if the API calls fails.
 */
router.route("/signin").post((req, res) => {
  res.status(201).send("Signin successful");
});
```

Now if we run the app and test the `/auth/signin` route (make sure we're doing a `POST` request), we should get the "Signin successful" message.

#### Sidebar

Let's talk about what it is that we need to do in order to sign in. Basically we'll need to follow the following steps:

- Get the email and password from the request body.
- Use that email to get the account info.
- If there is an account, we need to check the password to make sure it matches.
  - If so, we need to generate an access token for them so that they can be considered "signed in."
  - If not, we need to return a 404.

#### Auth Controller

The next step then is to create our `postSignIn` auth controller. This will handle all the stuff we just talked about. So inside our `auth.ts` file in the `/controllers` folder, let's paste the following:

```
const postSignIn = async (req: Request, res: Response) => {
  try {
    // Get the email and password
    const { identifier, password } = req.body;

    // Get the account from their email
    const account = await prisma.account.findUnique({
      where: {
        identifier: identifier,
      },
    });

    // If there is an account, check its password.
    // If the password matches, generate an access token for them (sign them in).
    // If the password doesn't match, return a 404.
    if (account) {
      const passwordMatch = await bcrypt.compare(password, account.password);
      if (passwordMatch) {
        const accessToken = await generateAccessToken(account.id);
        return res.status(200).json({ accessToken });
      }
    }
    return res
      .status(404)
      .send("Account identifier or password was incorrect.");
  } catch (error) {
    res.status(500).json({
      message: `There was an error signing in: ${error}`,
      error,
    });
  }
};
```

Highlights:

- We get the email (identifier) and password from the request body.
- We use the email address to query our `account` model for the account.
- If there is an account, we check the password using the `bcrypt.compare()` function. To that function we pass the password that came in on the request and the password from the account itself and see if they match.
- If we have a match, we generate a JWT and send that token back to the client.
- If we don't, we send back a 404.

#### One Last Update

The last thing to do is to update the auth router (`/routers/auth.ts`) to use the auth controller. Let's change the `router.route` section for the `/signin` route to be:

```
router.route("/signin").post(postSignIn);
```

Then let's test it. On the body of the `/signin` request, let's add the following:

```
{
  "identifier": "ironman@marvel.com",
  "password": "password"
}
```

If the request is successful, you should get a 200 response and a JWT returned to you.

---

That's it! We should now be able to sign up and sign in like superheroes!

## Homework

- Continue to work on anything that we've already covered if needed.
