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
exports.RateController = void 0;
const rate_1 = require("../mongo/models/rate");
const updateRate = (name, updatedRate) => __awaiter(void 0, void 0, void 0, function* () {
    const rate = yield rate_1.Rate.findOneAndUpdate({ name }, {
        $set: updatedRate,
    });
    console.log(rate);
    if (!rate) {
        return "rate not found";
    }
    return rate;
});
const getRate = (name) => __awaiter(void 0, void 0, void 0, function* () { return yield rate_1.Rate.findOne({ name }).lean(); });
const createRate = (newRate) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rate = yield rate_1.Rate.create(newRate);
        return rate;
    }
    catch (e) {
        if (e.code === 11000) {
            return;
        }
    }
});
const subscribeToRate = (rateName, sub) => __awaiter(void 0, void 0, void 0, function* () {
    const rate = yield rate_1.Rate.findOne({ name: rateName });
    const exists = rate === null || rate === void 0 ? void 0 : rate.subscribers.find((s) => s.id === sub.id);
    if (exists) {
        return false;
    }
    return yield (rate === null || rate === void 0 ? void 0 : rate.updateOne({ $push: { subscribers: sub } }));
});
const unsubscribeFromRate = (rateName, sub) => __awaiter(void 0, void 0, void 0, function* () {
    const rate = yield rate_1.Rate.findOne({ name: rateName });
    const exists = rate === null || rate === void 0 ? void 0 : rate.subscribers.find((s) => s.id === sub.id);
    if (!exists) {
        return false;
    }
    const newSubs = rate === null || rate === void 0 ? void 0 : rate.subscribers.filter((s) => s.id !== sub.id);
    return yield (rate === null || rate === void 0 ? void 0 : rate.updateOne({ $set: { subscribers: newSubs } }));
});
const getRateSubscribers = (rateName) => __awaiter(void 0, void 0, void 0, function* () {
    const rate = yield rate_1.Rate.findOne({ name: rateName }, { subscribers: true });
    if (!rate) {
        return [];
    }
    return rate.subscribers;
});
exports.RateController = {
    getRate,
    createRate,
    updateRate,
    subscribeToRate,
    getRateSubscribers,
    unsubscribeFromRate,
};
//# sourceMappingURL=rateContoller.js.map