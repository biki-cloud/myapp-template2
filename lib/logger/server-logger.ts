import { Logger, LogLevel, LogMetadata } from "./types";

class ServerLogger implements Logger {
  private formatMessage(
    level: LogLevel,
    message: string,
    metadata?: LogMetadata
  ): string {
    const timestamp = new Date().toISOString();
    const metadataStr = metadata ? ` ${JSON.stringify(metadata)}` : "";
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${metadataStr}`;
  }

  debug(message: string, metadata?: LogMetadata): void {
    if (process.env.NODE_ENV === "development") {
      console.debug(this.formatMessage("debug", message, metadata));
    }
  }

  info(message: string, metadata?: LogMetadata): void {
    console.info(this.formatMessage("info", message, metadata));
  }

  warn(message: string, metadata?: LogMetadata): void {
    console.warn(this.formatMessage("warn", message, metadata));
  }

  error(message: string, error?: Error, metadata?: LogMetadata): void {
    const errorMetadata = error
      ? {
          ...metadata,
          errorMessage: error.message,
          stack: error.stack,
        }
      : metadata;
    console.error(this.formatMessage("error", message, errorMetadata));
  }
}

export const serverLogger = new ServerLogger();
