import app from "./app";
import "dotenv/config";

const PORT = process.env.PORT || "3001";

app.listen(PORT, () => {
  console.log(`Comic book app listening on port ${PORT}`);
});
