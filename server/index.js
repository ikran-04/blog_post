import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoute.js";
import postsRoute from "./routes/postsRoute.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("uploads"));

app.use("/api", userRoutes);
app.use("/api", postsRoute);
// app.use("/api", fileRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
