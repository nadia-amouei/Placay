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
exports.deleteFavorite = exports.postFavorite = exports.getFavorites = void 0;
const favoriteModel_1 = require("../models/favoriteModel");
const getFavorites = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user._id;
        const { latitude, longitude, googlePOIId } = req.query;
        const noFilter = !latitude && !longitude && !googlePOIId;
        if (noFilter) {
            const allFavorites = yield favoriteModel_1.Favorite.find({ user: userId });
            res.json(allFavorites);
            return;
        }
        const filter = { user: userId };
        if (googlePOIId) {
            filter.googlePOIId = googlePOIId;
        }
        if (latitude && longitude) {
            const latNum = parseFloat(latitude);
            const lngNum = parseFloat(longitude);
            filter.latitude = latNum;
            filter.longitude = lngNum;
        }
        const favorites = yield favoriteModel_1.Favorite.find(filter);
        const exists = favorites.length > 0;
        res.json({ exists: exists, });
    }
    catch (error) {
        console.error("Error fetching favorites:", error);
        res.status(500).json({ error: error.message });
    }
});
exports.getFavorites = getFavorites;
const postFavorite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user._id;
        const { name, latitude, longitude, googlePOIId } = req.body;
        if (typeof latitude !== "number" || typeof longitude !== "number") {
            res.status(401).json({ error: "Invalid location data" });
            return;
        }
        let existingFavorite;
        if (googlePOIId) {
            existingFavorite = yield favoriteModel_1.Favorite.findOne({
                user: userId,
                googlePOIId: googlePOIId,
            });
        }
        else {
            existingFavorite = yield favoriteModel_1.Favorite.findOne({
                user: userId,
                latitude: latitude,
                longitude: longitude,
            });
        }
        if (existingFavorite) {
            res.status(409).json({ error: "Favorite already exists", existingFavorite });
            return;
        }
        const newFavorite = new favoriteModel_1.Favorite({
            user: userId,
            name,
            latitude,
            longitude,
            googlePOIId,
        });
        yield newFavorite.save();
        res.json(newFavorite);
    }
    catch (error) {
        console.error("Error creating favorite:", error);
        res.status(500).json({ error: error.message });
    }
});
exports.postFavorite = postFavorite;
const deleteFavorite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user._id;
        const favoriteId = req.params.id;
        if (!user) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const favoriteIndex = yield favoriteModel_1.Favorite.findOne({ _id: favoriteId, user: user });
        if (!favoriteIndex) {
            return res.status(404).json({ error: "Favorite not found" });
        }
        yield favoriteModel_1.Favorite.findOneAndDelete({ _id: favoriteId, user: user });
        res.status(200).json({ message: "Favorite removed successfully", favorites: user.favorites });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error." });
    }
});
exports.deleteFavorite = deleteFavorite;
