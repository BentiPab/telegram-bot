import i18next from "i18next";
import { RateType, ratesNames } from "../model";
import { IRate } from "../mongo/models/rate";
import { Markup } from "telegraf";
import { User } from "telegraf/typings/core/types/typegram";

const BULLET_POINT = "\u2022";

export const getUserLanguage = (userLanguage?: string) => {
  return ["en", "es"].includes(userLanguage || "") ? userLanguage : "en";
};

export const parseVariationToMovementMessage = (variation: string) => {
  const formatted = variation.replace("%", "").replace(",", ".");

  if (formatted.includes("-")) {
    return "decreased";
  }

  if (formatted === "0.00" || formatted === "0") {
    return "same";
  }

  return "rise";
};

export const getInlineKeyboardOptions = (userLanguage?: string) => {
  const lng = getUserLanguage(userLanguage);
  return ratesNames.map((rn) =>
    Markup.button.callback(i18next.t(`rates.${rn}`, { lng }), rn)
  );
};

export const formatRateToMessage = (data: IRate, userLanguage?: string) => {
  const lng = getUserLanguage(userLanguage);
  const { compra, venta, fecha, valorCierreAnt, variacion, name } = data;
  const movementKey = parseVariationToMovementMessage(variacion);
  const avg = calculateAvg(compra, venta);
  const message = i18next.t("rates.rateUpdateMessage", {
    rate: name,
    movimiento: movementKey,
    valorCierreAnt,
    variacion,
    compra,
    venta,
    avg,
    fecha,
    lng,
  });
  return message;
};

export const formatSubsMessage = (data: IRate[], userLanguage?: string) => {
  const lng = getUserLanguage(userLanguage);
  if (data.length) {
    const mappedRates = data.map(
      (r, index) => `${index + 1}- ${i18next.t(`rates.${r.name}`, { lng })}\n`
    );
    const subscriptionMessage = i18next.t("user.subscribedTo", { lng });
    return subscriptionMessage.concat(...mappedRates);
  } else {
    return i18next.t("user.noSubscriptions", { lng });
  }
};

export const parseData = (data: RateType, name: string): IRate => {
  return { ...data, valorCierreAnt: data.valor_cierre_ant, name };
};

export const calculateAvg = (compra: string, venta: string) => {
  const compraParsed = parseFloat(compra);
  const ventaParsed = parseFloat(venta);
  return ((compraParsed + ventaParsed) / 2)
    .toFixed(2)
    .toString()
    .replace(".", ",");
};
export const getGreetingMessage = (user: User) => {
  const lng = getUserLanguage(user.language_code);

  const userGreet = i18next.t("greet.greetUser", {
    userName: user.first_name,
    lng,
  });
  const rateMessage = ratesNames.map((rn) =>
    i18next.t("greet.rateCommand", {
      rateName: rn,
      val: `$t(${rn})`,
      lng,
    })
  );
  const restCommands = i18next.t("greet.restCommands", { lng });

  return userGreet.concat(...rateMessage).concat(restCommands);
};
