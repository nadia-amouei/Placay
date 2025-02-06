"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Details = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const detailsSchema = new mongoose_1.default.Schema({
    point_id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String },
    phone: { type: String },
    images: { type: mongoose_1.default.Schema.Types.Mixed },
});
exports.Details = mongoose_1.default.model('Details', detailsSchema);
