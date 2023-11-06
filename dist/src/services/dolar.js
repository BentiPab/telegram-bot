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
exports.fetchDollarOficialRate = exports.fetchDollarRate = void 0;
const axios_1 = __importDefault(require("axios"));
const formater_1 = require("../utils/formater");
const model_1 = require("../model");
const url = process.env.AMBITO_URL;
const dolarUrlMapper = {
    DOLAR_BLUE_URL: `${url}/dolar/informal/variacion`,
    DOLAR_OFICIAL_URL: `${url}/dolarnacion//variacion`,
};
const fetchDollarRate = () => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield axios_1.default.get(dolarUrlMapper.DOLAR_BLUE_URL);
    return (0, formater_1.parseData)(res.data, model_1.RatesNamesMap.DOLAR);
});
exports.fetchDollarRate = fetchDollarRate;
const fetchDollarOficialRate = () => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield axios_1.default.get(dolarUrlMapper.DOLAR_OFICIAL_URL);
    return (0, formater_1.parseData)(res.data, model_1.RatesNamesMap.DOLAR_OFICIAL);
});
exports.fetchDollarOficialRate = fetchDollarOficialRate;
//# sourceMappingURL=dolar.js.map