import express from "express";

import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

const router = express.Router();

import {
  checkIfLiked,
  countLikes,
  createPost,
  getAllPosts,
  likePost,
  unlikePost,
} from "../controllers/postsController.js";

router.post("/post", upload.single("image"), createPost);
router.get("/posts", getAllPosts);

router.post("/like", likePost);
router.delete("/unlike/:userId/:postId", unlikePost);

router.get("/count/:postId", countLikes);
router.get("/check/:userId/:postId", checkIfLiked);

// router.get("/users", getUsers);

export default router;
