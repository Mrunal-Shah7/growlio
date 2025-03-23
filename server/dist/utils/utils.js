"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class errorHandler extends Error {
    constructor(message, statusCode) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
    }
}
exports.default = errorHandler;
