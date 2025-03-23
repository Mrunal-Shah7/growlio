"use strict";
// interface TradeResult {
//     returns: number[];
//     riskFreeRate: number;
//   }
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
//   function calculateSharpeRatio({ returns, riskFreeRate }: TradeResult): number {
//     const meanReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
//     const stdDev = Math.sqrt(
//       returns.reduce((a, b) => a + Math.pow(b - meanReturn, 2), 0) / returns.length
//     );
//     return (meanReturn - riskFreeRate) / stdDev;
//   }
//   export { calculateSharpeRatio };
const connectDB = (uri) => {
    mongoose_1.default.connect(uri, {
        dbName: "growlio"
    }).then(c => console.log("Db Connected"))
        .catch((e) => console.log(e));
};
exports.connectDB = connectDB;
