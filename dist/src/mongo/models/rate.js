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
exports.Rate = exports.initRateCollection = void 0;
const mongoose_1 = require("mongoose");
const model_1 = require("../../model");
const rate_1 = require("../../services/rate");
const rateSchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true },
    compra: { type: String, required: true },
    venta: { type: String, required: true },
    fecha: { type: String, required: true },
    variacion: { type: String, required: true },
    valorCierreAnt: { type: String, required: false },
    subscribers: {
        type: [
            {
                id: { type: Number, required: true },
                first_name: { type: String, required: true },
                last_name: { type: String, required: false },
                username: { type: String, required: false },
            },
        ],
        default: [],
    },
}, { id: false, versionKey: false, timestamps: true });
const initRateCollection = () => __awaiter(void 0, void 0, void 0, function* () {
    const promises = Object.values(model_1.RatesNamesMap).map((v) => __awaiter(void 0, void 0, void 0, function* () {
        return (0, rate_1.getRate)(v);
    }));
    yield Promise.allSettled(promises);
});
exports.initRateCollection = initRateCollection;
exports.Rate = (0, mongoose_1.model)("Rate", rateSchema);
//# sourceMappingURL=rate.js.map