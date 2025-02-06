"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const authController_1 = require("../controllers/authController");
const asyncHandler_1 = require("../middleware/asyncHandler");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.post("/register", (0, asyncHandler_1.asyncHandler)(userController_1.register));
router.post("/login", (0, asyncHandler_1.asyncHandler)(userController_1.login));
router.post("/logout", authMiddleware_1.authMiddleware, (0, asyncHandler_1.asyncHandler)(userController_1.logout));
router.get("/check-auth", authMiddleware_1.authMiddleware, (0, asyncHandler_1.asyncHandler)(authController_1.checkAuth));
exports.default = router;
