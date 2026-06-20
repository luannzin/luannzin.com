import axios from "axios";

export const ssr_api = axios.create({
  baseURL: "/",
});
