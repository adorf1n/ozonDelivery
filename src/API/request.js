import ky from "ky";

const url = ky.create({ prefixUrl: import.meta.env.VITE_MSSQL_API });

export const getTownList = async () => {
  return await url.get("townlist").json();
};

export const getTownPrice = async (TownID) => {
  return await url.get(`pricelist/${TownID}`).json();
};
