"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tourController_1 = require("../controllers/tourController");
const asyncHandler_1 = require("../middleware/asyncHandler");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.get('/tours', (0, asyncHandler_1.asyncHandler)(tourController_1.getAllTours));
router.get('/:user_id', authMiddleware_1.authMiddleware, (0, asyncHandler_1.asyncHandler)(tourController_1.getTours));
router.post('/:user_id', authMiddleware_1.authMiddleware, (0, asyncHandler_1.asyncHandler)(tourController_1.addNewTour));
router.put('/:tour_id', authMiddleware_1.authMiddleware, (0, asyncHandler_1.asyncHandler)(tourController_1.editTours));
router.delete('/:tour_id', authMiddleware_1.authMiddleware, (0, asyncHandler_1.asyncHandler)(tourController_1.deleteTours));
router.get("/one/:tour_id", authMiddleware_1.authMiddleware, (0, asyncHandler_1.asyncHandler)(tourController_1.getTourById));
router.post('/liked/:userId/:tourId', authMiddleware_1.authMiddleware, (0, asyncHandler_1.asyncHandler)(tourController_1.likedTours));
router.get('/liked/:tourId', (0, asyncHandler_1.asyncHandler)(tourController_1.getNumberOfLikes));
exports.default = router;
