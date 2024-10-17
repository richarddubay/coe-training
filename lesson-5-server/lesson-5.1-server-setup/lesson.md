# Lesson 1 - Server

## Review / Questions

Let’s go over the homework from last time:

- Any questions about Docker, Docker Compose, Flyway, migrations, seed data, or anything else you've been working on?

---

## Setup

Now that we have our docker setup working and we have migrations and seed data, we can start to work on setting up the actual API project.

### Create the Server Directory

- First things first, in the root of the project, let's create a `/server` folder. This is where your API is going to live.
- **RECOMMENDATION**: I recommend during this project that you use `npm` for everything we're going to do. Of course, you can use `yarn` or `pnpm` or whatever you prefer, but you'll end up doing more work. When I took the training, I thought I would be smart and started off using `pnpm` and it was fine. But then when we got to Github actions I realized that every time I wanted to do something I had to install `pnpm` versus Github just knowing about `npm` without me having to do anything. Then there were some other examples that all used `npm` and I found myself getting mixed up about which thing I changed and which thing I didn't. It got to be a mess, so I eventually just switched back to `npm` for everything. All the example code I'm going to send you is going to use `npm` and everything we're going to talk about will use `npm`, so just make your life easy and use `npm` too.
- Now go into your new `/server` folder and run `npm init -y`. This will create your `package.json` for you. The `-y` just chooses the defaults for you. If you want to go through and pick everything yourself you can leave off the `-y` and do so.
- Let's go into the new `package.json` and change the line where it says `"main": "index.js",` to `"main": "index.ts",` because we'll eventually be starting this from a TypeScript file.

### Install TypeScript

- Next, we'll install TypeScript and we'll make it a dev dependency: `npm i --save-dev typescript`.
- **Side Note (From Personal Experience)**: You'll want to make sure that your `node_modules` folder is ignored and not being pushed up to Github.
- Run `npx tsc --init` to initalize TypeScript in our project. This creates a `tsconfig.json` file for us.
- Open up that file and take a look at like the 100 things you could possibly mess around with. It could get pretty complex pretty quickly. We won't really mess with any of these.

### Install Express

