"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = require("../controller/user");
const router = express_1.default.Router();
router.post("/register-user", user_1.registerUser);
router.post("/sign-in", user_1.signIn);
// router.put("/update-portfolio",isAuthenticated,portfolioStocks)
exports.default = router;
