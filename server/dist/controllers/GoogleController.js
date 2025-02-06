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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPhoto = void 0;
const getPhoto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { photoReference } = req.query;
    const API_KEY = process.env.GOOGLE_MAPS_API_KEY;
    if (!photoReference) {
        res.status(400).json({ error: "Missing photo reference" });
        return;
    }
    try {
        const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${API_KEY}`;
        const response = yield fetch(url);
        if (!response.ok) {
            throw new Error(`Google API error: ${response.statusText}`);
        }
        const buffer = yield response.arrayBuffer();
        res.set("Content-Type", response.headers.get("content-type") || "image/jpeg");
        res.send(Buffer.from(buffer));
    }
    catch (error) {
        console.error("Error fetching Google Photo:", error);
        res.status(500).json({ error: "Failed to fetch image" });
    }
});
exports.getPhoto = getPhoto;
