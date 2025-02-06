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
exports.getTourById = exports.deleteTours = exports.editTours = exports.postTours = exports.getTours = void 0;
const tourModel_1 = require("../models/tourModel");
const getTours = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id } = req.params;
    const tours = yield tourModel_1.Tour.find({ user_id });
    res.json(tours);
});
exports.getTours = getTours;
const postTours = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id } = req.params;
    const { title, destination, startDate, endDate, days } = req.body;
    if (!title || !destination || !startDate || !endDate) {
        res.status(400).json({ error: "Missing required fields: title, destination, startDate, endDate" });
        return;
    }
    const newTour = new tourModel_1.Tour({
        user_id,
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
