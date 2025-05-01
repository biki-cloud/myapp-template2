import { Logger } from "./types";
import { serverLogger } from "./server-logger";
import { clientLogger } from "./client-logger";

export const logger: Logger =
  typeof window === "undefined" ? serverLogger : clientLogger;

export * from "./types";
