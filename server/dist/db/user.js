"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
// Function to generate a custom user-friendly ID
const generateUserId = () => {
    const prefix = 'USR';
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    return `${prefix}${randomNum}`;
};
const UserSchema = new mongoose_1.Schema({
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
UserSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});
exports.default = mongoose_1.default.model('User', UserSchema);