- [https://expressjs.com/en/starter/installing.html](https://expressjs.com/en/starter/installing.html)
- Now let's install Express. `npm i express`.

### Install Nodemon

- [https://www.npmjs.com/package/nodemon](https://www.npmjs.com/package/nodemon)
- Let's install `nodemon`.
- Nodemon is hot module reloading before hot module reloading was cool in all the frameworks.
- I would tell you just to install this globally, but there will be a point later in our project where it will need to be installed to your project as well. The benefit to installing it globally is that you will be able to run it as a command from the command line. If you just install it locally to your project then you will have to set up a script in your `package.json` to run it for you. Which, we're totally going to do so it's up to you if you want to install it globally or not. I like having the option, so I think I have it installed globally as well as locally but ... you do you.
- Globally: `npm i -g nodemon`
- Locally: `npm i --save-dev nodemon`

### Install ts-node

- Lastly, for now, let's install `ts-node`.
- Nodemon uses `ts-node` under the hood, so we have to go ahead and install that too.
- `npm i --save-dev ts-node`.

### Hello World

Now that we have all the things installed (I think), let's get started creating our Hello World endpoint.

- In the root of your `/server` folder, create an `app.ts` file.
- In that file, paste in the following:

```
import express from "express";
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
```

- Now, it may yell at you that it doesn't like `express`. That's probably because it needs the types for Express. So just follow the instructions it gives you there. `npm i --save-dev @types/express`.
- Just installing the types might be enough, but for the sake of the lesson, let's go ahead and set the right types for `req` and `res` as well. `req: Request, res: Response`.
- Good. We should be able to test this now.
- In your terminal, make sure you are in your `/server` directory.
- If you installed `nodemon` globally, run `nodemon app.ts`.
- If you only installed it locally:

  - Go to your `package.json`
  - In the `scripts` section, add the following line: `"dev": "nodemon app.ts",`.
  - Now back in your terminal, run `npm run dev`.

- Open up `localhost:3000` in your browser or in Postman and you should see "Hello World!"

### Hello World V2

We're going to make this a little more functional and split this `app.ts` file up into a couple of pieces. One will be this `app.ts` and this is where we are going to define our routes. The other part will be an `index.ts` file. That part will be where we tell the app to start up (like we promised when we changed the `package.json` to use `index.ts` as the main file).

- In the root of the `/server` folder create an `index.ts` file.
- Copy over the `app.listen` section from `app.ts` and remove it from `app.ts`.
- In `app.ts` we'll need to export `app` in order to use it in the `index.ts` file, so at the bottom of the file let's put in: `export default app;`.
- Then let's import that in `index.ts`: `import app from "./app";`
- The only thing missing now is `port`, and this is a great opportunity to introduce environment variables.
- You know that environment variables can be used to store important information such as database credentials or API keys. The environment variable file (`.env`) allows us to store these in one place and use them throughout our application. This is the easiest and best way to keep sensitive information secure.
- In order to use environment variables in our app, we're going to need two things:
  - First, we're going to need a `.env` file. You can create this in the root of your `/server` folder. In that file, just put `PORT=3001`. A few of things here:
    - I changed the port to 3001 to more closely match what you might see when using other frameworks. Like when using Next JS I believe the front end runs on port 3000 and the API routes run on 3001. You can obviously choose whatever open port you want to, but 3001 is pretty safe for this.
    - We typically uppercase our environment variables as a convention. Just something to get used to.
    - Some people like to make a `.env.example` file to go along with their `.env` file. This is a great way to make setting up the app easier for someone else who might work on it in the future. You can do that or not ... totally up to you.
  - Second, in order to actually read the environment variables in our files in a Node environment, we need to use the `dotenv` package ([https://www.npmjs.com/package/dotenv](https://www.npmjs.com/package/dotenv)). So let's install that:
    - `npm i --save-dev dotenv`
    - And let's import it in our `index.ts` file: `import "dotenv/config";`
- Now let's set up and read the `PORT` variable we added to our `.env` file in our `index.ts` file.
- `const PORT = process.env.PORT;`
- We should also just make sure that we have a default in case we happen to delete the value in our `.env` file or it somehow gets messed up. Let's change that line to: `const PORT = process.env.PORT || "3001";`.
- So now your `index.ts` file should look like this:

```
import app from "./app";
import "dotenv/config";

const PORT = process.env.PORT || "3001";

app.listen(PORT, () => {
  console.log(`F1 Fantasy League app listening on port ${PORT}`);
});
```

- Back in the `app.ts` file we can delete the `const port = 3000` line.
- As long as we're in the `app.ts` file I'm going to have you add a couple of lines to set us up for success later:

```
app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);
```

- The `express.json()` line is a middleware (we'll get to middleware in a little bit) so that Express can read JSON data (like stuff you might send in the body of a PORT request when creating a new entity).
- The `cors` line is another middleware to save us the hassle of fighting with CORS later. For our use, we can allow everything from everywhere. If you want to get specific about this, feel free to make this as secure as you'd like. Just remember what you did if you run into issues later on.
- We will also need to install the `cors` package as a dependency: `npm i cors`, and then `import cors from "cors";` in our `app.ts` file.
- It's also going to yell at you to install the types for "cors": `npm i --save-dev @types/cors`.
- We need to make one last change to the `package.json`. Change the `"dev": "nodemon app.ts",` line to `"dev": "nodemon index.ts",`. Look at us fulfilling our promise to this file that we made earlier! 🎉

Okay, we should be ready to test this again.

- Head back out to your terminal, make sure that you're still in your `/server` directory, and run `npm run dev` again.
- The server should start up on port 3001 one this time. Now if you go to `http://localhost:3001` in your browser or in something like Postman, you should get the "Hello World!" message again!

### Models, Views, Controllers ... Oh My!

Beautiful. Now that this is working, let's move on talk about everybody's favorite subject ... project structure!

When it comes to setting up your project for success, it's kind of hard to beat the general MVC structure. In case you're unfamiliar, MVC stands for "Model, View, Controller" and they break down like so:

- Models: This is your database layer. It does the actual "talking to the database."
- Views: These are what the person using your app sees. In our case, these will be our actual API routes.
- Controllers: This is your business logic layer. Where all your "if's" go.
- **Note**: Sometimes people like to combine their controllers and models into one file. And that's typically fine, especially for small applications. We won't do that here, however. By keeping everything separated into their own respective places, it will make each thing easier to test later.

So let's set up our project.

- In the root of your `/server` folder, let's create 3 folders: `controllers`, `models`, and `routers`. `routers` will be our "views."
- Inside the `routers` folder, let's create a new file with the name of one of your entities. In my case, since I'm working on a comic book store, I'm going to create a file named `comic_books.ts`.
- In that file, let's import the Router from Express: `import { Router } from "express";`
- Then we can initialize the Router: `const router = Router();`.
- Let's create our first route:

```
router.route("/").get((req, res) => {
  res.send("You have gotten all the comic books!");
});
```

- And then let's export the `router`: `export default router;`
- So your file should look like:

```
import { Router } from "express";

const router = Router();

router.route("/").get((req, res) => {
  res.send("You have gotten all the comic books!");
});

export default router;
```

- For our `routers` we're going to use barrel files to export everything from one place. So let's create a `index.ts` file in our `/routers` folder and export from the `comic_books` file.
  - `export { default as comicBookRouter } from "./comic_books"`.
- Now back in our `app.ts` file, add the following line: `app.use("/comic_books", comicBookRouter);`.

  - This sets up the `/comic_books` route and we're telling it we want it to look at the `comicBookRouter` for any and all things related to that route.

Now that we've got all that done, let's see if this works.

- In your terminal, make sure you're in your `/server` directory and run `npm run dev`.
- When that starts up, go to `http://localhost:3001/comic_books (or whatever your entity is).
- You should see what you sent!

**Notes**

- While it works in the short term, long term, we wouldn't want to use the browser as the means to do all of our API endpoint checking. You can use `cURL`, but I honestly don't know a lot about that and perhaps you could teach me. There are some clients out there that are very good for this sort of thing. Postman and Insomnia are two really good ones. There is also one called Thunder Client [https://www.thunderclient.com/](https://www.thunderclient.com/) that is a VS Code extension. This one is pretty good and you can use it right inside VS Code ... which is nice.
- There are other ways of sending data in Express besides `res.send`. You can use `res.status` to send a status code, or `res.json` to send some JSON data back. You can also chain them together to do something like:

```
res.status(500).json({
  message: "Internal Server Error",
  error: error,
});
```

So do some research and experiment and see what's out there.

## Homework

- Create a GET, POST, PUT, and DELETE for as many of your routes as you can. Test them and make sure they are all working as you'd expect.
- Feel free to return "Hello World" if you want from all of them, but I think you'd be better served by thinking through what kind of data should be returned from each of them and return some fake data that actually matches what you might get back.
