'use strict';
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
exports.getCoordinates = exports.autocomplete = void 0;
const autocomplete = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input } = req.params;
        if (!input || typeof input !== 'string') {
            res.status(400).json({ error: "Missing or invalid 'input' parameter" });
            return;
        }
        const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
        const response = yield fetch(url);
        const data = yield response.json();
        res.json(data);
    }
    catch (error) {
        console.error('Error fetching autocomplete data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.autocomplete = autocomplete;
const getCoordinates = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { placeId } = req.params;
        if (!placeId || typeof placeId !== 'string') {
            res.status(400).json({ error: "Missing or invalid 'input' parameter" });
            return;
        }
        const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
        const response = yield fetch(url);
        const data = yield response.json();
        res.json(data);
    }
    catch (error) {
        console.error('Error fetching coordinates:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.getCoordinates = getCoordinates;
