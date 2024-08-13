# Project Setup

## Review / Questions

Let’s go over the homework from last time:

- Any questions about SQL?

## Create Database Folders

First, we want to create some folders that will hold our database “stuff.” So in the root of your project, run the following:

```
> mkdir database
> mkdir database/local-data-seed
> mkdir database/migrations
```

## Setup Docker

### What is Docker?

- Docker is a platform that allows you to package an application and all its dependencies and run them together in a container.
- A container is a standalone package that includes everything you need to run an application. The code, settings, libraries … the whole thing.
- I’ve heard Eli describe it as getting a new computer from Unosquare. Then you install the things you need on that machine to get your app to run. Then when you need a new container, you just throw that one away and start again.
- With a container, your app will always run the same, regardless of where it is. There’s no chance that you will have different settings than someone else. No more “works on my machine.” Each container has its own filesystem, memory, and CPU limits.
- By using Docker we get apps that run consistently across environments, with the ability to easily move our apps between different systems.
- We’ll talk more about these over time, but there are two types of configuration files that we’ll work with. A `Dockerfile` and a `docker-compose.yml` file.
- The `Dockerfile` is a set of instructions/configuration options that define what our Docker image will look like. It defines the environment in which our app will run. So it can do things like set a base image (a starting point), a working directory, running `npm install` and defining commands to run the app like `npm start`. When you build your Docker image with the `docker build` command, it will use this file as it’s foundation.
- The `docker-compose.yml` file, on the other hand, is used to orchestrate multiple-container Docker applications. We can define multiple individual services (other Docker images) along with things like environment variables or ports or anything else the services need to run. When you then run `docker compose up`, it will start all the services at once (you’ll see them in the `Images` tab in Docker Desktop).
- In our case, we’re going to use a `docker-compose.yml` file to set up our database, and use Flyway to handle the migrations. Each of these will use other already created Docker images

Next, let’s get Docker running.

### Install Docker

If you haven’t yet, go here and install Docker Desktop: [https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/).

### Create Docker Compose File

