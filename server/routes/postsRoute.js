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
  comment,
  countLikes,
  createPost,
  deleteComment,
  getAllPosts,
  likePost,
  unlikePost,
  updateComment,
} from "../controllers/postsController.js";

router.post("/post", upload.single("image"), createPost);
router.get("/posts", getAllPosts);

router.post("/like", likePost);
router.delete("/unlike/:userId/:postId", unlikePost);

router.get("/count/:postId", countLikes);
router.get("/check/:userId/:postId", checkIfLiked);

router.post("/comment", comment);
router.put("/comment/:id", updateComment);
router.delete("/comment/:id", deleteComment);

// router.get("/users", getUsers);

export default router;
