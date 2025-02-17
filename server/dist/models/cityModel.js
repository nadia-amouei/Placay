"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.City = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const citySchema = new mongoose_1.default.Schema({
    cityName: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    pointsOfInterest: { type: mongoose_1.default.Schema.Types.Mixed },
});
exports.City = mongoose_1.default.model('City', citySchema);
