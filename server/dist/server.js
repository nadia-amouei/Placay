"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
const db_1 = require("./config/db");
dotenv_1.default.config({ path: process.env.NODE_ENV === 'develop' ? '.env.development.local' : '.env.production.local' });
const PORT = process.env.PORT || 3000;
(0, db_1.connectDB)()
    .then(() => {
    app_1.default.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
})
    .catch((error) => {
    console.error("Database connection failed:", error.message);
    process.exit(1);
});
