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
const createDevConnection_1 = require("./utils/createDevConnection");
require("reflect-metadata");
const RefreshToken_1 = require("./routes/RefreshToken");
const PointsResolver_1 = require("./resolvers/PointsResolver");
const UserResolver_1 = require("./resolvers/UserResolver");
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const typeorm_1 = require("typeorm");
const apollo_server_express_1 = require("apollo-server-express");
const type_graphql_1 = require("type-graphql");
require("dotenv").config();
(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log(process.env.NODE_ENV);
    const app = express_1.default();
    const PORT = process.env.PORT || 5000;
    app.use(cors_1.default({
        origin: "http://localhost:3000",
        credentials: true,
    }));
    app.use(cookie_parser_1.default());
    app.use("/auth/refresh_token", RefreshToken_1.router);
    if (process.env.NODE_ENV === "production") {
        yield typeorm_1.createConnection();
    }
    else {
        yield createDevConnection_1.createDevConnection();
    }
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: yield type_graphql_1.buildSchema({
            resolvers: [UserResolver_1.UserResolver, PointsResolver_1.PointsResolver],
        }),
        context: ({ req, res }) => ({ req, res }),
    });
    apolloServer.applyMiddleware({ app, cors: false });
    app.listen(PORT, () => console.log("Express listening on port! ", PORT));
}))();
//# sourceMappingURL=index.js.map