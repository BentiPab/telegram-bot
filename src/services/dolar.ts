import axios from "axios";
const url = "https://mercados.ambito.com//dolar/informal/variacion";
const ONE_MINUTE_MS = 1000 * 60;
const TEN_MINUTES_MS = ONE_MINUTE_MS * 10;
type ResType = { compra: string; venta: string; fecha: string };

export const getDollarRate = async () => {
  const dolarData = await fetchData();
  return formatData(dolarData);
};

const fetchData = async () => {
  const res = await axios.get<ResType>(url);
  return res.data;
};

const formatData = (data: ResType) => {
  const { compra, venta, fecha } = data;
  const avg = (parseInt(compra) + parseInt(venta)) / 2;
  return `Compra: ${compra} | Venta: ${venta} | Promedio: ${avg} | Fecha: ${fecha}`;
};
