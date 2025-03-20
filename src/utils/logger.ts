/**
 * Simple class for console logging
 */
export class Logger {
  private readonly prefix: string;
  private readonly isDebug: boolean;

  /**
   * Creates a new logger instance
   * @param prefix Prefix for all messages
   * @param debug Whether debug mode is enabled
   */
  constructor(prefix: string = 'Intmen-lib', debug: boolean = false) {
    this.prefix = prefix;
    this.isDebug = debug;
  }

  /**
   * Displays an information message
   * @param message Message to display
   */
  public info(message: string): void {
    console.log(`[${this.prefix}] [INFO] ${message}`);
  }

  /**
   * Displays a warning
   * @param message Warning message
   */
  public warn(message: string): void {
    console.warn(`[${this.prefix}] [WARN] ${message}`);
  }

  /**
   * Displays an error
   * @param message Error message
   * @param error Error object (optional)
   */
  public error(message: string, error?: Error | unknown): void {
    console.error(`[${this.prefix}] [ERROR] ${message}`);
    if (error) {
      console.error(error);
    }
  }

  /**
   * Displays a debug message (only if debug mode is enabled)
   * @param message Debug message
   */
  public debug(message: string): void {
    if (this.isDebug) {
      console.debug(`[${this.prefix}] [DEBUG] ${message}`);
    }
  }
} 