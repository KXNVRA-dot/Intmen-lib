/**
 * Log levels for determining which messages to show
 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  NONE = 4 // Disable all logging
}

/**
 * Color codes for terminal output
 */
enum LogColor {
  RESET = "\x1b[0m",
  BRIGHT = "\x1b[1m",
  DIM = "\x1b[2m",
  RED = "\x1b[31m",
  GREEN = "\x1b[32m",
  YELLOW = "\x1b[33m",
  BLUE = "\x1b[34m",
  MAGENTA = "\x1b[35m",
  CYAN = "\x1b[36m",
  WHITE = "\x1b[37m",
  GRAY = "\x1b[90m"
}

/**
 * Options for configuring the logger
 */
export interface LoggerOptions {
  /** The minimum log level to display */
  level?: LogLevel;
  /** Whether to use colors in console output */
  useColors?: boolean;
  /** Whether to include timestamps in log messages */
  timestamps?: boolean;
  /** Custom prefix to use for all messages */
  prefix?: string;
}

/**
 * Enhanced logger class for console logging
 */
export class Logger {
  private readonly prefix: string;
  private readonly level: LogLevel;
  private readonly useColors: boolean;
  private readonly timestamps: boolean;

  /**
   * Creates a new logger instance.
   *
   * The constructor supports both the original two argument form
   * `new Logger(prefix, debug)` and the newer options object form
   * `new Logger({ prefix, level })`.
   *
   * @param optionsOrPrefix Options object or prefix string
   * @param debug Whether debug logging should be enabled (only for prefix form)
   */
  constructor(optionsOrPrefix: LoggerOptions | string = {}, debug = false) {
    // Handle legacy signature where a prefix and optional debug flag are provided
    if (typeof optionsOrPrefix === 'string') {
      this.prefix = optionsOrPrefix;
      this.level = debug ? LogLevel.DEBUG : LogLevel.INFO;
      this.useColors = true;
      this.timestamps = true;
      return;
    }

    // Handle options object
    const options = optionsOrPrefix;
    this.prefix = options.prefix || 'Intmen-lib';
    this.level =
      options.level !== undefined
        ? options.level
        : LogLevel.INFO;
    this.useColors = options.useColors !== undefined ? options.useColors : true;
    this.timestamps = options.timestamps !== undefined ? options.timestamps : true;
  }

  /**
   * Creates a timestamp string
   * @returns Formatted timestamp
   */
  private getTimestamp(): string {
    if (!this.timestamps) return '';
    
    const now = new Date();
    return `[${now.toISOString()}] `;
  }

  /**
   * Format a log message with appropriate styling
   * @param level Log level identifier
   * @param color Color to use
   * @param message Message to format
   * @returns Formatted message
   */
  private formatMessage(level: string, color: LogColor, message: string): string {
    const timestamp = this.getTimestamp();
    
    if (this.useColors) {
      return `${timestamp}${color}[${this.prefix}] [${level}]${LogColor.RESET} ${message}`;
    }
    
    return `${timestamp}[${this.prefix}] [${level}] ${message}`;
  }

  /**
   * Displays an information message
   * @param message Message to display
   * @param data Additional data to log
   */
  public info(message: string, data?: any): void {
    if (this.level <= LogLevel.INFO) {
      console.log(this.formatMessage('INFO', LogColor.GREEN, message));
      if (data !== undefined) console.log(data);
    }
  }

  /**
   * Displays a warning
   * @param message Warning message
   * @param data Additional data to log
   */
  public warn(message: string, data?: any): void {
    if (this.level <= LogLevel.WARN) {
      console.warn(this.formatMessage('WARN', LogColor.YELLOW, message));
      if (data !== undefined) console.warn(data);
    }
  }

  /**
   * Displays an error
   * @param message Error message
   * @param error Error object or additional data
   */
  public error(message: string, error?: Error | unknown): void {
    if (this.level <= LogLevel.ERROR) {
      console.error(this.formatMessage('ERROR', LogColor.RED, message));
      if (error !== undefined) {
        if (error instanceof Error) {
          console.error(`${error.name}: ${error.message}`);
          if (error.stack) console.error(error.stack);
        } else {
          console.error(error);
        }
      }
    }
  }

  /**
   * Displays a debug message
   * @param message Debug message
   * @param data Additional data to log
   */
  public debug(message: string, data?: any): void {
    if (this.level <= LogLevel.DEBUG) {
      console.debug(this.formatMessage('DEBUG', LogColor.GRAY, message));
      if (data !== undefined) console.debug(data);
    }
  }

  /**
   * Creates a new logger with the same settings but a different prefix
   * @param prefix New prefix to use
   * @returns New Logger instance
   */
  public createChild(prefix: string): Logger {
    return new Logger({
      prefix: `${this.prefix}:${prefix}`,
      level: this.level,
      useColors: this.useColors,
      timestamps: this.timestamps
    });
  }

  /**
   * Creates a new logger with a specific log level
   * @param level Log level to use
   * @returns New Logger instance
   */
  public withLevel(level: LogLevel): Logger {
    return new Logger({
      prefix: this.prefix,
      level,
      useColors: this.useColors,
      timestamps: this.timestamps
    });
  }
}