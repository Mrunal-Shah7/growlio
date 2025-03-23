import mongoose, { Schema, Document } from 'mongoose';

// Define the User interface for TypeScript
interface IUser extends Document {
  userId: string;
  email: string;
  password: string;
  username: string;
  financialGoals: {
    shortTerm: string;
    longTerm: string;
  };
  riskAppetite: 'low' | 'medium' | 'high';
  preferences: {
    currency: string;
    notifications: boolean;
    preferredSectors: string[];
  };
  portfolio: {
    stockSymbol: string;
    quantity: number;
    purchasePrice: number;
    purchaseDate: Date;
  }[];
  taxProfile: {
    country: string;
    taxBracket: string;
    complianceStatus: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Function to generate a custom user-friendly ID
const generateUserId = (): string => {
  const prefix = 'USR';
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `${prefix}${randomNum}`;
};

const UserSchema: Schema = new Schema({
  userId: {
    type: String,
    unique: true,
    default: generateUserId,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    trim: true,
  },
  financialGoals: {
    type: {
      shortTerm: { type: String, default: '' },
      longTerm: { type: String, default: '' },
    },
    default: {},
  },
  riskAppetite: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
  portfolio: [{
    stockSymbol: { type: String, required: true },
    quantity: { type: Number, required: true },
    purchasePrice: { type: Number, required: true },
    purchaseDate: { type: Date, default: Date.now },
  }],
  taxProfile: {
    country: { type: String, default: 'india' },
    taxBracket: { type: String, default: '' },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Pre-save hook with typed 'next' parameter
UserSchema.pre('save', function(next: (err?: Error) => void) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model<IUser>('User', UserSchema);