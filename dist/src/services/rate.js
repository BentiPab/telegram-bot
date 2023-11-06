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
exports.getRate = exports.fetchRate = void 0;
const rateContoller_1 = require("../controller/rateContoller");
const dolar_1 = require("./dolar");
const euro_1 = require("./euro");
const fetchersMap = {
    dolar: dolar_1.fetchDollarRate,
    euro: euro_1.fetchEuroRate,
    dolar_oficial: dolar_1.fetchDollarOficialRate,
    euro_oficial: euro_1.fetchEuroOficialRate,
};
const fetchRate = (name) => __awaiter(void 0, void 0, void 0, function* () {
    return yield fetchersMap[name]();
});
exports.fetchRate = fetchRate;
const getRate = (name) => __awaiter(void 0, void 0, void 0, function* () {
    const dbRate = yield rateContoller_1.RateController.getRate(name);
    if (dbRate === null) {
        const newRate = yield (0, exports.fetchRate)(name);
        return yield rateContoller_1.RateController.createRate(newRate);
    }
    return dbRate;
});
exports.getRate = getRate;
//# sourceMappingURL=rate.js.map