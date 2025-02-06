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
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("../config/db");
const userModel_1 = require("../models/userModel");
dotenv_1.default.config({ path: process.env.NODE_ENV === 'develop' ? '.env.development.local' : '.env.production.local' });
const createAdminUser = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, db_1.connectDB)();
        const existingAdmin = yield userModel_1.User.findOne({ role: "admin" });
        if (existingAdmin) {
            console.log("An admin user already exists, no need to create one. E-Mail of admin:", existingAdmin.email);
            process.exit();
        }
        const adminUser = new userModel_1.User({
            name: "Admin",
            email: "admin@example.com",
            password: "admin1",
            role: "admin",
            profileImage: "/asserts/images/profilePictures/default-profile-picture.png",
        });
        yield adminUser.save();
        console.log("Admin user created:", adminUser);
        console.log("NODE_ENV:", process.env.NODE_ENV);
        console.log("DB_NAME:", process.env.DB_NAME);
    }
    catch (error) {
        console.error("Error creating admin user:", error.message);
    }
    finally {
        process.exit();
    }
});
createAdminUser().catch((err) => console.error(err));
