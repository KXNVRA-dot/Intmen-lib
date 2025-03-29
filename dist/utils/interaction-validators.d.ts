import { ButtonInteraction, CommandInteraction, ChatInputCommandInteraction, MessageContextMenuCommandInteraction, UserContextMenuCommandInteraction, Interaction, ModalSubmitInteraction, SelectMenuInteraction } from 'discord.js';
/**
 * Collection of utility functions for validating interactions
 */
export declare class InteractionValidators {
    /**
     * Checks if an interaction was initiated by a specific user
     * @param interaction The interaction to check
     * @param userId The user ID to check against
     * @returns True if the interaction was initiated by the specified user
     */
    static isFromUser(interaction: Interaction, userId: string): boolean;
    /**
     * Checks if an interaction was initiated by one of the specified users
     * @param interaction The interaction to check
     * @param userIds Array of user IDs to check against
     * @returns True if the interaction was initiated by one of the specified users
     */
    static isFromAnyUser(interaction: Interaction, userIds: string[]): boolean;
    /**
     * Checks if an interaction was initiated in a specific channel
     * @param interaction The interaction to check
     * @param channelId The channel ID to check against
     * @returns True if the interaction was initiated in the specified channel
     */
    static isInChannel(interaction: Interaction, channelId: string): boolean;
    /**
     * Checks if an interaction was initiated in a guild (server)
     * @param interaction The interaction to check
     * @returns True if the interaction was initiated in a guild
     */
    static isInGuild(interaction: Interaction): boolean;
    /**
     * Checks if the user has the specified permissions in the current channel
     * @param interaction The interaction to check
     * @param permissions The permissions to check for
     * @returns True if the user has the specified permissions
     */
    static hasPermissions(interaction: Interaction, permissions: bigint | bigint[]): boolean;
    /**
     * Checks if the interaction is from the bot owner
     * @param interaction The interaction to check
     * @param ownerId The bot owner's user ID
     * @returns True if the interaction is from the bot owner
     */
    static isFromOwner(interaction: Interaction, ownerId: string): boolean;
    /**
     * Checks if the interaction should continue based on a custom condition
     * @param interaction The interaction to check
     * @param condition Function that validates the interaction
     * @returns The result of the condition function
     */
    static custom<T extends Interaction>(interaction: T, condition: (interaction: T) => boolean): boolean;
    /**
     * Validates multiple conditions and returns true if all pass
     * @param interaction The interaction to check
     * @param validators Array of validator functions that each return boolean
     * @returns True if all validators return true
     */
    static all<T extends Interaction>(interaction: T, validators: ((interaction: T) => boolean)[]): boolean;
    /**
     * Validates multiple conditions and returns true if any pass
     * @param interaction The interaction to check
     * @param validators Array of validator functions that each return boolean
     * @returns True if any validator returns true
     */
    static any<T extends Interaction>(interaction: T, validators: ((interaction: T) => boolean)[]): boolean;
    /**
     * Checks if the interaction is a chat input command (slash command)
     * @param interaction The interaction to check
     * @returns True if the interaction is a chat input command
     */
    static isChatInputCommand(interaction: Interaction): interaction is ChatInputCommandInteraction;
    /**
     * Checks if the interaction is a user context menu command
     * @param interaction The interaction to check
     * @returns True if the interaction is a user context menu command
     */
    static isUserContextMenuCommand(interaction: Interaction): interaction is UserContextMenuCommandInteraction;
    /**
     * Checks if the interaction is a message context menu command
     * @param interaction The interaction to check
     * @returns True if the interaction is a message context menu command
     */
    static isMessageContextMenuCommand(interaction: Interaction): interaction is MessageContextMenuCommandInteraction;
    /**
     * Checks if the interaction is any type of context menu command
     * @param interaction The interaction to check
     * @returns True if the interaction is a context menu command (either user or message)
     */
    static isContextMenuCommand(interaction: Interaction): interaction is UserContextMenuCommandInteraction | MessageContextMenuCommandInteraction;
    /**
     * Checks if the interaction is a button interaction
     * @param interaction The interaction to check
     * @returns True if the interaction is a button interaction
     */
    static isButton(interaction: Interaction): interaction is ButtonInteraction;
    /**
     * Checks if the interaction is a select menu interaction
     * @param interaction The interaction to check
     * @returns True if the interaction is a select menu interaction
     */
    static isSelectMenu(interaction: Interaction): interaction is SelectMenuInteraction;
    /**
     * Checks if the interaction is a modal submit interaction
     * @param interaction The interaction to check
     * @returns True if the interaction is a modal submit interaction
     */
    static isModalSubmit(interaction: Interaction): interaction is ModalSubmitInteraction;
    /**
     * Checks if the interaction is a deferred interaction
     * @param interaction The interaction to check (must be repliable)
     * @returns True if the interaction is already deferred
     */
    static isDeferred(interaction: CommandInteraction | ButtonInteraction | SelectMenuInteraction | ModalSubmitInteraction): boolean;
    /**
     * Checks if the interaction is already replied to
     * @param interaction The interaction to check (must be repliable)
     * @returns True if the interaction is already replied to
     */
    static isReplied(interaction: CommandInteraction | ButtonInteraction | SelectMenuInteraction | ModalSubmitInteraction): boolean;
}
