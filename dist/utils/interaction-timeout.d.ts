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
}
/**
 * Handle potential timeouts for interactions
 * @param promise The promise that should resolve before timeout
 * @param interaction The Discord interaction
 * @param options Timeout options
 * @returns Promise resolving with the original promise result
 */
export declare function withTimeout<T>(promise: Promise<T>, interaction: Interaction, options: TimeoutOptions): Promise<T>;
