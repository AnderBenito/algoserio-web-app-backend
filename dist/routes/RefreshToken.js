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
exports.router = void 0;
const auth_1 = require("./../utils/auth");
const sendRefreshToken_1 = require("./../utils/sendRefreshToken");
const User_1 = require("./../entity/User");
const jsonwebtoken_1 = require("jsonwebtoken");
const express_1 = __importDefault(require("express"));
exports.router = express_1.default.Router();
exports.router.get("/", (_, res) => {
    res.send("Hello walo");
});
exports.router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cookieToken = req.cookies.jid;
    if (!cookieToken)
        return res.status(400).send({ ok: false, accessToken: "" });
    let payload = null;
    try {
        payload = jsonwebtoken_1.verify(cookieToken, process.env.REFRESH_TOKEN_SECRET);
    }
    catch (error) {
        console.log(error);
        return res.status(400).send({ ok: false, accessToken: "" });
    }
    const user = yield User_1.User.findOne({ id: payload.userId });
    if (!user)
        return res.status(400).send({ ok: false, accessToken: "" });
    sendRefreshToken_1.sendRefreshToken(res, auth_1.createRefreshToken(user));
    return res
        .status(200)
        .send({ ok: true, accessToken: auth_1.createAccessToken(user) });
}));
//# sourceMappingURL=RefreshToken.js.map