import dotenv from "dotenv";
import connectDB from "./src/db/index.js";
import { app } from "./src/app.js";
import cors from "cors";

dotenv.config({
  path: "./.env"
});
console.log("FRONTEND URL IS ", process.env.FRONTEND_URL);

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
  });
