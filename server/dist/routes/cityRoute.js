"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const pointsOfInterestController_1 = require("../controllers/pointsOfInterestController");
const searchButtonController_1 = require("../controllers/searchButtonController");
router.post('/:cityName', pointsOfInterestController_1.getPointsOfInterest);
router.get('/:point_id', pointsOfInterestController_1.getDetails);
router.get('/autocomplete/:input', searchButtonController_1.autocomplete);
router.get('/details/:placeId', searchButtonController_1.getCoordinates);
exports.default = router;
