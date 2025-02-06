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
exports.getNumberOfLikes = exports.likedTours = exports.getTourById = exports.deleteTours = exports.editTours = exports.addNewTour = exports.postTours = exports.getAllTours = exports.getTours = void 0;
const tourModel_1 = require("../models/tourModel");
const userModel_1 = require("../models/userModel");
const getTours = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const tours = yield tourModel_1.Tour.find({ user_id: userId });
    res.json(tours);
});
exports.getTours = getTours;
const getAllTours = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;
    const tours = yield tourModel_1.Tour.find().skip(skip).limit(limit);
    res.json(tours);
});
exports.getAllTours = getAllTours;
const postTours = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const { title, destination, startDate, endDate, days } = req.body;
    if (!title || !destination || !startDate || !endDate) {
        res.status(400).json({ error: "Missing required fields: title, destination, startDate, endDate" });
        return;
    }
    const newTour = new tourModel_1.Tour({
        user_id: userId,
        title,
        destination,
        startDate,
        endDate,
        days: days || []
    });
    yield newTour.save();
    res.json(newTour);
});
exports.postTours = postTours;
const addNewTour = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user_id = req.user._id;
        const { title, location, duration } = req.body;
        if (!location || location.length === 0) {
            return res.status(400).json({ message: "Tour must have at least one location." });
        }
        const newTour = new tourModel_1.Tour({
            user_id,
            title,
            location,
            duration
        });
        yield newTour.save();
        return res.status(201).json({ message: "Tour created successfully", tour: newTour });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error creating the tour", error: error.message });
    }
});
exports.addNewTour = addNewTour;
const editTours = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tour_id } = req.params;
    const updates = req.body;
    const updatedTour = yield tourModel_1.Tour.findByIdAndUpdate(tour_id, updates, { new: true });
    if (updatedTour) {
        res.json(updatedTour);
        return;
    }
    res.status(404).json({ error: "Tour not found" });
});
exports.editTours = editTours;
const deleteTours = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tour_id } = req.params;
    const deletedTour = yield tourModel_1.Tour.findByIdAndDelete(tour_id);
    if (deletedTour) {
        res.json(deletedTour);
        return;
    }
    res.status(404).json({ error: "Tour not found" });
});
exports.deleteTours = deleteTours;
const getTourById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tour_id } = req.params;
    const tour = yield tourModel_1.Tour.findById(tour_id);
    if (!tour) {
        res.status(404).json({ error: "Tour not found" });
        return;
    }
    res.json(tour);
});
exports.getTourById = getTourById;
const likedTours = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tourId, userId } = req.params;
        const user = yield userModel_1.User.findById(userId);
        const tour = yield tourModel_1.Tour.findById(tourId);
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        if (!tour) {
            res.status(404).json({ error: "Tour not found" });
            return;
        }
        if (!user.likedTours) {
            user.likedTours = [];
        }
        const tourIndex = user.likedTours.indexOf(tourId);
        if (tourIndex === -1) {
            user.likedTours.push(tourId);
            tour.like = (Number(tour.like) || 0) + 1;
        }
        else {
            user.likedTours.splice(tourIndex, 1);
            if (Number(tour.like) > 0)
                tour.like = Number(tour.like) - 1;
        }
        yield user.save();
        yield tour.save();
        res.json({ message: "Like updated", numLikedTours: user.likedTours.length });
    }
    catch (error) {
        console.error("Error updating like:", error);
        res.status(500).json({ error: error.message });
    }
});
exports.likedTours = likedTours;
const getNumberOfLikes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tourId } = req.params;
        const tour = yield tourModel_1.Tour.findById(tourId);
        if (!tour) {
            res.status(404).json({ error: "Tour not found" });
            return;
        }
        res.json({ message: "number of liked sent", tourLiked: tour.like });
    }
    catch (error) {
        console.error("Error updating like:", error);
        res.status(500).json({ error: error.message });
    }
});
exports.getNumberOfLikes = getNumberOfLikes;
