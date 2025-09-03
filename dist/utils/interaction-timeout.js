"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteractionTimeoutError = void 0;
exports.canReply = canReply;
exports.withTimeout = withTimeout;
exports.withTimeoutHandler = withTimeoutHandler;
exports.createTimeoutController = createTimeoutController;
const logger_1 = require("./logger");
const logger = new logger_1.Logger({ prefix: 'InteractionTimeout' });
/**
 * Error thrown when an interaction times out
 */
class InteractionTimeoutError extends Error {
    constructor(interaction, timeoutMs) {
        super(`Interaction ${interaction.id} timed out after ${timeoutMs}ms`);
        this.name = 'InteractionTimeoutError';
        this.interaction = interaction;
        this.timeoutMs = timeoutMs;
    }
}
exports.InteractionTimeoutError = InteractionTimeoutError;
/**
 * Check if an interaction can be replied to
 */
function canReply(interaction) {
    if (!interaction)
        return false;
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
    if (!isRepliable)
        return false;
    // Check if interaction has already been replied to
    const repliableInteraction = interaction;
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
async function withTimeout(promise, interaction, options) {
    const { timeout, timeoutMessage, ephemeral = true, onTimeout } = options;
    // Create a timeout promise and keep track of the timer so we can clear it
    let timeoutId;
    const timeoutPromise = new Promise((_, reject) => {
        timeoutId = setTimeout(() => {
            reject(new InteractionTimeoutError(interaction, timeout));
        }, timeout);
    });
    try {
        // Race the original promise against the timeout
        return await Promise.race([promise, timeoutPromise]);
    }
    catch (error) {
        if (error instanceof InteractionTimeoutError) {
            logger.debug(`Interaction timed out after ${timeout}ms`);
            // Execute the optional timeout callback
            if (onTimeout) {
                try {
                    await onTimeout(interaction);
                }
                catch (callbackError) {
                    logger.error('Error in timeout callback', callbackError);
                }
            }
            // Only try to respond if the interaction can be replied to
            try {
                const interactionObj = interaction;
                if (canReply(interactionObj)) {
                    // Cast to the appropriate repliable interaction type
                    const repliableInteraction = interactionObj;
                    await repliableInteraction.reply({
                        content: timeoutMessage,
                        ephemeral
                    });
                }
            }
            catch (replyError) {
                logger.error('Failed to send timeout message', replyError);
            }
            throw error; // Re-throw the timeout error for the caller to handle
        }
        throw error; // Re-throw other errors
    }
    finally {
        if (timeoutId)
            clearTimeout(timeoutId);
    }
}
/**
 * Wraps an interaction handler with timeout protection
 * @param handler The interaction handler function
 * @param options Timeout options
 * @returns Wrapped handler function with timeout protection
 */
function withTimeoutHandler(handler, options) {
    return async (interaction) => {
        await withTimeout(handler(interaction), interaction, options);
    };
}
/**
 * Creates an abort controller that will automatically abort after the specified timeout
 * @param timeoutMs Timeout in milliseconds
 * @returns AbortController with automatic timeout
 */
function createTimeoutController(timeoutMs) {
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
