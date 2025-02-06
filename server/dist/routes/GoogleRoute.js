"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const GoogleController_1 = require("../controllers/GoogleController");
const router = (0, express_1.Router)();
router.get("/photo", GoogleController_1.getPhoto);
exports.default = router;
