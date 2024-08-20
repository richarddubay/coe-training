import app from "./app";
import "dotenv/config";

const PORT = process.env.PORT || "3001";

app.listen(PORT, () => {
  console.log(`F1 Fantasy League app listening on port ${PORT}`);
});
