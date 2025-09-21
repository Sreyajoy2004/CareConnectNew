import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { register, login,me } from "../controllers/authcontroller.js";


const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware, me);

export default router;
