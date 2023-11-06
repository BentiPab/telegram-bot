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
exports.sendRateUpdates = void 0;
const telegraf_1 = require("telegraf");
const formater_1 = require("../utils/formater");
const filters_1 = require("telegraf/filters");
const rate_1 = require("../services/rate");
const model_1 = require("../model");
const rateContoller_1 = require("../controller/rateContoller");
const bot = new telegraf_1.Telegraf(process.env.BOT_TOKEN);
const subscribeCallback = (ctx, type) => __awaiter(void 0, void 0, void 0, function* () {
    const message = type === "subscribe"
        ? "A cual desea suscribirse?"
        : "De cual desea desuscribirse";
    yield ctx.reply(message, Object.assign({ parse_mode: "HTML" }, telegraf_1.Markup.inlineKeyboard(formater_1.getInlineKeyboardOptions)));
});
const subscriptionCommandHandler = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const callbackQuery = ctx.callbackQuery;
    const subRate = callbackQuery.data;
    const from = callbackQuery.from;
    const originalMessage = callbackQuery.message.text;
    const isSubscription = !originalMessage.includes("desuscribirse");
    let message = "";
    if (isSubscription) {
        message = yield subscribeToRate(subRate, from);
    }
    else {
        message = yield unsuscribeFromRate(subRate, from);
    }
    ctx.answerCbQuery();
    ctx.editMessageReplyMarkup(undefined);
    ctx.reply(message);
});
const subscribeToRate = (rateName, from) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield rateContoller_1.RateController.subscribeToRate(rateName, from);
    const rateParsed = formater_1.nameParser[rateName];
    return !res
        ? `Suscriptor ya suscrito a ${rateParsed}`
        : `Suscripcion a ${rateParsed} exitosa\nRecibira actualizacion en el horario de mercado, y si el valor modifica`;
});
const unsuscribeFromRate = (rateName, from) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield rateContoller_1.RateController.unsubscribeFromRate(rateName, from);
    const rateParsed = formater_1.nameParser[rateName];
    return !res
        ? `Suscriptor no suscrito a ${rateParsed}`
        : `Desuscripcion a ${rateParsed} exitosa`;
});
const greetCallback = (ctx) => {
    const user = ctx.message.from;
    if (user.username === "iWallas") {
        ctx.reply("Waldo come verga");
        return;
    }
    ctx.reply((0, formater_1.getGreetingMessage)(user.first_name));
};
const getRateCommand = (ctx, name) => __awaiter(void 0, void 0, void 0, function* () {
    const rate = yield (0, rate_1.getRate)(name);
    if (!rate) {
        ctx.reply("Hubo un problema, intente mas tarde");
        return;
    }
    const rateFormatted = (0, formater_1.formatRateToMessage)(rate);
    ctx.reply(rateFormatted);
});
const initializeCommands = () => {
    bot.command("start", greetCallback);
    bot.command("subscribe", (ctx) => subscribeCallback(ctx, "subscribe"));
    bot.command("unsubscribe", (ctx) => subscribeCallback(ctx, "desuscribe"));
    Object.values(model_1.RatesNamesMap).forEach((v) => bot.command(v, (ctx) => getRateCommand(ctx, v)));
};
const initializeTexts = () => {
    bot.on((0, filters_1.message)("text"), greetCallback);
    bot.on((0, filters_1.callbackQuery)("data"), subscriptionCommandHandler);
};
const sendRateUpdates = (chatId, message) => {
    bot.telegram.sendMessage(chatId, message);
};
exports.sendRateUpdates = sendRateUpdates;
const initBot = () => {
    initializeCommands();
    initializeTexts();
    bot.launch();
};
initBot();
//# sourceMappingURL=index.js.map