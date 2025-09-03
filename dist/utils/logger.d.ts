/**
 * Log levels for determining which messages to show
 */
export declare enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3,
    NONE = 4
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
export declare class Logger {
    private readonly prefix;
    private readonly level;
    private readonly useColors;
    private readonly timestamps;
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
    constructor(optionsOrPrefix?: LoggerOptions | string, debug?: boolean);
    /**
     * Creates a timestamp string
     * @returns Formatted timestamp
     */
    private getTimestamp;
    /**
     * Format a log message with appropriate styling
     * @param level Log level identifier
     * @param color Color to use
     * @param message Message to format
     * @returns Formatted message
     */
    private formatMessage;
    /**
     * Displays an information message
     * @param message Message to display
     * @param data Additional data to log
     */
    info(message: string, data?: unknown): void;
    /**
     * Displays a warning
     * @param message Warning message
     * @param data Additional data to log
     */
    warn(message: string, data?: unknown): void;
    /**
     * Displays an error
     * @param message Error message
     * @param error Error object or additional data
     */
    error(message: string, error?: Error | unknown): void;
    /**
     * Displays a debug message
     * @param message Debug message
     * @param data Additional data to log
     */
    debug(message: string, data?: unknown): void;
    /**
     * Creates a new logger with the same settings but a different prefix
     * @param prefix New prefix to use
     * @returns New Logger instance
     */
    createChild(prefix: string): Logger;
    /**
     * Creates a new logger with a specific log level
     * @param level Log level to use
     * @returns New Logger instance
     */
    withLevel(level: LogLevel): Logger;
}
