"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateSharpeRatio = calculateSharpeRatio;
function calculateSharpeRatio({ returns, riskFreeRate }) {
    const meanReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
    const stdDev = Math.sqrt(returns.reduce((a, b) => a + Math.pow(b - meanReturn, 2), 0) / returns.length);
    return (meanReturn - riskFreeRate) / stdDev;
}
