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
import express, { Request, Response } from "express";
import cors from "cors";
import { comicBookRouter } from "./routers";

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.use("/comic_books", comicBookRouter);

export default app;
