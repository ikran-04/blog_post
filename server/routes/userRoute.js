import express from "express";
const router = express.Router();
import auth from "../middleware/auth.js";

import {
  signup,
  login,
  getUsers,
  getUser,
} from "../controllers/userController.js";

router.post("/signup", signup);
router.post("/login", login);
router.get("/users", getUsers);
router.get("/auth/user", auth, getUser);

export default router;
