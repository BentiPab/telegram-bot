import { RateType, RatesNameValue, RatesNamesParsed } from "../model";
import { IRate } from "../mongo/models/rate";
export declare const parseVariation: (variation: string) => number;
export declare const nameParser: {
    [k in RatesNameValue]: RatesNamesParsed;
};
export declare const getInlineKeyboardOptions: (import("@telegraf/types").InlineKeyboardButton.CallbackButton & {
    hide: boolean;
})[][];
export declare const getNamesParsedArray: RatesNamesParsed[];
export declare const formatRateToMessage: (data: IRate) => string;
export declare const parseData: (data: RateType, name: string) => IRate;
export declare const calculateAvg: (compra: string, venta: string) => string;
export declare const GREETING_MESSAGE = "Hola! Los comandos disponibles son los siguientes:\n  /dolar: Para recibir el valor del dolar\n  /subscribe: para recibir una actualizacion cada 10min durante horario de mercado\n  /unsubscribe: para dejar de recibir actualizaciones";
export declare const getGreetingMessage: (userName: string) => string;
