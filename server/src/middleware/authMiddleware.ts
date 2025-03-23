import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Define the expected user data from the token
interface UserPayload {
  id: string;
  email: string;
}

// Extend Request type to include user
export interface AuthenticatedRequest extends Request {
  user: UserPayload;
}

// Middleware to check if user is logged inJ
const isAuthenticated = (req: AuthenticatedRequest, res: Response, next: NextFunction)  =>  {
  try {
    // Get the token from the cookie
    const token = req.cookies.auth_token;

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided. Please log in.',
      });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as UserPayload;

    // Attach user info to the request object
    req.user = {
      id: decoded.id,
      email: decoded.email,
    };

    // Proceed to the next middleware or route handler
    next();
  } catch (error: any) {
    // Handle specific JWT errors
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired. Please log in again.',
      });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. Please log in again.',
      });
    }

    // Generic server error
    return res.status(500).json({
      success: false,
      message: 'Server error during authentication',
    });
  }
};

export default isAuthenticated;