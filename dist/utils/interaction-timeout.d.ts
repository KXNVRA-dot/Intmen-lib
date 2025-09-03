import { Interaction } from 'discord.js';
/**
 * Options for interaction timeout handling
 */
export interface TimeoutOptions {
    /** Maximum time to wait in milliseconds */
    timeout: number;
    /** Message to show when timing out */
    timeoutMessage: string;
    /** Whether the timeout message should be ephemeral */
    ephemeral?: boolean;
    /** Optional callback function to execute on timeout */
    onTimeout?: (interaction: Interaction) => Promise<void> | void;
}
/**
 * Error thrown when an interaction times out
 */
export declare class InteractionTimeoutError extends Error {
    readonly interaction: Interaction;
    readonly timeoutMs: number;
    constructor(interaction: Interaction, timeoutMs: number);
}
/**
 * Check if an interaction can be replied to
 */
export declare function canReply(interaction: Interaction): boolean;
/**
 * Handle potential timeouts for interactions
 * @param promise The promise that should resolve before timeout
 * @param interaction The Discord interaction
 * @param options Timeout options
 * @returns Promise resolving with the original promise result
 */
export declare function withTimeout<T>(promise: Promise<T>, interaction: unknown, options: TimeoutOptions): Promise<T>;
/**
 * Wraps an interaction handler with timeout protection
 * @param handler The interaction handler function
 * @param options Timeout options
 * @returns Wrapped handler function with timeout protection
 */
export declare function withTimeoutHandler<T extends Interaction>(handler: (interaction: T) => Promise<void>, options: TimeoutOptions): (interaction: T) => Promise<void>;
/**
 * Creates an abort controller that will automatically abort after the specified timeout
 * @param timeoutMs Timeout in milliseconds
 * @returns AbortController with automatic timeout
 */
export declare function createTimeoutController(timeoutMs: number): AbortController;
