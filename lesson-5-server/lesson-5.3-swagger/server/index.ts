import app from "./app";
import "dotenv/config";

const PORT = process.env.PORT || "3001";

app.listen(PORT, () => {
  console.log(`Comic Book app listening on port ${PORT}`);
});
