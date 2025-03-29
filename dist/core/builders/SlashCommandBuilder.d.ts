import { APIApplicationCommandSubcommandOption, APIApplicationCommandSubcommandGroupOption } from 'discord.js';
import { Command, CommandHandler, CommandOption } from '../../types';
/**
 * Builder for creating slash commands
 */
export declare class SlashCommandBuilder {
    private readonly _data;
    private _handler;
    private readonly _defaultMemberPermissions;
    private readonly _dmPermission;
    private readonly _nsfw;
    /**
     * Creates a new slash command builder instance
     */
    constructor();
    /**
     * Sets the command name
     * @param name Command name (must be lowercase, without spaces, 1-32 characters)
     */
    setName(name: string): SlashCommandBuilder;
    /**
     * Sets the command description
     * @param description Command description (1-100 characters)
     */
    setDescription(description: string): SlashCommandBuilder;
    /**
     * Sets whether the command is available in DMs with the bot
     * @param allowed Whether the command is available in DMs
     */
    setDMPermission(allowed: boolean): SlashCommandBuilder;
    /**
     * Sets whether the command is age-restricted (NSFW)
     * @param nsfw Whether the command is NSFW
     */
    setNSFW(nsfw: boolean): SlashCommandBuilder;
    /**
     * Sets the default member permissions required to use the command (bitfield)
     * @param permissions Permission bit flags
     */
    setDefaultMemberPermissions(permissions: bigint | null): SlashCommandBuilder;
    /**
     * Adds a string option to the command
     * @param builder Function to configure the option
     */
    addStringOption(builder: (option: CommandOption) => CommandOption): SlashCommandBuilder;
    /**
     * Adds an integer option to the command
     * @param builder Function to configure the option
     */
    addIntegerOption(builder: (option: CommandOption) => CommandOption): SlashCommandBuilder;
    /**
     * Adds a number (float/double) option to the command
     * @param builder Function to configure the option
     */
    addNumberOption(builder: (option: CommandOption) => CommandOption): SlashCommandBuilder;
    /**
     * Adds a boolean option to the command
     * @param builder Function to configure the option
     */
    addBooleanOption(builder: (option: CommandOption) => CommandOption): SlashCommandBuilder;
    /**
     * Adds a user option to the command
     * @param builder Function to configure the option
     */
    addUserOption(builder: (option: CommandOption) => CommandOption): SlashCommandBuilder;
    /**
     * Adds a channel option to the command
     * @param builder Function to configure the option
     */
    addChannelOption(builder: (option: CommandOption) => CommandOption): SlashCommandBuilder;
    /**
     * Adds a role option to the command
     * @param builder Function to configure the option
     */
    addRoleOption(builder: (option: CommandOption) => CommandOption): SlashCommandBuilder;
    /**
     * Adds a mentionable option (users and roles) to the command
     * @param builder Function to configure the option
     */
    addMentionableOption(builder: (option: CommandOption) => CommandOption): SlashCommandBuilder;
    /**
     * Adds an attachment option to the command
     * @param builder Function to configure the option
     */
    addAttachmentOption(builder: (option: CommandOption) => CommandOption): SlashCommandBuilder;
    /**
     * Adds a subcommand to the command
     * @param builder Function to configure the subcommand
     */
    addSubcommand(builder: (subcommand: SubcommandBuilder) => SubcommandBuilder): SlashCommandBuilder;
    /**
     * Adds a subcommand group to the command
     * @param builder Function to configure the subcommand group
     */
    addSubcommandGroup(builder: (group: SubcommandGroupBuilder) => SubcommandGroupBuilder): SlashCommandBuilder;
    /**
     * Validates an option object
     * @param option Option to validate
     */
    private validateOption;
    /**
     * Sets the command handler
     * @param handler Handler function called when the command is used
     */
    setHandler(handler: CommandHandler): SlashCommandBuilder;
    /**
     * Builds and returns the command object
     * @returns Command object ready for registration
     */
    build(): Command;
}
/**
 * Builder for creating subcommands
 */
export declare class SubcommandBuilder {
    private readonly data;
    constructor();
    /**
     * Sets the subcommand name
     * @param name Subcommand name (must be lowercase, without spaces, 1-32 characters)
     */
    setName(name: string): SubcommandBuilder;
    /**
     * Sets the subcommand description
     * @param description Subcommand description (1-100 characters)
     */
    setDescription(description: string): SubcommandBuilder;
    /**
     * Adds a string option to the subcommand
     * @param builder Function to configure the option
     */
    addStringOption(builder: (option: CommandOption) => CommandOption): SubcommandBuilder;
    /**
     * Adds an integer option to the subcommand
     * @param builder Function to configure the option
     */
    addIntegerOption(builder: (option: CommandOption) => CommandOption): SubcommandBuilder;
    /**
     * Adds a boolean option to the subcommand
     * @param builder Function to configure the option
     */
    addBooleanOption(builder: (option: CommandOption) => CommandOption): SubcommandBuilder;
    /**
     * Adds a user option to the subcommand
     * @param builder Function to configure the option
     */
    addUserOption(builder: (option: CommandOption) => CommandOption): SubcommandBuilder;
    /**
     * Adds a channel option to the subcommand
     * @param builder Function to configure the option
     */
    addChannelOption(builder: (option: CommandOption) => CommandOption): SubcommandBuilder;
    /**
     * Adds a role option to the subcommand
     * @param builder Function to configure the option
     */
    addRoleOption(builder: (option: CommandOption) => CommandOption): SubcommandBuilder;
    /**
     * Validates an option object
     * @param option Option to validate
     */
    private validateOption;
    /**
     * Returns the JSON representation of this subcommand
     * @returns The JSON data for the API
     */
    toJSON(): APIApplicationCommandSubcommandOption;
}
/**
 * Builder for creating subcommand groups
 */
export declare class SubcommandGroupBuilder {
    private readonly data;
    constructor();
    /**
     * Sets the group name
     * @param name Group name (must be lowercase, without spaces, 1-32 characters)
     */
    setName(name: string): SubcommandGroupBuilder;
    /**
     * Sets the group description
     * @param description Group description (1-100 characters)
     */
    setDescription(description: string): SubcommandGroupBuilder;
    /**
     * Adds a subcommand to this group
     * @param builder Function to configure the subcommand
     */
    addSubcommand(builder: (subcommand: SubcommandBuilder) => SubcommandBuilder): SubcommandGroupBuilder;
    /**
     * Returns the JSON representation of this subcommand group
     * @returns The JSON data for the API
     */
    toJSON(): APIApplicationCommandSubcommandGroupOption;
}
