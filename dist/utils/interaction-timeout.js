"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withTimeout = withTimeout;
const discord_js_1 = require("discord.js");
const logger_1 = require("./logger");
const logger = new logger_1.Logger('InteractionTimeout');
/**
 * Check if an interaction can be replied to
 */
function canReply(interaction) {
    if (!interaction)
        return false;
    // AutocompleteInteraction doesn't have a reply method, so we need to check
    // if it's not an autocomplete interaction
    if (interaction.type === discord_js_1.InteractionType.ApplicationCommandAutocomplete) {
        return false;
    }
    // Check if the interaction has the reply method
    const hasReplyMethod = 'reply' in interaction && typeof interaction.reply === 'function';
    // Check if interaction has already been replied to
    const isReplied = 'replied' in interaction &&
        interaction.replied === true;
    // Check if interaction is deferred
    const isDeferred = 'deferred' in interaction &&
        interaction.deferred === true;
    return hasReplyMethod && !isReplied && !isDeferred;
}
/**
 * Handle potential timeouts for interactions
 * @param promise The promise that should resolve before timeout
 * @param interaction The Discord interaction
 * @param options Timeout options
 * @returns Promise resolving with the original promise result
 */
async function withTimeout(promise, interaction, options) {
    const { timeout, timeoutMessage, ephemeral = true } = options;
    // Create a timeout promise
    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
            reject(new Error('TIMEOUT'));
        }, timeout);
    });
    try {
        // Race the original promise against the timeout
        return await Promise.race([promise, timeoutPromise]);
    }
    catch (error) {
        if (error instanceof Error && error.message === 'TIMEOUT') {
            logger.debug(`Interaction ${interaction.id} timed out after ${timeout}ms`);
            // Only try to respond if the interaction can be replied to
            try {
                if (canReply(interaction)) {
                    if (interaction.type === discord_js_1.InteractionType.ApplicationCommandAutocomplete) {
                        // Autocomplete interactions can't show timeout messages
                        // They only accept specific response format for autocomplete suggestions
                        logger.debug('Cannot send timeout message to autocomplete interaction');
                    }
                    else {
                        // For all other interaction types that have a reply method
                        await interaction.reply({
                            content: timeoutMessage,
                            ephemeral
                        });
                    }
                }
            }
            catch (replyError) {
                logger.error('Failed to send timeout message', replyError);
            }
            throw new Error(`Interaction timed out after ${timeout}ms`);
        }
        throw error;
    }
}
