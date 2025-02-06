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
exports.deleteUser = exports.updateUser = exports.addUser = exports.getUsers = void 0;
const userModel_1 = require("../models/userModel");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield userModel_1.User.find();
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch users", error: error.message });
    }
});
exports.getUsers = getUsers;
const addUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const userExists = yield userModel_1.User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }
        let profileImagePath;
        if (req.files && req.files.profileImage) {
            const imageFile = req.files.profileImage;
            const UPLOAD_DIR = path_1.default.join(process.cwd(), 'uploads');
            if (!fs_1.default.existsSync(UPLOAD_DIR)) {
                fs_1.default.mkdirSync(UPLOAD_DIR, { recursive: true });
            }
            const fileName = `${Date.now()}_${imageFile.name}`;
            const filePath = path_1.default.join(UPLOAD_DIR, fileName);
            imageFile.mv(filePath, (err) => {
                if (err) {
                    console.error("File upload error:", err);
                    return res.status(500).json({ message: "File upload failed" });
                }
            });
            profileImagePath = `/uploads/${fileName}`;
        }
        else if (req.body.profileImage) {
            profileImagePath = req.body.profileImage;
        }
        const newUser = new userModel_1.User({ name, email, password, role, profileImage: profileImagePath });
        yield newUser.save();
        res.status(201).json({ message: "User created successfully", user: newUser });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to add user", error: error.message });
    }
});
exports.addUser = addUser;
const UPLOAD_DIR = path_1.default.join(process.cwd(), process.env.UPLOAD_DIR || 'uploads');
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, email, role, profileImage } = req.body;
        let profileImagePath = profileImage || undefined;
        const userBeforeUpdate = yield userModel_1.User.findById(id);
        if (req.files && req.files.profileImage) {
            const imageFile = req.files.profileImage;
            if (!fs_1.default.existsSync(UPLOAD_DIR)) {
                fs_1.default.mkdirSync(UPLOAD_DIR, { recursive: true });
            }
            const fileName = `${Date.now()}_${imageFile.name}`;
            const filePath = path_1.default.join(UPLOAD_DIR, fileName);
            imageFile.mv(filePath, (err) => {
                if (err) {
                    console.error("File upload error:", err);
                    return res.status(500).json({ message: "File upload failed" });
                }
            });
            profileImagePath = `/uploads/${fileName}`;
            if (userBeforeUpdate &&
                userBeforeUpdate.profileImage &&
                userBeforeUpdate.profileImage.startsWith("/uploads/")) {
                const oldImagePath = path_1.default.join(process.cwd(), userBeforeUpdate.profileImage);
                fs_1.default.unlink(oldImagePath, (err) => {
                    if (err) {
                        console.error("Error deleting old image:", err);
                    }
                });
            }
        }
        else if (profileImagePath) {
            if (!profileImagePath.startsWith("/uploads/") &&
                userBeforeUpdate &&
                userBeforeUpdate.profileImage &&
                userBeforeUpdate.profileImage.startsWith("/uploads/")) {
                const oldImagePath = path_1.default.join(process.cwd(), userBeforeUpdate.profileImage);
                fs_1.default.unlink(oldImagePath, (err) => {
                    if (err) {
                        console.error("Error deleting old image:", err);
                    }
                });
            }
        }
        const updateData = Object.assign(Object.assign(Object.assign({}, (name && { name })), (email && { email })), (role && { role }));
        if (profileImagePath !== undefined) {
            updateData.profileImage = profileImagePath;
        }
        const user = yield userModel_1.User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User successfully updated", user });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to update user", error: error.message });
    }
});
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield userModel_1.User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User successfully deleted", user });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to delete user", error: error.message });
    }
});
exports.deleteUser = deleteUser;
