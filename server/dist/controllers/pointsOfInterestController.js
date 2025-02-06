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
exports.getDetails = exports.getPointsOfInterest = void 0;
const cityModel_1 = require("../models/cityModel");
const POIDetailsModel_1 = require("../models/POIDetailsModel");
const getPointsOfInterest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { latitude, longitude, radius = 20000 } = req.body;
        const { cityName } = req.params;
        if (cityName != "MovedMap") {
            const savedCity = yield cityModel_1.City.findOne({ cityName });
            if (savedCity) {
                res.json(savedCity.pointsOfInterest);
                return;
            }
        }
        const pointsOfInterest = yield fetchPoints(latitude, longitude, radius);
        if (pointsOfInterest) {
            if (cityName != "MovedMap") {
                yield saveCityData(cityName, latitude, longitude, pointsOfInterest);
            }
            res.json(pointsOfInterest);
        }
        else {
            res.json("Unable to reach API data");
        }
    }
    catch (error) {
        console.error('Error fetching points of interest:', error);
        res.status(500).json({ error: error.message });
    }
});
exports.getPointsOfInterest = getPointsOfInterest;
const getDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { point_id } = req.params;
        const savedPOI = yield POIDetailsModel_1.Details.findOne({ point_id });
        if (savedPOI) {
            res.json(savedPOI);
            return;
        }
        const details = yield fetchDetails(point_id);
        if (details) {
            yield saveDetailsData(point_id, details.name, details.description, details.phone, details.images);
            res.json(details);
        }
        else {
            res.json("Unable to reach API data");
        }
    }
    catch (error) {
        console.error('Error fetching points of interest:', error);
        res.status(500).json({ error: error.message });
    }
});
exports.getDetails = getDetails;
function fetchPoints() {
    return __awaiter(this, arguments, void 0, function* (latitude = 51.5072178, longitude = -0.1275862, radius) {
        let pointsOfInterest = [];
        try {
            const types = ['tourist_attraction', 'museum', 'park', 'historic_site', 'art_gallery', 'amusement_park'];
            const promises = types.map(type => fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=${type}&key=${process.env.GOOGLE_MAPS_API_KEY}`)
                .then(response => response.json())
                .then(data => data.results));
            const allResults = yield Promise.all(promises);
            const allPoints = allResults.flat();
            pointsOfInterest = allPoints.map((poi) => ({
                name: poi.name,
                id: poi.place_id,
                latitude: poi.geometry.location.lat,
                longitude: poi.geometry.location.lng,
            }));
            return [...pointsOfInterest];
        }
        catch (error) {
            console.error('Error fetching Points of Interest:', error);
        }
    });
}
function fetchDetails(place_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `https://maps.googleapis.com/maps/api/place/details/json?fields=name,editorial_summary,photos,formatted_phone_number&place_id=${place_id}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
        try {
            const response = yield fetch(url);
            const data = yield response.json();
            if (data.status !== "OK") {
                throw new Error(`Google Places API error: ${data.status}`);
            }
            const details = {
                name: data.result.name,
                description: data.result.editorial_summary ? data.result.editorial_summary.overview : 'No description available',
                phone: data.result.formatted_phone_number ? data.result.formatted_phone_number : 'No phone available',
                images: data.result.photos && data.result.photos.length > 0 ? data.result.photos : null,
            };
            return details;
        }
        catch (error) {
            console.error('Error fetching Points of Interest:', error);
        }
    });
}
function saveCityData(cityName, latitude, longitude, pointsOfInterest) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const newCity = new cityModel_1.City({ cityName, latitude, longitude, pointsOfInterest });
            yield newCity.save();
            console.log('City data saved successfully.');
        }
        catch (error) {
            console.error('Error saving city data:', error);
        }
    });
}
function saveDetailsData(point_id, name, description, phone, images) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const newDetails = new POIDetailsModel_1.Details({ point_id, name, description, phone, images });
            yield newDetails.save();
            console.log('Details saved successfully.');
        }
        catch (error) {
            console.error('Error saving details:', error);
        }
    });
}
