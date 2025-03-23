import express from "express";
import { registerUser, signIn, portfolioStocks } from "../controller/user";
import isAuthenticated from "../middleware/authMiddleware";
const router = express.Router();
router.post("/register-user",registerUser)
router.post("/sign-in",signIn)
// router.put("/update-portfolio",isAuthenticated,portfolioStocks)

export default router