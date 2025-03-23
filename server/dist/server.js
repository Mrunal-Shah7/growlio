"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT_SECRET = void 0;
const express_1 = __importDefault(require("express"));
;
const user_1 = __importDefault(require("./routes/user"));
const features_1 = require("./utils/features");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const MONGO_URI = process.env.MONGO_URI || " ";
exports.JWT_SECRET = process.env.JWT_SECRET || " ";
console.log(MONGO_URI);
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, morgan_1.default)('dev'));
(0, features_1.connectDB)(MONGO_URI);
app.use((0, cookie_parser_1.default)());
app.use(user_1.default);
const PORT = 3;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
