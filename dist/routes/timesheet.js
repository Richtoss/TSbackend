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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const Timesheet_1 = __importDefault(require("../models/Timesheet"));
const router = express_1.default.Router();
router.post('/', auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { weekStart } = req.body;
        const timesheet = new Timesheet_1.default({
            user: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id,
            weekStart: new Date(weekStart),
        });
        yield timesheet.save();
        res.status(201).json(timesheet);
    }
    catch (error) {
        res.status(400).json({ message: 'Error creating timesheet' });
    }
}));
router.post('/:id/entry', auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const { date, jobName, hours } = req.body;
        const timesheet = yield Timesheet_1.default.findOne({ _id: req.params.id, user: (_b = req.user) === null || _b === void 0 ? void 0 : _b._id });
        if (!timesheet) {
            return res.status(404).json({ message: 'Timesheet not found' });
        }
        timesheet.entries.push({ date: new Date(date), jobName, hours });
        timesheet.totalHours += hours;
        yield timesheet.save();
        res.json(timesheet);
    }
    catch (error) {
        res.status(400).json({ message: 'Error adding entry' });
    }
}));
router.get('/', auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        const timesheets = yield Timesheet_1.default.find({ user: (_c = req.user) === null || _c === void 0 ? void 0 : _c._id })
            .sort({ weekStart: -1 })
            .limit(6);
        res.json(timesheets);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching timesheets' });
    }
}));
router.patch('/:id/complete', auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    try {
        const timesheet = yield Timesheet_1.default.findOne({ _id: req.params.id, user: (_d = req.user) === null || _d === void 0 ? void 0 : _d._id });
        if (!timesheet) {
            return res.status(404).json({ message: 'Timesheet not found' });
        }
        timesheet.status = 'completed';
        yield timesheet.save();
        res.json(timesheet);
    }
    catch (error) {
        res.status(400).json({ message: 'Error completing timesheet' });
    }
}));
router.get('/all', auth_1.auth, auth_1.requireManager, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const timesheets = yield Timesheet_1.default.find().populate('user', 'email');
        res.json(timesheets);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching timesheets' });
    }
}));
exports.default = router;
