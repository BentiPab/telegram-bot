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
const rateContoller_1 = require("../controller/rateContoller");
const model_1 = require("../model");
const telegram_1 = require("../telegram");
const formater_1 = require("../utils/formater");
const node_cron_1 = __importDefault(require("node-cron"));
const rate_1 = require("./rate");
const shouldSendRates = (newRate, skipCheck) => __awaiter(void 0, void 0, void 0, function* () {
    const oldRate = yield rateContoller_1.RateController.getRate(newRate.name);
    if (!oldRate) {
        console.log("update");
        yield rateContoller_1.RateController.createRate(newRate);
        return true;
    }
    if (!newRate.fecha.match(oldRate.fecha) || skipCheck) {
        console.log("update");
        yield rateContoller_1.RateController.updateRate(newRate.name, newRate);
        return true;
    }
    return false;
});
const sendAllMessages = (rate) => __awaiter(void 0, void 0, void 0, function* () {
    const subs = yield rateContoller_1.RateController.getRateSubscribers(rate.name);
    const subsIds = subs.map((s) => s.id);
    const messageToSend = (0, formater_1.formatRateToMessage)(rate);
    const promises = subsIds.map((sid) => __awaiter(void 0, void 0, void 0, function* () { return (0, telegram_1.sendRateUpdates)(sid, messageToSend); }));
    yield Promise.allSettled(promises);
});
const getRateUpdates = (skipCheck = false) => __awaiter(void 0, void 0, void 0, function* () {
    const promises = Object.values(model_1.RatesNamesMap).map((v) => __awaiter(void 0, void 0, void 0, function* () {
        const rate = yield (0, rate_1.fetchRate)(v);
        const shouldSendMessages = yield shouldSendRates(rate, skipCheck);
        if (shouldSendMessages) {
            yield sendAllMessages(rate);
        }
    }));
    yield Promise.allSettled(promises);
});
const UPDATE_CRON_TIMES = "10/10 11-19 * * 1-5";
const START_CRON_TIMES = "0 11 * * 1-5";
node_cron_1.default.schedule(UPDATE_CRON_TIMES, () => __awaiter(void 0, void 0, void 0, function* () { return yield getRateUpdates(); }), {
    timezone: "America/Buenos_Aires",
    name: "Poll Dollar Rates",
});
node_cron_1.default.schedule(START_CRON_TIMES, () => __awaiter(void 0, void 0, void 0, function* () { return yield getRateUpdates(true); }), {
    timezone: "America/Buenos_Aires",
    name: "Poll Dollar Rates",
});
//# sourceMappingURL=jobs.js.map