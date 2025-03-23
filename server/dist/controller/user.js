"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.portfolioStocks = exports.signIn = exports.registerUser = exports.validatePassword = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../db/user")); // Adjust path to your model file
const server_1 = require("../server");
const validatePassword = (password) => {
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[^\w\s]).{8,}$/;
    return regex.test(password);
};
exports.validatePassword = validatePassword;
// Register User Controller
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, username, financialGoals, riskAppetite, portfolio, taxProfile } = req.body;
    try {
        if (!email || !password || !username || !financialGoals || !riskAppetite || !portfolio || !taxProfile) {
            throw new Error('Not Sufficient Data');
        }
        const existingUser = yield user_1.default.findOne({ email });
        if (existingUser) {
            throw new Error('User Already Exists');
        }
        if (!(0, exports.validatePassword)(password)) {
            throw new Error('Password Must Contain 1 caps, 1 small and 1 character');
        }
        // Hash the password
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        // Create new user
        const newUser = new user_1.default({
            email,
            password: hashedPassword,
            username,
            financialGoals: financialGoals || { shortTerm: '', longTerm: '' },
            riskAppetite: riskAppetite || 'medium',
            portfolio: portfolio || [],
            taxProfile: taxProfile || { country: 'india', taxBracket: '' },
        });
        // Generate JWT token with email
        const token = jsonwebtoken_1.default.sign({ email: newUser.email }, server_1.JWT_SECRET, // Use env variable in production
        { expiresIn: '1h' });
        // Set JWT token in an HTTP-only cookie
        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 1000, // 1 hour
        });
        yield newUser.save();
        // Send response
        res.status(201).json({
            message: 'User registered successfully',
            user: {
                userId: newUser.userId,
                id: newUser._id,
                email: newUser.email,
                username: newUser.username,
            },
            token, // Optional: Include token in response
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Server error during registration',
        });
    }
});
exports.registerUser = registerUser;
// Sign In Controller
const signIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            throw new Error('Insufficient Data');
        }
        const user = yield user_1.default.findOne({ email });
        if (!user) {
            throw new Error('Invalid credentials');
        }
        // Verify password
        const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ id: user._id, email: user.email }, server_1.JWT_SECRET, // Use env variable in production
        { expiresIn: '1d' } // Token expires in 1 day
        );
        // Set cookie with the token
        res.cookie('auth_token', token, {
            httpOnly: true, // Prevents client-side JS from accessing the cookie
            secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
            maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
            sameSite: 'strict', // Helps prevent CSRF attacks
        });
        // Send success response
        res.status(200).json({
            success: true,
            message: 'Signed in successfully',
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
            },
            token,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Server error during sign-in',
        });
    }
});
exports.signIn = signIn;
const portfolioStocks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { portfolio } = req.body;
    if (!portfolio || portfolio.length == 0) {
        throw new Error('No Data To Update');
    }
});
exports.portfolioStocks = portfolioStocks;
