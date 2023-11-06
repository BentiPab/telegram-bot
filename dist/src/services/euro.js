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
exports.fetchEuroOficialRate = exports.fetchEuroRate = void 0;
const axios_1 = __importDefault(require("axios"));
const formater_1 = require("../utils/formater");
const model_1 = require("../model");
const url = process.env.AMBITO_URL;
const euroUrlMapper = {
    EURO_OFICIAL_URL: `${url}/euro//variacion`,
    EURO_BLUE_URL: `${url}/euro/informal/variacion`,
};
const fetchEuroRate = () => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield axios_1.default.get(euroUrlMapper.EURO_BLUE_URL);
    return (0, formater_1.parseData)(res.data, model_1.RatesNamesMap.EURO);
});
exports.fetchEuroRate = fetchEuroRate;
const fetchEuroOficialRate = () => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield axios_1.default.get(euroUrlMapper.EURO_OFICIAL_URL);
    return (0, formater_1.parseData)(res.data, model_1.RatesNamesMap.EURO_OFICIAL);
});
exports.fetchEuroOficialRate = fetchEuroOficialRate;
//# sourceMappingURL=euro.js.map