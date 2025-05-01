import { Logger, LogMetadata } from "./types";

class ClientLogger implements Logger {
  debug(message: string, metadata?: LogMetadata): void {
    if (process.env.NODE_ENV === "development") {
      console.debug("[CLIENT]", message, metadata);
    }
  }

  info(message: string, metadata?: LogMetadata): void {
    if (process.env.NODE_ENV === "development") {
      console.info("[CLIENT]", message, metadata);
    }
  }

  warn(message: string, metadata?: LogMetadata): void {
    console.warn("[CLIENT]", message, metadata);
  }

  error(message: string, error?: Error, metadata?: LogMetadata): void {
    const errorMetadata = error
      ? {
          ...metadata,
          errorMessage: error.message,
          stack: error.stack,
        }
      : metadata;

    console.error("[CLIENT]", message, errorMetadata);

    // プロダクション環境では、エラーを監視サービスに送信することもできます
    if (process.env.NODE_ENV === "production") {
      // 例: Sentry.captureException(error);
    }
  }
}

export const clientLogger = new ClientLogger();
