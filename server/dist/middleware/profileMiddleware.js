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
exports.profileMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = require("../models/userModel");
const profileMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const cookieHeader = req.headers.cookie;
    if (!cookieHeader) {
        res.status(401).json({ error: "Unauthorized. No cookies provided." });
        return;
    }
    const cookies = cookieHeader.split(";").reduce((acc, cookie) => {
        const [key, ...value] = cookie.split("=");
        acc[key.trim()] = decodeURIComponent(value.join("="));
        return acc;
    }, {});
    const token = cookies === null || cookies === void 0 ? void 0 : cookies[process.env.COOKIE_NAME || "token"];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "");
        const user = yield userModel_1.User.findById(decoded.id);
        if (!user) {
            res.status(401).json({ error: "Unauthorized. User not found." });
            return;
        }
        req.body = user;
        next();
    }
    catch (err) {
        console.error("Error verifying token:", err);
        res.status(401).json({ error: "Invalid token." });
    }
});
exports.profileMiddleware = profileMiddleware;
