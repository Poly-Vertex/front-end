import axios from "axios";
import { apiCacheTime } from "./apiCacheTime";

const endpoints = {
  coingecko: "https://api.coingecko.com/api/v3/simple/price",
  tokens: "https://api.beefy.finance/prices",
  lps: "https://api.beefy.finance/lps",
};

const CACHE_TIMEOUT = 5 * 60 * 1000;
const cache = {};

function isCached({ oracle, id }) {
  if (`${oracle}-${id}` in cache) {
    return cache[`${oracle}-${id}`].t + CACHE_TIMEOUT > Date.now();
  }
  return false;
}

function getCachedPrice({ oracle, id }) {
  return cache[`${oracle}-${id}`].price;
}

function addToCache({ oracle, id, price }) {
  cache[`${oracle}-${id}`] = { price: price, t: Date.now() };
}

const fetchCoingecko = async id => {
  try {
    const response = await axios.get(endpoints.coingecko, {
      params: { ids: id, vs_currencies: "usd" },
    });
    return response.data[id].usd;
  } catch (err) {
    console.error(err);
    return 0;
  }
};

const fetchTokens = async id => {
  try {
    const response = await axios.get(`https://api.beefy.finance/prices?_=${apiCacheTime()}`);
    return response.data[id];
  } catch (err) {
    console.error(err);
    return 0;
  }
};

const fetchLP = async (id) => {
  try {
    const response = await axios.get(`https://api.beefy.finance/lps?_=${apiCacheTime()}`);
    return response.data[id];
  } catch (err) {
    console.error(err);
    return 0;
  }
};

export const fetchPrice = async ({ oracle, id }) => {
  if (oracle === undefined) {
    console.error("Undefined oracle");
    return 0;
  }
  if (id === undefined) {
    console.error("Undefined pair");
    return 0;
  }

  if (isCached({ oracle, id })) {
    return getCachedPrice({ oracle, id });
  }

  let price = 0;
  switch (oracle) {
    case "coingecko":
      price = await fetchCoingecko(id);
      break;

    case "tokens":
      price = await fetchTokens(id);
      break;

    case 'lps':
      price = await fetchLP(id);
      break;

    default: price = 0;
  }

  addToCache({ oracle, id, price });
  return price;
};
