import { Interaction, InteractionType, RepliableInteraction } from 'discord.js';
import { Logger } from './logger';

const logger = new Logger('InteractionTimeout');

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
 * Check if an interaction can be replied to
 */
function canReply(interaction: Interaction): boolean {
  if (!interaction) return false;
  
  // AutocompleteInteraction doesn't have a reply method, so we need to check
  // if it's not an autocomplete interaction
  if (interaction.type === InteractionType.ApplicationCommandAutocomplete) {
    return false;
  }
  
  // Check if the interaction has the reply method
  const hasReplyMethod = 'reply' in interaction && typeof interaction.reply === 'function';
  
  // Check if interaction has already been replied to
  const isReplied = 'replied' in interaction && 
    (interaction as { replied?: boolean }).replied === true;
  
  // Check if interaction is deferred
  const isDeferred = 'deferred' in interaction && 
    (interaction as { deferred?: boolean }).deferred === true;
  
  return hasReplyMethod && !isReplied && !isDeferred;
}

/**
 * Handle potential timeouts for interactions
 * @param promise The promise that should resolve before timeout
 * @param interaction The Discord interaction
 * @param options Timeout options
 * @returns Promise resolving with the original promise result
 */
export async function withTimeout<T>(
  promise: Promise<T>,
  interaction: Interaction,
  options: TimeoutOptions
): Promise<T> {
  const { timeout, timeoutMessage, ephemeral = true } = options;
  
  // Create a timeout promise
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(new Error('TIMEOUT'));
    }, timeout);
  });

  try {
    // Race the original promise against the timeout
    return await Promise.race([promise, timeoutPromise]);
  } catch (error) {
    if (error instanceof Error && error.message === 'TIMEOUT') {
      logger.debug(`Interaction ${interaction.id} timed out after ${timeout}ms`);
      
      // Only try to respond if the interaction can be replied to
      try {
        if (canReply(interaction)) {
          if (interaction.type === InteractionType.ApplicationCommandAutocomplete) {
            // Autocomplete interactions can't show timeout messages
            // They only accept specific response format for autocomplete suggestions
            logger.debug('Cannot send timeout message to autocomplete interaction');
          } else {
            // For all other interaction types that have a reply method
            await (interaction as RepliableInteraction).reply({
              content: timeoutMessage,
              ephemeral
            });
          }
        }
      } catch (replyError) {
        logger.error('Failed to send timeout message', replyError);
      }
      
      throw new Error(`Interaction timed out after ${timeout}ms`);
    }
    throw error;
  }
}
