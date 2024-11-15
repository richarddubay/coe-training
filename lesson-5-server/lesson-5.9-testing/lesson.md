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

#### Unit Test Setup

Before we can begin writing tests for _anything_, we need to get our whole testing situation set up. We're going to be writing two different kinds of tests: unit and integration. Unit tests for `models` and `controllers` and integration tests for our `routers`.

For our unit tests, we'll need to install three packages: `jest`, `jest-when`, and `ts-jest`. We'll install these as dev dependencies.

- `jest` (https://github.com/jestjs/jest): `jest` is a comprehensive test suite used in the majority of JavaScript projects. We can install it using `npm i --save-dev jest`.
- `jest-when` (https://github.com/timkindberg/jest-when): `jest-when` is a package used to set the return value of mocked functions based on the parameters passed to the functions. We can install it using `npm i --save-dev jest-when`.
- `ts-jest` (https://github.com/kulshekhar/ts-jest): `ts-jest` is simply a Jest transformer that allows Jest to run in TypeScript projects. We can install it using `npm i --save-dev ts-jest`.
- `jest-junit` (https://github.com/jest-community/jest-junit): `jest-junit` is a Jest reporter that allows Jest to generate JUnit XML test results. This isn't as helpful to us here locally, but it will be a good thing when we hook this up to our Github Actions. We will get much better test reporting in our CI environment. We can install it using `npm i --save-dev jest-junit`.

In our `package.json` file, we'll need to add some configuration options for `jest-junit` as well. Right under the `scripts` section, add the following:

```
"jest-junit": {
  "outputDirectory": "reports",
  "outputName": "jest-junit.xml",
  "ancestorSeparator": " › ",
  "uniqueOutputName": "false",
  "suiteNameTemplate": "{filepath}",
  "classNameTemplate": "{classname}",
  "titleTemplate": "{title}"
},
```

Basically all we're doing here is telling Jest to create a `reports` folder in the root of our `/server` folder and create a `jest-junit.xml` file in that folder. Then we're going to tell Jest to use that file as the output for our test results.

We'll also need to install the types for `jest` and `jest-when`. We can do that with the following two commands:

- `npm i --save-dev @types/jest`
- `npm i --save-dev @types/jest-when`

While we're here in setup mode, let's go ahead and create `__tests__` folders in each of out `models`, `contollers`, and `routers` folders. This will prepare us for when we create the actual test files.

The next thing we'll need is a Jest configuration file. So, in the root of the `/server` folder, let's create a `jest.config.ts` file and paste in the following code:

```
/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  clearMocks: true,
  fakeTimers: {
    enableGlobally: true,
  },
  preset: "ts-jest",
  testEnvironment: "node",
};
```

Basically we're just setting up some stuff that Jest needs here in order to test our TypeScript files. We're telling Jest to clear any mocks after each test, allow fake timers, to use `ts-jest` for transpiling our TypeScript code, and to allow our tests to simulate a NodeJS environment.

Next, in the `/server` folder, create a new folder called `test-utils` and create a `prisma.ts` file inside of it. In that `prisma.ts` file, paste the following code:

```
import { prisma } from "../utils/prisma";

const prismaForTests = prisma as any;

export { prismaForTests };
```

We're going to use a combination of `prisma` and `prismaForTests` in our actual tests. All `prismaForTests` does is redefine `prisma` as an `any` type. This is typically frowned upon, but in this case, we'll need it. We're going to mock some of the Prisma functions as they relate specifically to an entity, and if we don't re-type this as `any` we'll run into some pretty nasty TypeScript errors and, in this particular case, we want y'all to be able to write tests, not fight with TypeScript.

#### One More Thing - AAA
We're going to follow the AAA pattern in our tests. This is a common pattern in testing and it means you're writing tests in a way that makes it easy for other people to read your tests. The AAA pattern is:

- Arrange
- Act
- Assert

The first thing we're going to do is set up our data for our tests. That's the "Arrange" part. Then we'll "Act" on that data by calling the function we're testing, and finally we'll "Assert" that the function did what we expected it to do.

#### Models
Finally, let's start writing our tests. We'll start with models.

In your `/models/__tests__` folder, create a new file called `comic_books.test.ts` and paste in the following code:

```
import { comicBookModel } from "..";
import { prismaForTests } from "../../test-utils/prisma";
import { prisma } from "../../utils/prisma";

jest.mock("@prisma/client");

describe("Comic Books Model", () => {
  describe("deleteComicBook", () => {
    it("should delete a comic book", async () => {
      // Arrange
      const comic_book = {
        id: 1,
        title: "Avengers",
        issue_number: 1,
        publisher_id: 2,
        published_date: "2018-05-02",
        created_at: new Date(),
        updated_at: null,
        deleted_at: null,
      };
      prismaForTests.comic_books = {
        delete: jest.fn().mockResolvedValue(comic_book),
      };

      // Act
      const result = await comicBookModel.deleteComicBook(1);

      // Assert
      expect(prisma.comic_books.delete).toHaveBeenCalledTimes(1);
      expect(prisma.comic_books.delete).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            id: 1,
          },
        })
      );
      expect(result).toEqual(comic_book);
    });
  });
});
```

You've probably seen this pattern before. We use "describe" and "it" declarations to lay out our tests. We have an outer `describe` that wraps the whole suite of tests and then an inner `describe` that we will use for each major piece. Inside that `describe` we declare what "it" (the test) should do. Then inside the `it` we `arrange` our data (in this case we just create a comic book), `act` on the data (in this case we want to test the ability to delete a comic book), and then we `assert` that the delete function was actually called and make sure it was called with the right arguments.

To run these tests, we'll have to update our `package.json` file to include a few new scripts:

```
"test": "jest",
"test:unit": "jest --testPathIgnorePatterns ./routers/ --ci --reporters=default --reporters=jest-junit",
"test:unit:watch": "jest --watch --testPathIgnorePatterns ./routers/"
```

What do we have here? Why three different commands? Let's break them down:

- `test`: This is the command that we use to run all our tests.
- `test:unit`: This is the command that we use to run all our unit tests. We tell this command to ignore any tests that are in the `routers` folder. These will be integration tests, so we don't want them to run here. We also are telling Jest to spit out the results of the tests using a `jest-junit` reporter. We'll set that up in just a moment.
- `test:unit:watch`: This is the command that we use to run all our unit tests and watch for changes. This command will continue to run tests as we make changes to our code.

Let's go to the command line and see what happens. In your terminal, inside the `/server` directory, run `npm run test`. Hopefully we get a passing test. If we had more than one test anywhere this command would run them all.

Now we want to run the unit tests only. To do that, let's run the `npm run test:unit` command. This runs only the unit tests and stops. What you will see is that a `reports` folder has been created inside of the `/server` directory. Inside of that folder is a `jest-junit.xml` file. This file contains all of the test results.

Lastly, let's run `npm run test:unit:watch`. The difference here is that this will continue to run unit tests as we make changes to our code. Also this command _does not_ write to the `reports` folder like the other unit test specific command did.

Now that we've got through all of those, we'll need to finish up the rest of the model tests for this entity. They should pretty much follow the same pattern as the one we already wrote. Just make the adjustments where they need to be made to test the `get all`, `get one`, `create`, and `update` functions. When you're done, the file should look pretty similar to this:

```
import { comicBookModel } from "..";
import { prismaForTests } from "../../test-utils/prisma";
import { prisma } from "../../utils/prisma";

jest.mock("@prisma/client");

describe("Comic Books Model", () => {
  describe("deleteComicBook", () => {
    it("should delete a comic book", async () => {
      // Arrange
      const comic_book = {
        id: 1,
        title: "Avengers",
        issue_number: 1,
        publisher_id: 2,
        published_date: new Date("2018-05-02"),
        created_at: new Date(),
        updated_at: null,
        deleted_at: null,
      };
      prismaForTests.comic_books = {
        delete: jest.fn().mockResolvedValue(comic_book),
      };

      // Act
      const result = await comicBookModel.deleteComicBook(1);

      // Assert
      expect(prisma.comic_books.delete).toHaveBeenCalledTimes(1);
      expect(prisma.comic_books.delete).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            id: 1,
          },
        })
      );
      expect(result).toEqual(comic_book);
    });
  });

  describe("getAllComicBooks", () => {
    it("should get all comic books", async () => {
      // Arrange
      const comic_books = [
        {
          id: 1,
          title: "Avengers",
          issue_number: 1,
          publisher_id: 2,
          published_date: new Date("2018-05-02"),
          created_at: new Date(),
          updated_at: null,
          deleted_at: null,
        },
        {
          id: 2,
          title: "Batman",
          issue_number: 1,
          publisher_id: 1,
          published_date: new Date("2016-06-15"),
          created_at: new Date(),
          updated_at: null,
          deleted_at: null,
        },
      ];
      prismaForTests.comic_books = {
        findMany: jest.fn().mockResolvedValue(comic_books),
      };

      // Act
      const result = await comicBookModel.getAllComicBooks();

      // Assert
      expect(prisma.comic_books.findMany).toHaveBeenCalledTimes(1);
      expect(prisma.comic_books.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: {
            id: "asc",
          },
        })
      );
      expect(result).toEqual(comic_books);
    });
  });

  describe("getComicBookById", () => {
    it("should get a comic book by id", async () => {
      // Arrange
      const comic_book = {
        id: 1,
        title: "Avengers",
        issue_number: 1,
        publisher_id: 2,
        published_date: new Date("2018-05-02"),
        created_at: new Date(),
        updated_at: null,
        deleted_at: null,
      };
      prismaForTests.comic_books = {
        findUnique: jest.fn().mockResolvedValue(comic_book),
      };

      // Act
      const result = await comicBookModel.getComicBookById(1);

      // Assert
      expect(prisma.comic_books.findUnique).toHaveBeenCalledTimes(1);
      expect(prisma.comic_books.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            id: 1,
          },
        })
      );
      expect(result).toEqual(comic_book);
    });
  });

  describe("postComicBook", () => {
    it("should create a comic book", async () => {
      // Arrange
      const comicBook = {
        id: 1,
        title: "Avengers",
        issue_number: 1,
        publisher_id: 2,
        published_date: new Date("2018-05-02"),
        created_at: new Date(),
        updated_at: null,
        deleted_at: null,
      };
      prismaForTests.comic_books = {
        create: jest.fn().mockResolvedValue(comicBook),
      };

      // Act
      const result = await comicBookModel.postComicBook(comicBook);

      // Assert
      expect(prisma.comic_books.create).toHaveBeenCalledTimes(1);
      expect(prisma.comic_books.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: {
            ...comicBook,
            created_at: new Date(),
          },
        })
      );
      expect(result).toEqual(comicBook);
    });
  });

  describe("putComicBook", () => {
    it("should update a comic book", async () => {
      // Arrange
      const comicBook = {
        title: "Avengers",
        issue_number: 1,
        publisher_id: 2,
        published_date: new Date("2018-05-02"),
      };
      prismaForTests.comic_books = {
        update: jest.fn().mockResolvedValue(comicBook),
      };

      // Act
      const result = await comicBookModel.putComicBook(1, comicBook);

      // Assert
      expect(prisma.comic_books.update).toHaveBeenCalledTimes(1);
      expect(prisma.comic_books.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            id: 1,
          },
          data: {
            ...comicBook,
            updated_at: new Date(),
          },
        })
      );
      expect(result).toEqual(comicBook);
    });
  });
});
```

#### Controllers

The tests we just wrote for our models were pretty simple. Since the models are our database layer, we just needed to test whether or not the specific functions that wrote to or got data from the database were working. 

The controllers are a little different and more involved. The controllers are our business layer and are responsible for handling the requests from the routers and sending things to the models and then sending the responses back to the client. It's a big job and we've got to test all the possible scenarios. So it's not just "did the function work?" Instead, it's more of "Did the right function call happen, did we get back the response we expected, and what happens when we don't?"

The first thing we'll need to do here is to set up a mock request and mock response. The business layer is expecting a request to come in and it's expecting a response to come back. We'll need to mock these since we won't actually have them. 

In your `test-utils` folder, create a new file called `mockRequest.ts` and in that file, paste the following code:

```
import { Request, Response } from "express";

interface mockRequestArgs {
  body?: any;
  params?: any;
  query?: any;
  headers?: any;
  token?: string;
  locals?: any;
}

const mockRequest = (args?: mockRequestArgs) => {
  const get = (name: string) => {
    if (name === "authorization") return `Bearer ${args?.token}`;
    return null;
  };

  const user = {
    id: 1,
  };

  return {
    ...args,
    user,
    get,
  } as unknown as Request;
};

const mockResponse = (userId?: number) => {
  const res = {} as Response;
  res.sendStatus = jest.fn().mockReturnValue(res);
  res.status = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.locals = { user_id: userId ?? 1 };
  return res;
};

export { mockRequest, mockResponse };
```

What do we have here? We've set up two new functions.

- `mockRequest` takes in request parameters (things like `body`, `params`, `query`, `headers`, and `token`). It handles a request for authorization, defines a `user` with an `id` of 1 (to simulate someone actually be signed in), and then returns the request.
- Similarly,`mockResponse` takes in a user id and returns a mocked response. You can see that we're mocking a lot of the methods that we would use in our responses in our controllers. Things like `sendStatus`, `status`, `send`, `json`, and `locals`.

Great. Now that we have that working, let's write our first controller test.

In your `/controllers/__tests__` folder, create a new file called `comic_books.test.ts` and paste in the following code:

```
import { comicBookModel } from "../../models";
import { mockRequest, mockResponse } from "../../test-utils/mockRequest";
import { deleteComicBook } from "../comic_books";
import { when } from "jest-when";

jest.mock("../../models/comic_books");

describe("Comic Books Controller", () => {
  describe("deleteComicBook", () => {
    it("should delete a comic book when a valid comic book id is provided", async () => {
      // Arrange
      const req = mockRequest({ params: { id: 1 } });
      const res = mockResponse();

      const mockComicBook = {
        id: 1,
        title: "Avengers",
        issue_number: 1,
        publisher_id: 2,
        published_date: new Date("2018-05-02"),
        created_at: new Date(),
        updated_at: null,
        deleted_at: null,
      };

      when(comicBookModel.getComicBookById).calledWith(1).mockResolvedValue(mockComicBook);
      when(comicBookModel.deleteComicBook).calledWith(1).mockResolvedValue(mockComicBook);

      // Act
      await deleteComicBook(req, res);

      // Assert
      expect(comicBookModel.deleteComicBook).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.json).toHaveBeenCalledWith({
        message: "Deleted comic book",
        comicBook: {
          id: mockComicBook.id,
          title: mockComicBook.title,
          issue_number: mockComicBook.issue_number,
          publisher_id: mockComicBook.publisher_id,
          published_date: mockComicBook.published_date,
          created_at: mockComicBook.created_at,
        },
      });
    });
  });
});
```

Let's take a look at that first test and break it down by section.

- "Arrange": We use the `mockRequest` and `mockResponse` functions we wrote and we set up a mock comic book. Then we use the `when` function to set up a couple of mocked responses. What we're saying here is that when the `getComicBookById` or the `deleteComicBook` functions are called with the id of 1, we want to return the mock comic book.
- "Act": We call the `deleteComicBook` function with the mock request and mock response.
- "Assert": We check that the `deleteComicBook` function was called with the id of 1. Then we check that the mock response has the correct status code and message.

Looking at the delete comic book controller, what else sticks out to you as testable? A few things I see are that we return a message if the comic book doesn't exist, and we return a 500 error with a specific error message if something goes wrong. So let's write those tests. When we're done, the file should look like this:

```
import { comicBookModel } from "../../models";
import { mockRequest, mockResponse } from "../../test-utils/mockRequest";
import { deleteComicBook } from "../comic_books";
import { when } from "jest-when";

jest.mock("../../models/comic_books");

describe("Comic Books Controller", () => {
  describe("deleteComicBook", () => {
    it("should delete a comic book when a valid comic book id is provided", async () => {
      // Arrange
      const req = mockRequest({ params: { id: 1 } });
      const res = mockResponse();

      const mockComicBook = {
        id: 1,
        title: "Avengers",
        issue_number: 1,
        publisher_id: 2,
        published_date: new Date("2018-05-02"),
        created_at: new Date(),
        updated_at: null,
        deleted_at: null,
      };

      when(comicBookModel.getComicBookById).calledWith(1).mockResolvedValue(mockComicBook);
      when(comicBookModel.deleteComicBook).calledWith(1).mockResolvedValue(mockComicBook);

      // Act
      await deleteComicBook(req, res);

      // Assert
      expect(comicBookModel.deleteComicBook).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.json).toHaveBeenCalledWith({
        message: "Deleted comic book",
        comicBook: {
          id: mockComicBook.id,
          title: mockComicBook.title,
          issue_number: mockComicBook.issue_number,
          publisher_id: mockComicBook.publisher_id,
          published_date: mockComicBook.published_date,
          created_at: mockComicBook.created_at,
        },
      });
    });

    it("should return a message if the comic book does not exist", async () => {
      // Arrange
      const req = mockRequest({ params: { id: 1 } });
      const res = mockResponse();

      when(comicBookModel.getComicBookById).calledWith(1).mockResolvedValue(null);

      // Act
      await deleteComicBook(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith("No comic book with that id exists");
    });

    it("should return a 500 error with a specific error message if something goes wrong", async () => {
      // Arrange
      const req = mockRequest({ params: { id: 1 } });
      const res = mockResponse();

      const errorMessage = "You found an error! Congratulations!";
      when(comicBookModel.getComicBookById)
        .calledWith(1)
        .mockResolvedValue(Promise.reject(new Error(errorMessage)));

      // Act
      await deleteComicBook(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal Server Error",
        error: errorMessage,
      });
    });

    it("should return a 500 error with a generic error message if something that isn't an error goes wrong", async () => {
      // Arrange
      const req = mockRequest({ params: { id: 1 } });
      const res = mockResponse();

      when(comicBookModel.getComicBookById)
        .calledWith(1)
        .mockResolvedValue(Promise.reject("Unexpected Error"));

      // Act
      await deleteComicBook(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal Server Error",
        error: "An unknown error occurred.",
      });
    });
  });
});
```

For those last two tests to work the way they are written, we need to make a small change to the `deleteComicBook` function in the `comic_books` controller. We will need to change the `catch` section at the end to look like this:

```
    if (error instanceof Error) {
      res.status(500).json({
        message: "Internal Server Error",
        error: error.message,
      });
    } else {
      res.status(500).json({
        message: "Internal Server Error",
        error: "An unknown error occurred.",
      });
    }
```

This just says that if we get a specific error, something that was more than likely thrown with a `new Error()` function, we return a 500 error with the error message. If we don't get a specific error, we return a 500 error with a generic error message.

Keep in mind that these are just the tests for the `deleteComicBook` function. We'll need to write the rest of the tests for all of the functions in this particular controller and then for all of the other controllers.

#### Github Actions Chapter 1: The Unit

Set up Github actions for server unit tests.

#### Routers

What is the difference between unit and integration tests? Unit tests are focused on individual pieces, or functions, of the application. They test code in isolation. Integration tests, on the other hand, are focused on the whole application and test how multiple components work together.

To test our routers, we're going to need to use integration tests because we want to test what happens when a request is made to a route.

Just like with the unit tests, we'll need to do a little set up here before we can get to writing our tests.

First things first, we'll need to install a few packages.

- `supertest` (https://github.com/ladjs/supertest): `supertest` is a library for making HTTP requests in NodeJS. This will allow us to make requests without having to actually start a server. We can install it using `npm i --save-dev supertest`.
- `testcontainers` (https://github.com/testcontainers/testcontainers-node | https://node.testcontainers.org/quickstart/): `testcontainers` is a library for creating and running containers in NodeJS. This will allow us to spin up a real database in a container that we can use for our tests. The tests won't interfere with our actual database and each test run starts with a clean databaseWe can install it using `npm i --save-dev testcontainers`.
- We'll also need to install the types for `supertest`. We can do that with the following command: `npm i --save-dev @types/supertest`.

Next, because we're going to be spinning up a docker container for our testing database, we'll need to do a couple of extra things to configure Jest to handle that. To that end, we'll create a separate configuration file for our integration tests. In the root of the `/server` folder, let's create a `jest.integration.config.ts` file and paste in the following code:

```
const config = {
  globalSetup: "./test-setup/global-setup.js",
  globalTeardown: "./test-setup/global-teardown.js",
  clearMocks: true,
  testTimeout: 1500,
  testEnvironment: "node",
  preset: "ts-jest",
};

export default config;
```

The big thing to take away from this file is that we are going to be defining a global setup file that will run before the tests start, and a global teardown file that will run after the tests finish. In the setup file we'll set up the Docker container to run our tests in. In the teardown file we'll stop the Docker container. Let's go ahead and create those files now.

Create a `test-setup` folder in the root of the `/server` folder.

Inside of that `test-setup` folder, let's create a `global-setup.js` file and paste in the following code:

```
//global-setup.js

const path = require("path");
const { DockerComposeEnvironment, Wait } = require("testcontainers");

// https://node.testcontainers.org/features/compose/
module.exports = async () => {
  const composeFilePath = path.resolve(__dirname, "../../");
  const composeFile = "docker-compose.yml";

  global.__ENVIRONMENT__ = await new DockerComposeEnvironment(
    composeFilePath,
    composeFile
  )
    .withWaitStrategy("flyway-1", Wait.forLogMessage(/^Successfully applied/))
    .up();

  await new Promise((x) => setTimeout(x, 500));
};
```

In this file, we're first defining where it can find our `docker-compose.yml` file. Then we're creating a global variable called `__ENVIRONMENT__` that will be used later to stop our Docker container. It is going to spin up the container, waiting for Flyway to finish running the migrations before it does so. 

Inside of the `test-setup` folder, let's create a `global-teardown.js` file and paste in the following code:

```
module.exports = async () => {
  await global.__ENVIRONMENT__?.down();
};
```

All this file is doing is stopping the Docker container that we started in the `global-setup.js` file. Once all the tests finish, this file will run and stop the container.

In the `package.json` file, we need to add a script for running the integration tests. Add the following line to the `scripts` section:

```
"test:integration": "jest --config ./jest.integration.config.ts --testPathPattern ./routers/ --forceExit",
```

This will run the integration tests in the `/routers` folder using the new configuration file we just created.

One last thing, if we haven't already done this, in your `auth.ts` middleware, add (or uncomment) the following code:

```
if (process.env.NODE_ENV === "test") {
    res.locals.user_id = 1;
    return next();
}
```

Great. Now let's write some tests!

In the `/routers/__tests__` folder, let's create a `comic_books.test.ts` file and paste in the following code:

```
import app from "../../app";
import request from "supertest";

describe("/comic_books", () => {
  describe("DELETE /comic_books/1", () => {
    it("should respond with a 204", async () => {
      await request(app)
        .delete("/comic_books/1")
        .set("Accept", "application/json")
        .expect(204);
    });
  });

  describe("GET /comic_books", () => {
    it("should respond with a 200", async () => {
      await request(app)
        .get("/comic_books")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200);
    });
  });

  describe("GET /comic_books/1", () => {
    it("should respond with a 404", async () => {
      await request(app)
        .get("/comic_books/1")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(404);
    });
  });

  describe("GET /comic_books/2", () => {
    it("should respond with a 200", async () => {
      await request(app)
        .get("/comic_books/2")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200);
    });
  });

  describe("POST /comic_books", () => {
    it("should respond with a 201", async () => {
      await request(app)
        .post("/comic_books")
        .send({
          title: "Avengers Comic Book Title",
          issue_number: 1,
          publisher_id: 2,
          published_date: new Date("2018-05-02"),
        })
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(201);
    });
  });

  describe("PUT /comic_books/2", () => {
    it("should respond with a 200", async () => {
      await request(app)
        .put("/comic_books/2")
        .send({
          title: "Dark Knight Gotham Batman Detective",
        })
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200);
    });
  });
});
```

Here we are using the `request` function from `supertest` to make requests to our server. Then we tell it what kind of request we're making, add in any data we might need to send, set any headers we need, and then tell it what we expect to get back.

**Please Note:** These tests are cumulative. If you delete something from the database in one test, and then try to pull that same thing in another test, it will fail.

**Please Note 2:** As much as possible make sure you're testing the response codes here. We always want to make sure that we're getting back the right response codes.

#### Github Actions Chapter 2: The Integration

Set up Github actions for server integration tests.

**\*\*\*** Need to go back and add a lesson for adding Github actions for verifying our database and schema. **\*\*\***

## Homework

- Continue to work on anything that we've already covered if needed.
- Finish writing the tests for all of the models, routers, and controllers.
