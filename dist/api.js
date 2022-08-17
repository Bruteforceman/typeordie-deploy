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
const express_1 = require("express");
const auth_1 = require("./auth");
const user_1 = __importDefault(require("./models/user"));
const router = (0, express_1.Router)(); // not sure what exactly this does
// always add a success : boolean
// field in your json responses. 
// this makes a life a lot easier in the front-end
// only for testing purposes, must remove it later
router.get('/getusers', (req, res) => {
    user_1.default.find({}).then((users) => res.json(users));
});
router.post('/register', auth_1.registerUser);
router.post('/login', auth_1.loginUser);
router.post('/logout', auth_1.logoutUser);
router.get('/whoami', auth_1.ensureLoggedIn, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // it is guaranteed someone is logged in
    const username = req.session.username;
    const user = (yield user_1.default.findOne({ username: username })); // user shouldn't be null
    res.send({ username: user.username,
        email: user.email,
        success: true });
}));
exports.default = router;
