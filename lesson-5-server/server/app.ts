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
import express, { Request, Response } from "express";
const app = express();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

export default app;
