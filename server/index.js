import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import userRoutes from "./routes/userRoute.js";
import postsRoute from "./routes/postsRoute.js";
import auth from "./middleware/auth.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("uploads"));

app.use("/api", userRoutes);
app.use("/api", postsRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
