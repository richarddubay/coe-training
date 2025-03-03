# Introduction

This is first day of school kind of stuff.

## Expectations

Let’s set some expectations up front:

- No use of in-IDE AI assistants. You know that old saying about how when you write something down you remember it better? That’s what we want for y’all. We want you to type it out so that you will better remember it, have a little bit of muscle memory, and so that you will learn how a certain thing works and understand why it works the way it does. It’s forced regression. Like when you have to throttle your browser to see what happens to your site when you’re on a 3G network. Obviously feel free to use them when you’re doing your regular work, but please turn them off when you’re working on the class stuff.
- That being said, if you get stuck, and need some help or if you need something explained to you so that you’ll understand it, things like ChatGPT and other AI tools are fine to use. We just don’t want you to have everything done for you, if that makes sense.
- We’ll be using TypeScript throughout this project, and we'll be setting up a repo in your personal Github account.
- Ask questions. Let’s async as many questions as we can in chat to try to save us the time during the times we meet. That said, we can still spend the first part of our meetings answering questions and reviewing what we’ve done so far.
- Speaking of questions, you’re going to ask me questions that I don’t know the answers to. That’s okay. I think pairing and figuring them out together will make us all better.
- Homework: Yes, there will be homework. We'll try to keep it to a minimum, but expect to spend some time on it. Mostly you'll be expected to take the lesson that we learned during class and apply it to your own project.
- I will be asking you to share your screen and talk through what you did or explain a thing.
- Remember, what I’m going to be showing you is _one way_ to build a full-stack application. There are many other ways. But I do believe giving you this foundation will help you understand what’s happening when you do get to use those other frameworks or methods. For example, knowing how to use Express to build out an API, and the way that we use models, views, and controllers, will help you jump into a Rails backend and be able to notice patterns and how things are set up even if you don’t actually understand the code there. Consider this your cheat sheet to every other project ever.

## Microsoft Article

[https://learn.microsoft.com/en-us/azure/architecture/best-practices/api-design](https://learn.microsoft.com/en-us/azure/architecture/best-practices/api-design)

- The first thing we're going to be doing is creating our backend application. We’re going to be creating a REST API.
- The idea of _request_ and _response_ is just like a fast food joint. You go up to the counter (or I guess now we open up our app) and we say we want “I’d like a bacon double cheeseburger with curly fries and a Sprite” (because I don’t drink caffeine), we pay our money (think of that as you being authorized to make that request), and in return the person behind the counter (or the delivery driver if you’re Door Dash-ing it) gives you your order. It’s the same thing in your API. You make a request by hitting a URL with certain information in it. We might attach some other data to it (like some authorization data to prove that we are allowed to make this request), and then the service returns to us the data we requested … usually in JSON format.
- Do not use `create-order` or `update-customer`. All your APIs should reference the entity (or thing) you’re working with. You’ll often see multiples of the same url in an API. For example, you might see `https://url.com/orders` is being used for getting data on all the orders or for creating an order. The difference is in the HTTP verb. Which we’ll get to soon.
- Never go more than 3 levels deep in your URL structure. Like it says in the article, `collection/item/collection` is far enough. If you have to go deeper, you can create another call to get the next `collection/item/collection` or you can also pass data on the query string. The query string method is preferred when it comes to things like search or pagination, that way where you are the data you’re getting can be constant through browser refreshes.
- You don’t necessarily need an API route for each of your tables. For example, if you have a `customers` table, and a `orders` table, but also have a many-to-many type `customerOrders` table, you probably don’t need to expose the `customerOrders` table to the API. Anything needed from that table can be retrieved by either the `customers` or `orders` endpoints.
- GET, POST, PUT, PATCH, DELETE. I won’t say you _won’t_, but you’ll hardly ever use PATCH. Explain the differences between these terms.
- Most of the APIs you run across (and the ones that we’re going to create) will use the `application/json` MIME type.
- Pay attention to the status codes they tell you to return in this article. I had no idea on a lot of the endpoints I’ve written about which status code to return. This handles that for me.
- Versioning: URI versioning means that you end up having more than one copy of each endpoint, whereas with query string versioning, that doesn’t have to happen. But with query string versioning, things could get pretty complicated if each resource has to handle different processing for different versions. Which way you go is up to you. URI versioning just works for me in my brain. I don't generally want to have my code have to handle things differently for different versions.

## Your Course Project

Step one for us is going to be deciding what project we’re going to work on. It literally doesn’t matter to me what you end up doing. When I took the course, I worked on a F1 Fantasy League app. We would love this to be something that would benefit Unosquare and that would potentially be used by everyone but it doesn’t have to be.

## Homework

- Read the articles or watch the videos in the `Basics` and `Server Basics` section of the doc.
- Start thinking about what project you’d like to build. Come back prepared to share your idea.
