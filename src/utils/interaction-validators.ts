import { ButtonInteraction, CommandInteraction, ChatInputCommandInteraction, MessageContextMenuCommandInteraction, UserContextMenuCommandInteraction, GuildMember, Interaction, ModalSubmitInteraction, SelectMenuInteraction, User } from 'discord.js';
import { PermissionUtils } from './permissions';

/**
 * Collection of utility functions for validating interactions
 */
export class InteractionValidators {
  /**
   * Checks if an interaction was initiated by a specific user
   * @param interaction The interaction to check
   * @param userId The user ID to check against
   * @returns True if the interaction was initiated by the specified user
   */
  public static isFromUser(interaction: Interaction, userId: string): boolean {
    return interaction.user.id === userId;
  }

  /**
   * Checks if an interaction was initiated by one of the specified users
   * @param interaction The interaction to check
   * @param userIds Array of user IDs to check against
   * @returns True if the interaction was initiated by one of the specified users
   */
  public static isFromAnyUser(interaction: Interaction, userIds: string[]): boolean {
    return userIds.includes(interaction.user.id);
  }

  /**
   * Checks if an interaction was initiated in a specific channel
   * @param interaction The interaction to check
   * @param channelId The channel ID to check against
   * @returns True if the interaction was initiated in the specified channel
   */
  public static isInChannel(interaction: Interaction, channelId: string): boolean {
    return interaction.channelId === channelId;
  }

  /**
   * Checks if an interaction was initiated in a guild (server)
   * @param interaction The interaction to check
   * @returns True if the interaction was initiated in a guild
   */
  public static isInGuild(interaction: Interaction): boolean {
    return interaction.inGuild();
  }

  /**
   * Checks if the user has the specified permissions in the current channel
   * @param interaction The interaction to check
   * @param permissions The permissions to check for
   * @returns True if the user has the specified permissions
   */
  public static hasPermissions(interaction: Interaction, permissions: bigint | bigint[]): boolean {
    if (!interaction.inGuild() || !(interaction.member instanceof GuildMember)) {
      return false;
    }

    return PermissionUtils.hasPermission(interaction.member, permissions);
  }

  /**
   * Checks if the interaction is from the bot owner
   * @param interaction The interaction to check
   * @param ownerId The bot owner's user ID
   * @returns True if the interaction is from the bot owner
   */
  public static isFromOwner(interaction: Interaction, ownerId: string): boolean {
    return interaction.user.id === ownerId;
  }

  /**
   * Checks if the interaction should continue based on a custom condition
   * @param interaction The interaction to check
   * @param condition Function that validates the interaction
   * @returns The result of the condition function
   */
  public static custom<T extends Interaction>(interaction: T, condition: (interaction: T) => boolean): boolean {
    return condition(interaction);
  }

  /**
   * Validates multiple conditions and returns true if all pass
   * @param interaction The interaction to check
   * @param validators Array of validator functions that each return boolean
   * @returns True if all validators return true
   */
  public static all<T extends Interaction>(interaction: T, validators: ((interaction: T) => boolean)[]): boolean {
    return validators.every(validator => validator(interaction));
  }

  /**
   * Validates multiple conditions and returns true if any pass
   * @param interaction The interaction to check
   * @param validators Array of validator functions that each return boolean
   * @returns True if any validator returns true
   */
  public static any<T extends Interaction>(interaction: T, validators: ((interaction: T) => boolean)[]): boolean {
    return validators.some(validator => validator(interaction));
  }

  /**
   * Checks if the interaction is a chat input command (slash command)
   * @param interaction The interaction to check
   * @returns True if the interaction is a chat input command
   */
  public static isChatInputCommand(interaction: Interaction): interaction is ChatInputCommandInteraction {
    return interaction.isChatInputCommand();
  }

  /**
   * Checks if the interaction is a user context menu command
   * @param interaction The interaction to check
   * @returns True if the interaction is a user context menu command
   */
  public static isUserContextMenuCommand(interaction: Interaction): interaction is UserContextMenuCommandInteraction {
    return interaction.isUserContextMenuCommand();
  }

  /**
   * Checks if the interaction is a message context menu command
   * @param interaction The interaction to check
   * @returns True if the interaction is a message context menu command
   */
  public static isMessageContextMenuCommand(interaction: Interaction): interaction is MessageContextMenuCommandInteraction {
    return interaction.isMessageContextMenuCommand();
  }

  /**
   * Checks if the interaction is any type of context menu command
   * @param interaction The interaction to check
   * @returns True if the interaction is a context menu command (either user or message)
   */
  public static isContextMenuCommand(interaction: Interaction): interaction is UserContextMenuCommandInteraction | MessageContextMenuCommandInteraction {
    return interaction.isUserContextMenuCommand() || interaction.isMessageContextMenuCommand();
  }

  /**
   * Checks if the interaction is a button interaction
   * @param interaction The interaction to check
   * @returns True if the interaction is a button interaction
   */
  public static isButton(interaction: Interaction): interaction is ButtonInteraction {
    return interaction.isButton();
  }

  /**
   * Checks if the interaction is a select menu interaction
   * @param interaction The interaction to check
   * @returns True if the interaction is a select menu interaction
   */
  public static isSelectMenu(interaction: Interaction): interaction is SelectMenuInteraction {
    return interaction.isSelectMenu();
  }

  /**
   * Checks if the interaction is a modal submit interaction
   * @param interaction The interaction to check
   * @returns True if the interaction is a modal submit interaction
   */
  public static isModalSubmit(interaction: Interaction): interaction is ModalSubmitInteraction {
    return interaction.isModalSubmit();
  }

  /**
   * Checks if the interaction is a deferred interaction
   * @param interaction The interaction to check (must be repliable)
   * @returns True if the interaction is already deferred
   */
  public static isDeferred(interaction: CommandInteraction | ButtonInteraction | SelectMenuInteraction | ModalSubmitInteraction): boolean {
    return interaction.deferred;
  }

  /**
   * Checks if the interaction is already replied to
   * @param interaction The interaction to check (must be repliable)
   * @returns True if the interaction is already replied to
   */
  public static isReplied(interaction: CommandInteraction | ButtonInteraction | SelectMenuInteraction | ModalSubmitInteraction): boolean {
    return interaction.replied;
  }
}
