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
exports.ensureLoggedIn = exports.logoutUser = exports.loginUser = exports.registerUser = void 0;
const dotenv_1 = require("dotenv");
const bcrypt_1 = require("bcrypt");
const user_1 = __importDefault(require("./models/user"));
(0, dotenv_1.config)();
// handles both authentication and authorization
// AUTHENTICATION
// use 403 http code for failed authentication
// 403 is the http code for Forbidden status
function registerUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const username = req.body.username;
        const password = req.body.password;
        const email = req.body.email;
        const hashedPassword = yield (0, bcrypt_1.hash)(password, 5); // 5 is the number of salt rounds
        if ((yield user_1.default.exists({ username: username })) !== null) {
            return res.json({ success: false, message: 'Username already exists' });
        }
        if ((yield user_1.default.exists({ email: email })) !== null) {
            return res.json({ success: false, message: 'Another account with the same email already exists' });
        }
        const newUser = new user_1.default({
            username: username,
            password: hashedPassword,
            email: email
        });
        newUser.save().then(() => {
            req.session.username = username;
            res.json({ success: true, message: 'New user successfully registered' });
        });
    });
}
exports.registerUser = registerUser;
function loginUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const username = req.body.username;
        const password = req.body.password;
        const user = yield user_1.default.findOne({ username: username });
        if (user !== null && (yield (0, bcrypt_1.compare)(password, user.password))) {
            req.session.username = user.username;
            res.json({ success: true, message: 'User successfully authenticated' });
        }
        else {
            req.session.username = null;
            res.json({ success: false, message: `Username and password don't match` });
        }
    });
}
exports.loginUser = loginUser;
function logoutUser(req, res) {
    req.session.username = null;
    res.json({ success: true, message: 'Logged out' });
}
exports.logoutUser = logoutUser;
function ensureLoggedIn(req, res, next) {
    if (req.session.username != null) { // checks for both null and undefined
        next();
    }
    else {
        res.json({ success: false, message: 'You must be logged in to access this page' });
    }
}
exports.ensureLoggedIn = ensureLoggedIn;
