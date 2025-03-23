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
exports.getStockPredictions = getStockPredictions;
const axios_1 = __importDefault(require("axios"));
function getStockPredictions(portfolio) {
    return __awaiter(this, void 0, void 0, function* () {
        const payload = {
            inputs: portfolio.map(stock => ({
                symbol: stock.tradingsymbol,
                quantity: stock.quantity,
                avg_price: stock.average_price,
            })),
        };
        // Using a mock response for now; replace with real API
        const response = yield axios_1.default.post('https://api-inference.huggingface.co/models/your-model', // Replace with actual model URL
        payload, { headers: { Authorization: 'Bearer your_hf_token' } });
        return response.data.predicted_stocks || ['RELIANCE', 'TCS', 'INFY']; // Mock data
    });
}
