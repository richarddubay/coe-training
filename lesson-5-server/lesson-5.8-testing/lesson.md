# Lesson 8 - Testing

## Review / Questions

Let’s go over the homework from last time:

- How's the overall app? We're getting close to the end so everything should be functioning at this point.
- Any questions, comments, concerns?

---

## Testing

Let's talk everyone's favorite subject ... testing! In this lesson we'll cover the who, what, where, when, why, and how of testing.

### Who Testing?

Who testing? You testing. We testing. Me testing.

Dr. Suess would be proud of that sentence right there.

### What Testing?

We should look at testing everything and anything we can. In relation to our backend API, we'll be writing tests for our models, routers, and controllers. We'll skip some things like the middleware because that can be a little tricky for now. In general we want a test for each model, router, and controller, and for each individual item inside those. For example, if we are testing our comic book model, we'll want a test for deleting a comic book, seeing all comic books, seeing one particular comic book, adding a comic book, and updating a comic book. We want to make sure that each function is tested.

### Where Testing?

Where do we write our tests? That's a great question. I'm glad you asked.

There are generally two schools of thought when it comes to testing. We can either have all of our tests for everything all in one place, or we can colocate our tests with the things we're testing. Personally, I've seen both. In some applications I've seen a `__tests__` directory at the top of the application and all of the tests are run from there. In other applications I've seen the tests more local to the things that are being tested. Sometimes there are `__tests__` folders inside other folders (like in a `/components/tests` type structure) and sometimes I've seen tests located right next to the thing itself (this is like having a `button.tsx` and `button.test.tsx` file right next to each other). Honestly, unless the framework mandates where you have to put the tests, it's entirely up to you how you do it.

In this class, we're going to be placing our tests inside a `__tests__` folder _inside_ each of the models, routers, and controllers folders.

### When Testing?

You should be writing tests from the very start of your application. For every feature and every bug fix and every time in between. If you wait too long and try to retro fit tests into your application it will be a daunting task that no one wants to take on. If you start from the beginning with the mindset of testing, then it will be a much easier go of it. Whenever you make a change you will already be thinking about the test you need to write that goes with that change. You can make it a part of your projects culture from the beginning. It's a lot easier to start out with tests then it is to have to convince your client later that they are important. Yes, they do take time and effort, but that leads us into the next point ...

### Why Testing?

I can't emphasize enough how important good tests are. We're living in a playing card castle without them. One slip and the whole thing can come falling to the ground. Well, maybe it's not that dire of a situation, but they are for sure necessary. When you make a change, how do we know we didn't break anything in that one other dark corner of the app that no one has touched in 3 years because it's scary and potentially filled with all kinds of little nasty bugs? One way is to have someone whose sole job it is to do QA who will run through every possible scenario in the app to make sure that we didn't get a toe out of line. But what happens if you don't have a QA person on your project? You write tests. Yes it takes time. Yes it isn't the most fun. But yes, it is of great worth and importance if you want your application to function successfully over the long haul.

I asked ChatGPT:

```
If you had one paragraph to plead with mid-level developers about the importance of writing tests, what would you say?
```

This is what I received as a response:

```
Writing tests might feel like extra work, but they’re essential for confidence and efficiency. Tests allow you to move quickly without breaking things, saving time in the long run by catching bugs early before they become costly. Plus, they let you refactor code fearlessly, knowing you can validate it instantly. A solid suite of tests also keeps everyone aligned—no more guessing if your changes affect others. Tests are your safeguard, giving you more time for feature building and less time firefighting issues.
```

Which I feel is a pretty apropos sentiment.

### How Testing?

Alright, enough theory. Let's dig in and write some tests, shall we?

unit tests:
jest
jest-when
controllers/handlers

integration tests:
supertest
testcontainers
responses and response codes and validation

test reporters:
jest-junit

describe all tests
nested describes
"it should" ...
make sure you test the response codes

AAA Approach
Arrange, Act, Assert

Github Actions

## Homework

- Continue to work on anything that we've already covered if needed.
- Write any other tests you think you need.
