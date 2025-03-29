"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteractionValidators = void 0;
const discord_js_1 = require("discord.js");
const permissions_1 = require("./permissions");
/**
 * Collection of utility functions for validating interactions
 */
class InteractionValidators {
    /**
     * Checks if an interaction was initiated by a specific user
     * @param interaction The interaction to check
     * @param userId The user ID to check against
     * @returns True if the interaction was initiated by the specified user
     */
    static isFromUser(interaction, userId) {
        return interaction.user.id === userId;
    }
    /**
     * Checks if an interaction was initiated by one of the specified users
     * @param interaction The interaction to check
     * @param userIds Array of user IDs to check against
     * @returns True if the interaction was initiated by one of the specified users
     */
    static isFromAnyUser(interaction, userIds) {
        return userIds.includes(interaction.user.id);
    }
    /**
     * Checks if an interaction was initiated in a specific channel
     * @param interaction The interaction to check
     * @param channelId The channel ID to check against
     * @returns True if the interaction was initiated in the specified channel
     */
    static isInChannel(interaction, channelId) {
        return interaction.channelId === channelId;
    }
    /**
     * Checks if an interaction was initiated in a guild (server)
     * @param interaction The interaction to check
     * @returns True if the interaction was initiated in a guild
     */
    static isInGuild(interaction) {
        return interaction.inGuild();
    }
    /**
     * Checks if the user has the specified permissions in the current channel
     * @param interaction The interaction to check
     * @param permissions The permissions to check for
     * @returns True if the user has the specified permissions
     */
    static hasPermissions(interaction, permissions) {
        if (!interaction.inGuild() || !(interaction.member instanceof discord_js_1.GuildMember)) {
            return false;
        }
        return permissions_1.PermissionUtils.hasPermission(interaction.member, permissions);
    }
    /**
     * Checks if the interaction is from the bot owner
     * @param interaction The interaction to check
     * @param ownerId The bot owner's user ID
     * @returns True if the interaction is from the bot owner
     */
    static isFromOwner(interaction, ownerId) {
        return interaction.user.id === ownerId;
    }
    /**
     * Checks if the interaction should continue based on a custom condition
     * @param interaction The interaction to check
     * @param condition Function that validates the interaction
     * @returns The result of the condition function
     */
    static custom(interaction, condition) {
        return condition(interaction);
    }
    /**
     * Validates multiple conditions and returns true if all pass
     * @param interaction The interaction to check
     * @param validators Array of validator functions that each return boolean
     * @returns True if all validators return true
     */
    static all(interaction, validators) {
        return validators.every(validator => validator(interaction));
    }
    /**
     * Validates multiple conditions and returns true if any pass
     * @param interaction The interaction to check
     * @param validators Array of validator functions that each return boolean
     * @returns True if any validator returns true
     */
    static any(interaction, validators) {
        return validators.some(validator => validator(interaction));
    }
    /**
     * Checks if the interaction is a chat input command (slash command)
     * @param interaction The interaction to check
     * @returns True if the interaction is a chat input command
     */
    static isChatInputCommand(interaction) {
        return interaction.isChatInputCommand();
    }
    /**
     * Checks if the interaction is a user context menu command
     * @param interaction The interaction to check
     * @returns True if the interaction is a user context menu command
     */
    static isUserContextMenuCommand(interaction) {
        return interaction.isUserContextMenuCommand();
    }
    /**
     * Checks if the interaction is a message context menu command
     * @param interaction The interaction to check
     * @returns True if the interaction is a message context menu command
     */
    static isMessageContextMenuCommand(interaction) {
        return interaction.isMessageContextMenuCommand();
    }
    /**
     * Checks if the interaction is any type of context menu command
     * @param interaction The interaction to check
     * @returns True if the interaction is a context menu command (either user or message)
     */
    static isContextMenuCommand(interaction) {
        return interaction.isUserContextMenuCommand() || interaction.isMessageContextMenuCommand();
    }
    /**
     * Checks if the interaction is a button interaction
     * @param interaction The interaction to check
     * @returns True if the interaction is a button interaction
     */
    static isButton(interaction) {
        return interaction.isButton();
    }
    /**
     * Checks if the interaction is a select menu interaction
     * @param interaction The interaction to check
     * @returns True if the interaction is a select menu interaction
     */
    static isSelectMenu(interaction) {
        return interaction.isSelectMenu();
    }
    /**
     * Checks if the interaction is a modal submit interaction
     * @param interaction The interaction to check
     * @returns True if the interaction is a modal submit interaction
     */
    static isModalSubmit(interaction) {
        return interaction.isModalSubmit();
    }
    /**
     * Checks if the interaction is a deferred interaction
     * @param interaction The interaction to check (must be repliable)
     * @returns True if the interaction is already deferred
     */
    static isDeferred(interaction) {
        return interaction.deferred;
    }
    /**
     * Checks if the interaction is already replied to
     * @param interaction The interaction to check (must be repliable)
     * @returns True if the interaction is already replied to
     */
    static isReplied(interaction) {
        return interaction.replied;
    }
}
exports.InteractionValidators = InteractionValidators;
