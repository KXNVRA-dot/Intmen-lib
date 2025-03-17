/**
 * Simple class for console logging
 */
export declare class Logger {
    private readonly prefix;
    private readonly isDebug;
    /**
     * Creates a new logger instance
     * @param prefix Prefix for all messages
     * @param debug Whether debug mode is enabled
     */
    constructor(prefix?: string, debug?: boolean);
    /**
     * Displays an information message
     * @param message Message to display
     */
    info(message: string): void;
    /**
     * Displays a warning
     * @param message Warning message
     */
    warn(message: string): void;
    /**
     * Displays an error
     * @param message Error message
     * @param error Error object (optional)
     */
    error(message: string, error?: any): void;
    /**
     * Displays a debug message (only if debug mode is enabled)
     * @param message Debug message
     */
    debug(message: string): void;
}
