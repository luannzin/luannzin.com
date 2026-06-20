import axios from "axios";

export const client_api = axios.create({
  baseURL: "/",
});