Here’s a link to the official docs for Docker Compose: [https://docs.docker.com/compose/](https://docs.docker.com/compose/).

Create a `docker-compose.yml` file in the root of your project and paste in the following:

```
services:
  db:
    image: postgres:latest
    restart: always
    ports:
      - 5433:5432
    environment:
      POSTGRES_DB: comic_book_store_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes:
      - db:/var/lib/postgresql/data
volumes:
  db:
```

Let’s go through this line-by-line:

- We’re first letting Docker know that we’re going to define some services.
- The first service we’re defining is a database service we’re calling `db`. You can pretty much name these anything you want but you’re going to use this name in other places so be smart about what you call it.
- It’s going to use the latest version of the official Postgres image from Docker Hub. Which, if you get a chance, take a look through Docker Hub ([https://hub.docker.com/](https://hub.docker.com/)) and see all the different containers you could use.
- The container will automatically restart if it stops or if Docker is relaunched.
- This one is fun / tricky. The first port maps to your local machine and the second port maps to inside your container. So inside your container, PostgreSQL is going to use port 5432 (the default PostgreSQL port). But on your local machine it’s going to use port 5433 to access the database. I had to do this because I have a PostgreSQL instance already running on my machine that is using port 5432. If you don’t have a PostgreSQL instance already running, you may be able to use port 5432 with no problems.
- Next, we’re going to define some environment variables. This says we’re going to create a database named `comic_book_store_db` when the container starts and we’re going to connect to it using the username `postgres` and the password `password`.
- This maps the database volume to this directory inside the container. This is where PostgreSQL will store its data. By mapping it to a volume it allows us to have data persistence in case we ever delete the container.
- These last couple of lines define the named volume `db` that we just used.

Once this is setup, we should run `docker compose up` to see if this works. Some things you should know:

- `docker compose up` will leave you attached in your terminal and will show you logs as you do things. Once you stop this, your container will also stop.
- `docker compose up -d` will run `docker compose` in “detached” mode. This means that once things are up and running, your container will continue to run, but you won’t see any logs in your terminal.
- `docker compose down` will tear down your container. In our case, because we have a persisted named volume, that will stay behind, but our container will be gone.
- `docker compose down --volumes` , on the other hand, will delete your container, and the named volume.
- You will also be able to see the images you used in your services on the `Images` tab of Docker Desktop.

### Beekeeper Studio

At this point, our docker container should be created and it should be running. Now let’s connect to it using Beekeeper Studio ([https://www.beekeeperstudio.io/](https://www.beekeeperstudio.io/)) so we can see what’s there.

- Download Beekeeper Studio.
- Add a new connection of type `Postgres`
- Set the host to `localhost`.
- Set the port to either `5432` or `5433` … whatever you defined in your `docker-compose.yml` file.
- Set the username to `postgres` and your password to `password`.
- Hit the `Test` button to see if the connection works.
- Click `Connect` to connect to your database.
- Once connected, in the upper left hand corner, drop down the `Select a database` down and choose your database. If it’s not showing there, click the refresh icon and try again.

As you can see, there is nothing there yet, but we’re on the way!

### Flyway

The main purpose of Flyway is to run our migrations. Here’s some documentation about the `flyway-docker` service: [https://github.com/flyway/flyway-docker](https://github.com/flyway/flyway-docker). The biggest thing to take away from that is the example at the very bottom.

Let’s add a Flyway service to the `services` section of our `docker-compose.yml` file.

```
    	  flyway:
    	    image: flyway/flyway
    	    command: -url=jdbc:postgresql://db/comic_book_store_db -schemas=public -user=postgres -password=password -connectRetries=5 migrate -validateMigrationNaming=true -X
    	    volumes:
    	      - ./database:/flyway/sql
    	    depends_on:
    	      - db
```

Line-by-line:

- We are defining a “flyway” service.
- We are going to use the `flyway/flyway` image.
- We’re going to run this command in the Flyway container. It basically connects Flyway to our PostgreSQL database in the `db` container and it runs any migration scripts located in the `flyway/sql` directory. We are also defining the schema with a name of “public.” The `-X` isn’t necessary, but it gives us more logging to help in troubleshooting any issues that may arise.
- This line maps what is in our local `/database` directory with the `flyway/sql` directory. It’s super important that your `database` directory is spelled correctly here. This is how Flyway is able to run the migrations in the `flyway/sql` directory.
- This just makes sure that the `db` service is started before starting the `flyway` service.

Flyway is _very_ particular about how the migration files are named. It should always be:

```
V{major-number}.{minor-number}__Name_Of_Migration.sql
```

So, for example:

```
V1.0__Initial_Migration.sql
```

Let’s go ahead and create that migration file in the `database/migrations` directory.

Let’s also add our first table while we’re at it.

Note that migration files are `.sql` files meaning that we’re going to have to write some SQL. So, for my `comic_book` table, we’re going to go real simple in the beginning and just put this:

```
CREATE TABLE IF NOT EXISTS public.comic_books (
  id SERIAL PRIMARY KEY NOT NULL,
  title VARCHAR(255) NOT NULL,
  issue_number INT NOT NULL,
  publisher_id INT NOT NULL,
  published_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS public.publishers (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  deleted_at TIMESTAMP WITH TIME ZONE
);
```

Here I’m creating two tables: `comic_books` and `publishers`. I’m making sure that each table has an auto-generating, auto-incrementing `id` field, and other fields associated with that entity. Adding `created_at`, `updated_at` and `deleted_at` is a good practice in case you ever find the need to filter your data based on any of those criteria.

Also, just a side note here: when we “delete” we should probably never actually delete. We should just set the date (or a flag) and then check that when we’re pulling data. It could get kind of crazy with data relationships if we decide to actually delete something.

Now, let’s run `docker compose up` and see if it runs:

- Run `docker compose down --volumes` so we have a clear playing field.
- Run `docker compose up`, and let’s look at those logs.
- Now let’s connect to the database with Beekeeper Studio again and see what’s there.
- There should now be a `public` schema and inside that, two tables. One, the `comic_book` table we just created and also a `flyway_schema_history` table that holds the history of our schemas.
- Why is this `flyway_schema_history` file important? It keeps track of which of the migrations have run that way it knows when we add another migration later that it doesn’t have to re-run migrations that have already run.
- If you click the drop down arrows next to the tables you can see the columns in each table.
- If you were to create a query like `SELECT * FROM flyway_schema_history`, it will show you everything that’s currently in that table.

Note: In the beginning, you might have to run `docker compose down --volumes` a number of times while you’re getting your database set up. And that’s okay. Once we get our DB to a good place, and in production, we wouldn’t want to do that anymore. That’s where adding more/other migrations will be super important.

### Seed Data

Lastly, we want to create some seed data so that we aren’t working with a blank canvas. To do this:

- Let’s add a new file to our `/database/local-data-seed` folder called `V1.1000__Local_Seed_Data.sql`.
- In there, let’s add a SQL statement that will add a couple of rows of data to one of our tables. Something like:

```
INSERT INTO
public.publishers (name, created_at)
VALUES
('DC', CURRENT_TIMESTAMP),
('Marvel', CURRENT_TIMESTAMP);

INSERT INTO
public.comic_books (title, issue_number, publisher_id, published_date, created_at)
VALUES
('Avengers', 1, 2, '2018-05-02', CURRENT_TIMESTAMP),
('Batman', 1, 1, '2016-06-15', CURRENT_TIMESTAMP),
('DC vs. Vampires', 1, 1, '2021-10-26', CURRENT_TIMESTAMP),
('Fall of the House of X', 1, 2, '2024-01-03', CURRENT_TIMESTAMP),
('Wonder Woman', 1, 1, '2023-09-19', CURRENT_TIMESTAMP);
```

Things to note:

- We don’t have to specify an `id` here. If you remember, we made that an auto-generating, auto-incrementing number. So if we define it here, we’ll just break things later when we’re adding data by API.
- We had to insert the data for the `publishers` table first, because we are using the `id` from that table in the `comic_books` table below it.

## Homework

- Finish up your initial migration, adding all the tables and fields for your project.
- Add seed data for your tables.
- Make sure you can see your tables with their data in Beekeeper Studio.
