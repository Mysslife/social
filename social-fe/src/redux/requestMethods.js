import axios from "axios";

const BASE_URL = "http://localhost:8800/api";

let TOKEN;
const user = JSON.parse(localStorage.getItem("socialUser"));
TOKEN = user ? user.accessToken : "";

export const publicRequest = axios.create({
  baseURL: BASE_URL,
});

export const userRequest = axios.create({
  baseURL: BASE_URL,
  headers: { token: `Bearer ${TOKEN}` },
});
