"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
exports.UserResolver = void 0;
const isAuth_1 = require("./../middleware/isAuth");
const sendRefreshToken_1 = require("./../utils/sendRefreshToken");
const auth_1 = require("./../utils/auth");
const User_1 = require("./../entity/User");
const type_graphql_1 = require("type-graphql");
const bcrypt_1 = require("bcrypt");
var OrderTypes;
(function (OrderTypes) {
    OrderTypes["ASC"] = "ASC";
    OrderTypes["DESC"] = "DESC";
})(OrderTypes || (OrderTypes = {}));
let LoginResponse = class LoginResponse {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], LoginResponse.prototype, "accessToken", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", User_1.User)
], LoginResponse.prototype, "user", void 0);
LoginResponse = __decorate([
    type_graphql_1.ObjectType()
], LoginResponse);
let TotalPointsPerUserResponse = class TotalPointsPerUserResponse {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", User_1.User)
], TotalPointsPerUserResponse.prototype, "user", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Number)
], TotalPointsPerUserResponse.prototype, "totalPoints", void 0);
TotalPointsPerUserResponse = __decorate([
    type_graphql_1.ObjectType()
], TotalPointsPerUserResponse);
let UserResolver = class UserResolver {
    hello({ payload }) {
        console.log(payload);
        return "Hello User";
    }
    getCurrentUser({ payload }) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield User_1.User.findOne({ id: payload === null || payload === void 0 ? void 0 : payload.userId });
        });
    }
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield User_1.User.find({ relations: ["points"] });
        });
    }
    getPaginatedUsers(skip, take, order) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield User_1.User.find({
                relations: ["points"],
                order: {
                    name: order,
                },
                skip: skip,
                take: take,
            });
        });
    }
    getTotalPointsPerUSer() {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield User_1.User.find({ relations: ["points"] });
            const userTotal = users.map((user) => {
                let totalPoints;
                if (!user.points) {
                    totalPoints = 0;
                }
                else {
                    let pointsArray = user.points.map((point) => point.amount);
                    totalPoints = pointsArray.reduce((a, b) => a + b, 0);
                }
                return {
                    user: user,
                    totalPoints: totalPoints,
                };
            });
            return userTotal;
        });
    }
    loginUser(username, password, { res }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.User.findOne({ username });
            if (user) {
                const valid = yield bcrypt_1.compare(password, user.password);
                if (valid) {
                    console.log("Loging successfull");
                    sendRefreshToken_1.sendRefreshToken(res, auth_1.createRefreshToken(user));
                    return {
                        accessToken: auth_1.createAccessToken(user),
                        user: user,
                    };
                }
                else {
                    throw new Error("Invalid username or password");
                }
            }
            else {
                throw new Error("Invalid username or password");
            }
        });
    }
    logOutUser({ res }) {
        return __awaiter(this, void 0, void 0, function* () {
            res.clearCookie("jid");
            return true;
        });
    }
    registerUser(name, email, username, password, isAdmin) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield User_1.User.findOne({ where: { email } });
            if (user)
                throw new Error(`User with email ${email} already exists!`);
            user = yield User_1.User.findOne({ where: { username } });
            if (user)
                throw new Error(`User with username ${username} already exists!`);
            const salt = yield bcrypt_1.genSalt(10);
            const hashedPassword = yield bcrypt_1.hash(password, salt);
            try {
                yield User_1.User.insert({
                    createdAt: new Date(),
                    name,
                    email,
                    username,
                    password: hashedPassword,
                    isAdmin,
                });
            }
            catch (error) {
                return false;
            }
            return true;
        });
    }
    changeUserPassword(oldPassword, newPassword, { payload }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.User.findOne({ id: payload === null || payload === void 0 ? void 0 : payload.userId });
            if (!user) {
                throw new Error(`No user with id ${payload === null || payload === void 0 ? void 0 : payload.userId} found`);
            }
            const valid = yield bcrypt_1.compare(oldPassword, user.password);
            if (!valid) {
                throw new Error(`Wrong old password`);
            }
            const salt = yield bcrypt_1.genSalt(10);
            const hashedPassword = yield bcrypt_1.hash(newPassword, salt);
            user.password = hashedPassword;
            user.tokenVersion += 1;
            try {
                yield User_1.User.save(user);
            }
            catch (e) {
                console.log(e);
                return false;
            }
            return true;
        });
    }
};
__decorate([
    type_graphql_1.Query(() => String),
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserResolver.prototype, "hello", null);
__decorate([
    type_graphql_1.Query(() => User_1.User),
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "getCurrentUser", null);
__decorate([
    type_graphql_1.Query(() => [User_1.User]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "getAllUsers", null);
__decorate([
    type_graphql_1.Query(() => [User_1.User]),
    __param(0, type_graphql_1.Arg("skip", { nullable: true })),
    __param(1, type_graphql_1.Arg("take", { nullable: true })),
    __param(2, type_graphql_1.Arg("order", { nullable: true, defaultValue: "ASC" })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "getPaginatedUsers", null);
__decorate([
    type_graphql_1.Query(() => [TotalPointsPerUserResponse]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "getTotalPointsPerUSer", null);
__decorate([
    type_graphql_1.Mutation(() => LoginResponse),
    __param(0, type_graphql_1.Arg("username")),
    __param(1, type_graphql_1.Arg("password")),
    __param(2, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "loginUser", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "logOutUser", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Arg("name")),
    __param(1, type_graphql_1.Arg("email")),
    __param(2, type_graphql_1.Arg("username")),
    __param(3, type_graphql_1.Arg("password")),
    __param(4, type_graphql_1.Arg("isAdmin", { defaultValue: false })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, Boolean]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "registerUser", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    __param(0, type_graphql_1.Arg("oldPassword")),
    __param(1, type_graphql_1.Arg("newPassword")),
    __param(2, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "changeUserPassword", null);
UserResolver = __decorate([
    type_graphql_1.Resolver(User_1.User)
], UserResolver);
exports.UserResolver = UserResolver;
//# sourceMappingURL=UserResolver.js.map