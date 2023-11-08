export const TIMEZONE = "America/Buenos_Aires";

export const getLocalTimeString = () => {
  return new Date().toLocaleTimeString("es-AR", { timeZone: TIMEZONE });
};
