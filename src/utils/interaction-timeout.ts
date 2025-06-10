import { Interaction, InteractionType, RepliableInteraction, CommandInteraction, ButtonInteraction, SelectMenuInteraction, ModalSubmitInteraction, ContextMenuCommandInteraction, AutocompleteInteraction } from 'discord.js';
import { Logger } from './logger';

const logger = new Logger({ prefix: 'InteractionTimeout' });

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
export class InteractionTimeoutError extends Error {
  public readonly interaction: Interaction;
  public readonly timeoutMs: number;

  constructor(interaction: Interaction, timeoutMs: number) {
    super(`Interaction ${interaction.id} timed out after ${timeoutMs}ms`);
    this.name = 'InteractionTimeoutError';
    this.interaction = interaction;
    this.timeoutMs = timeoutMs;
  }
}

/**
 * Check if an interaction can be replied to
 */
export function canReply(interaction: Interaction): boolean {
  if (!interaction) return false;
  
  // AutocompleteInteraction doesn't have a reply method, so we need to check
  // if it's not an autocomplete interaction
  if (interaction.isAutocomplete()) {
    return false;
  }
  
  // Check if the interaction has the reply method
  const isRepliable = interaction.isCommand() || 
    interaction.isContextMenuCommand() || 
    interaction.isButton() || 
    interaction.isSelectMenu() || 
    interaction.isModalSubmit();
  
  if (!isRepliable) return false;
  
  // Check if interaction has already been replied to
  const repliableInteraction = interaction as RepliableInteraction;
  const isReplied = repliableInteraction.replied === true;
  const isDeferred = repliableInteraction.deferred === true;
  
  // Check if the interaction has expired
  const hasExpired = Date.now() - interaction.createdAt.getTime() > 15 * 60 * 1000; // 15 minutes
  
  return !isReplied && !isDeferred && !hasExpired;
}

/**
 * Handle potential timeouts for interactions
 * @param promise The promise that should resolve before timeout
 * @param interaction The Discord interaction
 * @param options Timeout options
 * @returns Promise resolving with the original promise result
 */
export async function withTimeout<T, I>(
  promise: Promise<T>,
  interaction: I,
  options: TimeoutOptions
): Promise<T> {
  const { timeout, timeoutMessage, ephemeral = true, onTimeout } = options;
  
  // Create a timeout promise and keep track of the timer so we can clear it
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new InteractionTimeoutError(interaction as unknown as Interaction, timeout));
    }, timeout);
  });

  try {
    // Race the original promise against the timeout
    return await Promise.race([promise, timeoutPromise]);
  } catch (error) {
    if (error instanceof InteractionTimeoutError) {
      logger.debug(`Interaction timed out after ${timeout}ms`);
      
      // Execute the optional timeout callback
      if (onTimeout) {
        try {
          await onTimeout(interaction as any);
        } catch (callbackError) {
          logger.error('Error in timeout callback', callbackError);
        }
      }
      
      // Only try to respond if the interaction can be replied to
      try {
        const interactionObj = interaction as unknown as Interaction;
        if (canReply(interactionObj)) {
          // Cast to the appropriate repliable interaction type
          const repliableInteraction = interactionObj as unknown as RepliableInteraction;
          await repliableInteraction.reply({
            content: timeoutMessage,
            ephemeral
          });
        }
      } catch (replyError) {
        logger.error('Failed to send timeout message', replyError);
      }
      
      throw error; // Re-throw the timeout error for the caller to handle
    }
    throw error; // Re-throw other errors
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

/**
 * Wraps an interaction handler with timeout protection
 * @param handler The interaction handler function
 * @param options Timeout options
 * @returns Wrapped handler function with timeout protection
 */
export function withTimeoutHandler<T extends Interaction>(
  handler: (interaction: T) => Promise<void>,
  options: TimeoutOptions
): (interaction: T) => Promise<void> {
  return async (interaction: T) => {
    await withTimeout(handler(interaction), interaction, options);
  };
}

/**
 * Creates an abort controller that will automatically abort after the specified timeout
 * @param timeoutMs Timeout in milliseconds
 * @returns AbortController with automatic timeout
 */
export function createTimeoutController(timeoutMs: number): AbortController {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  // Add a cleanup method to clear the timeout
  const originalAbort = controller.abort.bind(controller);
  controller.abort = () => {
    clearTimeout(timeoutId);
    return originalAbort();
  };
  
  return controller;
}
