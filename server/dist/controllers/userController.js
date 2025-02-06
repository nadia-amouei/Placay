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
exports.logout = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userModel_1 = require("../models/userModel");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, profileImage } = req.body;
        const userCount = yield userModel_1.User.countDocuments();
        const role = userCount === 0 ? "admin" : "user";
        const fullProfileImagePath = "/asserts/images/profilePictures/" + profileImage;
        const userExists = yield userModel_1.User.findOne({ email });
        if (userExists)
            return res.status(400).json({ error: "User already exists" });
        if (password.length < 6)
            return res.status(400).json({ error: "password is too short" });
        const newUser = new userModel_1.User({ name, email, password, role, profileImage: fullProfileImagePath });
        yield newUser.save();
        const token = newUser.generateAuthToken();
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            maxAge: 3600000,
        });
        res
            .status(201)
            .json({ message: "Registration successful!", user: newUser });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield userModel_1.User.findOne({ email });
        if (!user)
            return res.status(400).json({ error: "Invalid credentials" });
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({ error: "Invalid credentials" });
        const token = user.generateAuthToken();
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            maxAge: 3600000,
        });
        res.status(200).json({ message: "Login successful!", user });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.login = login;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.clearCookie("token", { httpOnly: true, secure: false });
        res.status(200).json({ message: "Logged out successfully" });
    }
    catch (error) {
        res.status(500).json({ error: "Error logging out" });
    }
});
exports.logout = logout;
