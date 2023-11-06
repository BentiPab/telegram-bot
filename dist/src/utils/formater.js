"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGreetingMessage = exports.GREETING_MESSAGE = exports.calculateAvg = exports.parseData = exports.formatRateToMessage = exports.getNamesParsedArray = exports.getInlineKeyboardOptions = exports.nameParser = exports.parseVariation = void 0;
const telegraf_1 = require("telegraf");
const parseVariation = (variation) => {
    variation.replace("%", "").replace(",", ".");
    return parseFloat(variation);
};
exports.parseVariation = parseVariation;
exports.nameParser = {
    euro_oficial: "Euro Oficial",
    dolar_oficial: "Dolar Oficial",
    dolar: "Dolar Blue",
    euro: "Euro Blue",
};
exports.getInlineKeyboardOptions = Object.keys(exports.nameParser).map((k) => [
    telegraf_1.Markup.button.callback(exports.nameParser[k], k),
]);
exports.getNamesParsedArray = Object.values(exports.nameParser).map((v) => v);
const formatRateToMessage = (data) => {
    const { compra, venta, fecha, valorCierreAnt, variacion, name } = data;
    const formattedVariation = (0, exports.parseVariation)(variacion);
    const parsedName = exports.nameParser[name];
    const avg = (0, exports.calculateAvg)(compra, venta);
    const movimiento = formattedVariation === 0
        ? "se mantuvo"
        : formattedVariation < 0
            ? `bajo 📉`
            : "aumento 📈";
    return `El ${parsedName} ${movimiento}
Variacion con ultimo cierre: ${variacion}
${valorCierreAnt && `Valor venta cierre anterior: ${valorCierreAnt}`}
Compra: ${compra}
Venta: ${venta}
Promedio: ${avg}
Ultima actualizacion: ${fecha}`;
};
exports.formatRateToMessage = formatRateToMessage;
const parseData = (data, name) => {
    return Object.assign(Object.assign({}, data), { valorCierreAnt: data.valor_cierre_ant, name });
};
exports.parseData = parseData;
const calculateAvg = (compra, venta) => {
    const compraParsed = parseFloat(compra);
    const ventaParsed = parseFloat(venta);
    return ((compraParsed + ventaParsed) / 2).toFixed(2).toString();
};
exports.calculateAvg = calculateAvg;
exports.GREETING_MESSAGE = `Hola! Los comandos disponibles son los siguientes:
  /dolar: Para recibir el valor del dolar
  /subscribe: para recibir una actualizacion cada 10min durante horario de mercado
  /unsubscribe: para dejar de recibir actualizaciones`;
const getGreetingMessage = (userName) => {
    return `Hola ${userName}! Los comandos disponibles son los siguientes:
  /dolar para recibir valor del dolar blue
  /dolar_oficial para recibir valor del dolar oficial
  /euro para recibir valor del euro blue
  /euro_oficial para recibir valor del euro oficial
  /subscribe para recibir actualizacion de la moneda que desee
  /unsubscribe para dejar de recibir actualizaciones de la moneda que desee
  /start para recibir nuevamente este mensaje`;
};
exports.getGreetingMessage = getGreetingMessage;
//# sourceMappingURL=formater.js.map