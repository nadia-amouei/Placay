"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const authRoute_1 = __importDefault(require("./routes/authRoute"));
const adminRoute_1 = __importDefault(require("./routes/adminRoute"));
const cityRoute_1 = __importDefault(require("./routes/cityRoute"));
const toursRoute_1 = __importDefault(require("./routes/toursRoute"));
const profileRoute_1 = __importDefault(require("./routes/profileRoute"));
const GoogleRoute_1 = __importDefault(require("./routes/GoogleRoute"));
const app = (0, express_1.default)();
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, express_fileupload_1.default)());
const UPLOAD_DIR = process.env.UPLOAD_DIR || "uploads";
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, UPLOAD_DIR)));
app.use("/api", authRoute_1.default);
app.use("/admin", adminRoute_1.default);
app.use("/city", cityRoute_1.default);
app.use("/user", profileRoute_1.default);
app.use("/tour", toursRoute_1.default);
app.use("/google", GoogleRoute_1.default);
exports.default = app;
