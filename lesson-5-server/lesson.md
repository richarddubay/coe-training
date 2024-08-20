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
- Next, we'll install TypeScript and we'll make it a dev dependency: `npm i --save-dev typescript`.

- Step 2: Get the `app.ts` file created and working.
- Step 3: Split `app.ts` up into `app.ts` and `index.ts`.
- Step 4: Add the first actual route.

## Homework

- Create a GET, POST, PUT, and DELETE for as many of your routes as you can. Test them and make sure they are all working as you'd expect.
