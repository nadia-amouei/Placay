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
exports.checkLikeTour = exports.getUsersLikedTour = exports.uploadProfileImage = exports.updateProfile = exports.getProfile = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const userModel_1 = require("../models/userModel");
const getProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user._id;
        const user = yield userModel_1.User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        res.status(200).json({
            name: user.name,
            email: user.email,
            profileImage: user.profileImage || "",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error." });
    }
});
exports.getProfile = getProfile;
const UPLOAD_DIR = path_1.default.join(process.cwd(), process.env.UPLOAD_DIR || 'uploads');
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user._id;
        const { name, email, password, profileImage } = req.body;
        const user = yield userModel_1.User.findById(userId);
        if (!user) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        if (name)
            user.name = name;
        if (email)
            user.email = email;
        if (password && password.trim() !== "") {
            if (password.length < 6) {
                return res.status(400).json({ error: "Password must be at least 6 characters long" });
            }
            user.password = password;
        }
        if (req.files && req.files.profileImage) {
            const imageFile = req.files.profileImage;
            if (!fs_1.default.existsSync(UPLOAD_DIR)) {
                fs_1.default.mkdirSync(UPLOAD_DIR, { recursive: true });
            }
            const fileName = `${Date.now()}_${imageFile.name}`;
            const filePath = path_1.default.join(UPLOAD_DIR, fileName);
            yield new Promise((resolve, reject) => {
                imageFile.mv(filePath, (err) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve();
                });
            });
            if (user.profileImage && user.profileImage.startsWith("/uploads/")) {
                const oldImagePath = path_1.default.join(process.cwd(), user.profileImage);
                fs_1.default.unlink(oldImagePath, (err) => {
                    if (err) {
                        console.error("Error deleting old image:", err);
                    }
                });
            }
            user.profileImage = `/uploads/${fileName}`;
        }
        else if (profileImage) {
            if (user.profileImage && user.profileImage.startsWith("/uploads/")) {
                const oldImagePath = path_1.default.join(process.cwd(), user.profileImage);
                fs_1.default.unlink(oldImagePath, (err) => {
                    if (err) {
                        console.error("Error deleting old image:", err);
                    }
                });
            }
            user.profileImage = profileImage;
        }
        yield user.save();
        res.status(200).json({ message: "Profile updated successfully", user });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error." });
    }
});
exports.updateProfile = updateProfile;
const uploadProfileImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user._id;
        const user = yield userModel_1.User.findById(userId);
        if (!user) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        if (!req.files || !req.files.profileImage) {
            return res.status(400).json({ error: "No file uploaded" });
        }
        const imageFile = req.files.profileImage;
        if (!fs_1.default.existsSync(UPLOAD_DIR)) {
            fs_1.default.mkdirSync(UPLOAD_DIR, { recursive: true });
        }
        const fileName = `${Date.now()}_${imageFile.name}`;
        const filePath = path_1.default.join(UPLOAD_DIR, fileName);
        imageFile.mv(filePath, (err) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                console.error("File upload error:", err);
                return res.status(500).json({ message: "File upload failed" });
            }
            if (user.profileImage && user.profileImage.startsWith("/uploads/")) {
                const oldImagePath = path_1.default.join(process.cwd(), user.profileImage);
                fs_1.default.unlink(oldImagePath, (err) => {
                    if (err) {
                        console.error("Error deleting old image:", err);
                    }
                });
            }
            user.profileImage = `/uploads/${fileName}`;
            yield user.save();
            res.status(200).json({ message: "Profile image updated", profileImage: user.profileImage });
        }));
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error. So sorry" });
    }
});
exports.uploadProfileImage = uploadProfileImage;
const getUsersLikedTour = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const user = yield userModel_1.User.findById(userId).populate("likedTours");
        ;
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        if (!user.likedTours) {
            user.likedTours = [];
        }
        res.json({ message: "liked tour is send", tours: user.likedTours });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error." });
    }
});
exports.getUsersLikedTour = getUsersLikedTour;
const checkLikeTour = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, tourId } = req.params;
        const user = yield userModel_1.User.findById(userId);
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        if (!user.likedTours) {
            user.likedTours = [];
        }
        const exists = user.likedTours.some((tour) => tour.toString() === tourId);
        res.json({ message: "Liked tour status of user sent", response: exists });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error." });
    }
});
exports.checkLikeTour = checkLikeTour;
