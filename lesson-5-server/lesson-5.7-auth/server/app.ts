// Step 1
// import express, { Request, Response } from "express";
// const app = express();
// const port = 3000;

// app.get("/", (req: Request, res: Response) => {
//   res.send("Hello World!");
// });

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`);
// });

// Step 2
// import express, { Request, Response } from "express";
// const app = express();
// app.use(express.json());

// app.use(
//   cors({
//     origin: "*",
//   })
// );
// app.get("/", (req: Request, res: Response) => {
//   res.send("Hello World!");
// });

// export default app;

// Step 3
// import express, { Request, Response } from "express";
// import cors from "cors";
// import { comicBookRouter } from "./routers";

// const app = express();
// app.use(express.json());

// app.use(
//   cors({
//     origin: "*",
//   })
// );

// app.get("/", (req: Request, res: Response) => {
//   res.send("Hello World!");
// });

// app.use("/comic_books", comicBookRouter);

// export default app;

// Step 4 - Lesson 5 Part 3
// import express, { Request, Response } from "express";
// import cors from "cors";
// import { comicBookRouter } from "./routers";
// import swaggerJsDoc from "swagger-jsdoc";
// import swaggerUi from "swagger-ui-express";

// const app = express();
// app.use(express.json());

// app.use(
//   cors({
//     origin: "*",
//   })
// );

// const options = {
//   definition: {
//     openapi: "3.0.0",
//     info: {
//       title: "Comic Book Store",
//       version: "1.0.0",
//       description:
//         "This is the Swagger API documentation for the Comic Book Store.",
//     },
//   },
//   apis: ["./routers/*.ts"], // files containing annotations as above
//   // apis: ['./routers/**.ts', `${__dirname}/routers/*.ts`],
// };

// const swaggerSpec = swaggerJsDoc(options);
// console.log("swaggerSpec = ", swaggerSpec);
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// app.get("/", (req: Request, res: Response) => {
//   res.send("Hello World!");
// });

// app.use("/comic_books", comicBookRouter);

// export default app;

// Step 5 - Lesson 5 Part 4 - Simple Middleware
// import express, { Request, Response } from "express";
// import cors from "cors";
// import { comicBookRouter } from "./routers";
// import swaggerJsDoc from "swagger-jsdoc";
// import swaggerUi from "swagger-ui-express";
// import { testMiddleware } from "./middleware/test";

// const app = express();
// app.use(express.json());

// app.use(
//   cors({
//     origin: "*",
//   })
// );

// const options = {
//   definition: {
//     openapi: "3.0.0",
//     info: {
//       title: "Comic Book Store",
//       version: "1.0.0",
//       description:
//         "This is the Swagger API documentation for the Comic Book Store.",
//     },
//   },
//   apis: ["./routers/*.ts"], // files containing annotations as above
//   // apis: ['./routers/**.ts', `${__dirname}/routers/*.ts`],
// };

// const swaggerSpec = swaggerJsDoc(options);
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// app.get("/", (req: Request, res: Response) => {
//   res.send("Hello World!");
// });

// // app.use(testMiddleware);

// // app.use("/comic_books", comicBookRouter);
// app.use("/comic_books", testMiddleware, comicBookRouter);

// export default app;

// Step 5 - Lesson 5 Part 4 - Auth Middleware
import express, { Request, Response } from "express";
import cors from "cors";
import { comicBookRouter } from "./routers";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { authMiddleware } from "./middleware/auth";

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Comic Book Store",
      version: "1.0.0",
      description:
        "This is the Swagger API documentation for the Comic Book Store.",
    },
  },
  apis: ["./routers/*.ts"], // files containing annotations as above
  // apis: ['./routers/**.ts', `${__dirname}/routers/*.ts`],
};

const swaggerSpec = swaggerJsDoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

// app.use(testMiddleware);
app.use(authMiddleware);

app.use("/comic_books", comicBookRouter);
// app.use("/comic_books", authMiddleware, comicBookRouter);

export default app;
