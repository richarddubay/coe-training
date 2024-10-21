# Lesson 5 - Validation

## Review / Questions

Let’s go over the homework from last time:

- How are your models, routers, controllers coming along?
- How is your middleware working so far?
- Any questions?

---

## Express Validation

### What is Validation?

Simply put, validation ensures that what we're getting on the incoming API requests meets what we expect to be getting for those requests before we try to process them. This is helpful because we can weed out bad or malformed data before it causes errors or potential security issues.

During validation we'll typically check for things like making sure the arguments we're passing are of the correct type, that the values for those arguments are in the correct range, and that we're getting all the required arguments, among other things. We can also check for other more custom requirements like making sure that a password meets the correct complexity standards, for example.

In our project, we are going to handle validation in our `routers`. We could theoretically wait and handle it in our `controllers`, but by doing it this way we short-circuit any potential problems before they become problems and we start passing undesirable data around like it's candy with razor blades in it. 🍬 🪒

### Express-Validator Library

For our purposes here, we're going to use a validation library called `express-validator`. Here's a link: https://express-validator.github.io/docs/. This library is essentially a middleware that will handle all of our validation needs.

Before we get started writing our code, let's take a look at a couple of things in the documentation.

#### Getting Started

In the Getting Started guide, let's look at an example of what validation might look like. If you've used any sort of validation library before (maybe `yup` or `zod` come to mind), the basics of this should look pretty familar. It's just methods that we chain together to make sure we're getting what we need.

One thing to note is that `express-validator` does not report validation errors automatically. They leave it up to you to decide when and where those errors should be shown. Which is fine. We'll make sure we handle that in a bit.

Also there is a bit here about sanitizing inputs using the `escape()` function. We won't spend too much time on this here but this could be an important part of what you do to make sure that you're data isn't vulnerable to cross site scripting attacks.

#### The Validation Chain

In the validation chain documentation, let's talk about validators, sanitizers, and modifiers. Also, let's discuss how chaining order matters.

### Let's Build Some Validation

First thing we're going to need to do is to install the `express-validator` package. We'll install this as a regular dependency. In the root of our `/server` folder we can run `npm i express-validator`.

Now, in our `/routers` folder, open up `comic_books.ts` and let's import the `param` function from `express-validator`: `import { param } from "express-validator";`. There are a few different base functions we could import here. You can see them all in the docs (https://express-validator.github.io/docs/api/check). In our case we want to validate one of the params passed into one of our routes, so we're going to use the `param` function.

In the `comic_books.ts` file, let's look at the "get comic book by id" route. It currently looks something like this:

```
router.route("/:id").get(getComicBookById);
```

You can see that we're passing an `id` param. What we want to do here is just make sure that the id that we're getting is a number. To do that, we just need to change the above line to the following:

```
router.route("/:id").get(param("id").isNumeric(), getComicBookById);
```

The important change is is the addition of `param("id").isNumeric()`. Quite literally, all this is doing is checking that the id param is numeric.

Now, if we were to call this endpoint, what we would get would NOT be an error, but it would actually return data, quite possibly with a `null` `id`.

```
[
    {
        "id": null,
        "title": "Avengers",
        "issue_number": 1,
        "publisher_id": 2,
        "published_date": "2018-05-02",
        "created_at": "2024-10-21T17:35:03.055Z"
    }
]
```

If you remember from our walkthrough of the `express-validator` docs a bit earlier, we saw that `express-validator` doesn't automatically report errors. Instead, that's on us to handle it ourselves. So let's do that now.

### Validate Function

To handle our validation errors, we're going to write a `validate` function that we can call along with our validation chain in our route. In our `/middleware` folder, let's create a new file named `validate.ts`. In that file, let's add the following:

```
import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

export function validate(req: Request, res: Response, next: NextFunction) {
  const error = validationResult(req);
  const hasError = !error.isEmpty();

  if (hasError) {
    return res
      .status(400)
      .json({ error: error.array({ onlyFirstError: true }) });
  } else {
    next();
  }
}
```

The important bits here are:

- We're calling `validationResult` from `express-validator` with the request object. This function extracts the validation results from the request so we can do something with them.
- From there we can determine if we have an error and handle it. Note that we're only returning the first error if there are multiple. You may or may not want that functionality in your production ready application.

Okay, now that we have a function, let's call it. Back in your comic_books.ts file, import that function (`import { validate } from "../middleware/validate";
`). Then down in your route, update it to the following:

```
router.route("/:id").get(param("id").isNumeric(), validate, getComicBookById);
```

Now let's run that endpoint again. When we do we should see an error now that looks similar to this:

```
{
    "error": [
        {
            "type": "field",
            "value": "a",
            "msg": "Invalid value",
            "path": "id",
            "location": "params"
        }
    ]
}
```

You should see the type of error, the value that was sent in, the error message (in this case a default error message), the path (or place the error occurred), and that it was a param that was the problem.

Let's make one more adjustment. We can do better than that generic default error message. Let's update our call to include a custom message. To do that, let's update the route to be the following:

```
router
  .route("/:id")
  .get(
    param("id")
      .isNumeric()
      .withMessage("Incorrect id type. The id should be a number."),
    validate,
    getComicBookById
  );
```

The `withMessage` function allows you to pass a custom error message. If you call the endpoint again, you should see your custom error message in the `msg` part of the error object:

```
{
    "error": [
        {
            "type": "field",
            "value": "a",
            "msg": "Incorrect id type. The id should be a number.",
            "path": "id",
            "location": "params"
        }
    ]
}
```

## Homework

- Continue adding / modifying any models, routers, or controllers you need.
- Set up the rest of the validators for your endpoints.
