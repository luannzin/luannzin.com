import { client_api } from "./client";
import { ssr_api } from "./server";

const api = typeof window !== "undefined" ? client_api : ssr_api;

export { api };
