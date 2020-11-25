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
exports.isAuth = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
exports.isAuth = ({ context }, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authorization = context.req.headers["authorization"];
    if (!authorization)
        throw new Error("Not authenticated");
    try {
        const token = authorization === null || authorization === void 0 ? void 0 : authorization.split(" ")[1];
        const payload = jsonwebtoken_1.verify(token, process.env.ACCESS_TOKEN_SECRET);
        context.payload = payload;
    }
    catch (e) {
        console.log(e);
        throw new Error("Not authenticated");
    }
    yield next();
});
//# sourceMappingURL=isAuth.js.map