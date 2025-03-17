import { Command, CommandHandler, CommandOption } from '../../types';
/**
 * Builder for creating slash commands
 */
export declare class SlashCommandBuilder {
    private readonly _data;
    private _handler;
    /**
     * Creates a new slash command builder instance
     */
    constructor();
    /**
     * Sets the command name
     * @param name Command name (must be lowercase, without spaces)
     */
    setName(name: string): SlashCommandBuilder;
    /**
     * Sets the command description
     * @param description Command description
     */
    setDescription(description: string): SlashCommandBuilder;
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
