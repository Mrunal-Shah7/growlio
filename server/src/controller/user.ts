import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UserModel from '../db/user'; // Adjust path to your model file
import { updateStocks, UserRequest, userSignInRequest } from '../types/type'; // Adjust path to your type file
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { JWT_SECRET } from '../server';

export const validatePassword = (password: string) => {
  const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[^\w\s]).{8,}$/;
  return regex.test(password);
};

// Register User Controller
const registerUser = async (req: Request<{}, {}, UserRequest>, res: Response) => {
  const { email, password, username, financialGoals, riskAppetite, portfolio, taxProfile } = req.body;

  try {
    if (!email || !password || !username || !financialGoals || !riskAppetite || !portfolio || !taxProfile) {
      throw new Error('Not Sufficient Data');
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      throw new Error('User Already Exists');
    }

    if (!validatePassword(password)) {
      throw new Error('Password Must Contain 1 caps, 1 small and 1 character');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new UserModel({
      email,
      password: hashedPassword,
      username,
      financialGoals: financialGoals || { shortTerm: '', longTerm: '' },
      riskAppetite: riskAppetite || 'medium',
      portfolio: portfolio || [],
      taxProfile: taxProfile || { country: 'india', taxBracket: '' },
    });

    // Generate JWT token with email
    const token = jwt.sign(
      { email: newUser.email },
      JWT_SECRET, // Use env variable in production
      { expiresIn: '1h' }
    );

    // Set JWT token in an HTTP-only cookie
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    await newUser.save();

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
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Server error during registration',
    });
  }
};

// Sign In Controller
const signIn = async (req: Request<{}, {}, userSignInRequest>, res: Response) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      throw new Error('Insufficient Data');
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET, // Use env variable in production
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
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Server error during sign-in',
    });
  }
};



const portfolioStocks = async(req: Request<{}, {}, updateStocks>,res:Response) => {
    const {portfolio} = req.body
    if(!portfolio || portfolio.length == 0){
        throw new Error('No Data To Update')
    }
}

export { registerUser, signIn,portfolioStocks };