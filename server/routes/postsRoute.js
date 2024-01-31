import express from "express";
const router = express.Router();
import { createPost, getAllPosts } from "../controllers/postsController.js";

router.post("/post", createPost);
router.get("/posts", getAllPosts);
// router.get("/users", getUsers);

export default router;
