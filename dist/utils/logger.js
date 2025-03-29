"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = exports.LogLevel = void 0;
/**
 * Log levels for determining which messages to show
 */
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["DEBUG"] = 0] = "DEBUG";
    LogLevel[LogLevel["INFO"] = 1] = "INFO";
    LogLevel[LogLevel["WARN"] = 2] = "WARN";
    LogLevel[LogLevel["ERROR"] = 3] = "ERROR";
    LogLevel[LogLevel["NONE"] = 4] = "NONE"; // Disable all logging
})(LogLevel || (exports.LogLevel = LogLevel = {}));
/**
 * Color codes for terminal output
 */
var LogColor;
(function (LogColor) {
    LogColor["RESET"] = "\u001B[0m";
    LogColor["BRIGHT"] = "\u001B[1m";
    LogColor["DIM"] = "\u001B[2m";
    LogColor["RED"] = "\u001B[31m";
    LogColor["GREEN"] = "\u001B[32m";
    LogColor["YELLOW"] = "\u001B[33m";
    LogColor["BLUE"] = "\u001B[34m";
    LogColor["MAGENTA"] = "\u001B[35m";
    LogColor["CYAN"] = "\u001B[36m";
    LogColor["WHITE"] = "\u001B[37m";
    LogColor["GRAY"] = "\u001B[90m";
})(LogColor || (LogColor = {}));
/**
 * Enhanced logger class for console logging
 */
class Logger {
    /**
     * Creates a new logger instance
     * @param options Logger options or prefix string
     */
    constructor(options = {}) {
        // Handle string as prefix (for backward compatibility)
        if (typeof options === 'string') {
            this.prefix = options;
            this.level = LogLevel.INFO;
            this.useColors = true;
            this.timestamps = true;
        }
        else {
            this.prefix = options.prefix || 'Intmen-lib';
            this.level = options.level !== undefined ? options.level :
                (options.level === LogLevel.DEBUG ? LogLevel.DEBUG : LogLevel.INFO);
            this.useColors = options.useColors !== undefined ? options.useColors : true;
            this.timestamps = options.timestamps !== undefined ? options.timestamps : true;
        }
    }
    /**
     * Creates a timestamp string
     * @returns Formatted timestamp
     */
    getTimestamp() {
        if (!this.timestamps)
            return '';
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
    formatMessage(level, color, message) {
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
    info(message, data) {
        if (this.level <= LogLevel.INFO) {
            console.log(this.formatMessage('INFO', LogColor.GREEN, message));
            if (data !== undefined)
                console.log(data);
        }
    }
    /**
     * Displays a warning
     * @param message Warning message
     * @param data Additional data to log
     */
    warn(message, data) {
        if (this.level <= LogLevel.WARN) {
            console.warn(this.formatMessage('WARN', LogColor.YELLOW, message));
            if (data !== undefined)
                console.warn(data);
        }
    }
    /**
     * Displays an error
     * @param message Error message
     * @param error Error object or additional data
     */
    error(message, error) {
        if (this.level <= LogLevel.ERROR) {
            console.error(this.formatMessage('ERROR', LogColor.RED, message));
            if (error !== undefined) {
                if (error instanceof Error) {
                    console.error(`${error.name}: ${error.message}`);
                    if (error.stack)
                        console.error(error.stack);
                }
                else {
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
    debug(message, data) {
        if (this.level <= LogLevel.DEBUG) {
            console.debug(this.formatMessage('DEBUG', LogColor.GRAY, message));
            if (data !== undefined)
                console.debug(data);
        }
    }
    /**
     * Creates a new logger with the same settings but a different prefix
     * @param prefix New prefix to use
     * @returns New Logger instance
     */
    createChild(prefix) {
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
    withLevel(level) {
        return new Logger({
            prefix: this.prefix,
            level,
            useColors: this.useColors,
            timestamps: this.timestamps
        });
    }
}
exports.Logger = Logger;
