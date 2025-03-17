"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
/**
 * Simple class for console logging
 */
class Logger {
    /**
     * Creates a new logger instance
     * @param prefix Prefix for all messages
     * @param debug Whether debug mode is enabled
     */
    constructor(prefix = 'Intmen-lib', debug = false) {
        this.prefix = prefix;
        this.isDebug = debug;
    }
    /**
     * Displays an information message
     * @param message Message to display
     */
    info(message) {
        console.log(`[${this.prefix}] [INFO] ${message}`);
    }
    /**
     * Displays a warning
     * @param message Warning message
     */
    warn(message) {
        console.warn(`[${this.prefix}] [WARN] ${message}`);
    }
    /**
     * Displays an error
     * @param message Error message
     * @param error Error object (optional)
     */
    error(message, error) {
        console.error(`[${this.prefix}] [ERROR] ${message}`);
        if (error) {
            console.error(error);
        }
    }
    /**
     * Displays a debug message (only if debug mode is enabled)
     * @param message Debug message
     */
    debug(message) {
        if (this.isDebug) {
            console.debug(`[${this.prefix}] [DEBUG] ${message}`);
        }
    }
}
exports.Logger = Logger;
