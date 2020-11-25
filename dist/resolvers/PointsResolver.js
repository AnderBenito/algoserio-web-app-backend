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
exports.PointsResolver = void 0;
const User_1 = require("./../entity/User");
const type_graphql_1 = require("type-graphql");
const Points_1 = require("./../entity/Points");
var OrderTypes;
(function (OrderTypes) {
    OrderTypes["ASC"] = "ASC";
    OrderTypes["DESC"] = "DESC";
})(OrderTypes || (OrderTypes = {}));
let PointsResolver = class PointsResolver {
    getAllPoints() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Points_1.Points.find({ relations: ["user"] });
        });
    }
    getPaginatedPoints(skip, take, order) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Points_1.Points.find({
                relations: ["user"],
                order: {
                    createdAt: order,
                },
                skip: skip,
                take: take,
            });
        });
    }
    getPointsById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Points_1.Points.find({
                relations: ["user"],
                where: { user: { id: id } },
            });
        });
    }
    getPointsByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.User.findOne({ where: { username } });
            if (!user) {
                throw new Error(`User with username: ${username} not found`);
            }
            return yield Points_1.Points.find({
                relations: ["user"],
                where: { user: user },
            });
        });
    }
    addPoints(username, amount, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.User.findOne({ where: { username: username } });
            if (user) {
                yield Points_1.Points.insert({
                    createdAt: new Date(),
                    amount,
                    reason,
                    user,
                });
                return true;
            }
            else {
                throw new Error(`User with username: ${username} not found`);
            }
        });
    }
    deletePoints(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield Points_1.Points.delete(id);
                return true;
            }
            catch (e) {
                console.log(e);
                return false;
            }
        });
    }
    updatePoints(id, amount, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            let points = (yield Points_1.Points.findOne({ id: id }));
            if (points) {
                points.amount = amount ? amount : points.amount;
                points.reason = reason ? reason : points.reason;
            }
            else {
                throw new Error("Couldnt find points");
            }
            try {
                return yield Points_1.Points.save(points);
            }
            catch (e) {
                console.log(e);
                throw new Error("Couldnt find points");
            }
        });
    }
};
__decorate([
    type_graphql_1.Query(() => [Points_1.Points]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PointsResolver.prototype, "getAllPoints", null);
__decorate([
    type_graphql_1.Query(() => [Points_1.Points]),
    __param(0, type_graphql_1.Arg("skip", { nullable: true })),
    __param(1, type_graphql_1.Arg("take", { nullable: true })),
    __param(2, type_graphql_1.Arg("order", { nullable: true, defaultValue: "ASC" })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", Promise)
], PointsResolver.prototype, "getPaginatedPoints", null);
__decorate([
    type_graphql_1.Query(() => [Points_1.Points]),
    __param(0, type_graphql_1.Arg("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PointsResolver.prototype, "getPointsById", null);
__decorate([
    type_graphql_1.Query(() => [Points_1.Points]),
    __param(0, type_graphql_1.Arg("username")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PointsResolver.prototype, "getPointsByUsername", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Arg("username")),
    __param(1, type_graphql_1.Arg("amount")),
    __param(2, type_graphql_1.Arg("reason")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, String]),
    __metadata("design:returntype", Promise)
], PointsResolver.prototype, "addPoints", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Arg("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PointsResolver.prototype, "deletePoints", null);
__decorate([
    type_graphql_1.Mutation(() => Points_1.Points),
    __param(0, type_graphql_1.Arg("id")),
    __param(1, type_graphql_1.Arg("amount", { nullable: true })),
    __param(2, type_graphql_1.Arg("reason", { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, String]),
    __metadata("design:returntype", Promise)
], PointsResolver.prototype, "updatePoints", null);
PointsResolver = __decorate([
    type_graphql_1.Resolver(Points_1.Points)
], PointsResolver);
exports.PointsResolver = PointsResolver;
//# sourceMappingURL=PointsResolver.js.map