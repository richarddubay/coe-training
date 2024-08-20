# Server

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
- Lastly, for now, let's install `nodemon`.
- Nodemon is hot module reloading before hot module reloading was cool in all the frameworks.
- I would tell you just to install this globally, but there will be a point later in our project where it will need to be installed to your project as well. The benefit to installing it globally is that you will be able to run it as a command from the command line. If you just install it locally to your project then you will have to set up a script in your `package.json` to run it for you. Which, we're totally going to do so it's up to you if you want to install it globally or not. I like having the option, so I think I have it installed globally but ... you do you.

### Hello World

Now that we have all the things installed (I think), let's get started creating our Hello World endpoint.

- Step 2: Get the `app.ts` file created and working.
- Step 3: Split `app.ts` up into `app.ts` and `index.ts`.
- Step 4: Add the first actual route.

## Homework

- Create a GET, POST, PUT, and DELETE for as many of your routes as you can. Test them and make sure they are all working as you'd expect.
