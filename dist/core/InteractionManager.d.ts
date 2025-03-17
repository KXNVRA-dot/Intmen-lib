import { Client, RESTPostAPIApplicationCommandsJSONBody } from 'discord.js';
import { InteractionManagerOptions, Command, Button, SelectMenu, Modal, ContextMenu, Autocomplete } from '../types';
/**
 * Interaction Manager - the main library class
 * for managing all types of interactions
 */
export declare class InteractionManager {
    private readonly client;
    private readonly options;
    private readonly logger;
    private readonly interactions;
    private readonly rest;
    /**
     * Creates a new interaction manager instance
     * @param client Discord.js client
     * @param options Options for the manager
     */
    constructor(client: Client, options?: InteractionManagerOptions);
    /**
     * Registers interaction event handlers
     */
    private registerEvents;
    /**
     * Handles incoming interaction
     * @param interaction Interaction from Discord API
     */
    private handleInteraction;
    /**
     * Handles command interaction
     * @param interaction Command interaction
     */
    private handleCommandInteraction;
    /**
     * Handles button interaction
     * @param interaction Button interaction
     */
    private handleButtonInteraction;
    /**
     * Handles select menu interaction
     * @param interaction Select menu interaction
     */
    private handleSelectMenuInteraction;
    /**
     * Handles modal interaction
     * @param interaction Modal interaction
     */
    private handleModalInteraction;
    /**
     * Handles autocomplete interaction
     * @param interaction Autocomplete interaction
     */
    private handleAutocompleteInteraction;
    /**
     * Registers a slash command
     * @param command Command object
     */
    registerCommand(command: Command): void;
    /**
     * Registers a button
     * @param button Button object
     */
    registerButton(button: Button): void;
    /**
     * Registers a select menu
     * @param selectMenu Select menu object
     */
    registerSelectMenu(selectMenu: SelectMenu): void;
    /**
     * Registers a modal
     * @param modal Modal object
     */
    registerModal(modal: Modal): void;
    /**
     * Registers a context menu
     * @param contextMenu Context menu object
     */
    registerContextMenu(contextMenu: ContextMenu): void;
    /**
     * Registers an autocomplete handler
     * @param autocomplete Autocomplete object
     */
    registerAutocomplete(autocomplete: Autocomplete): void;
    /**
     * Registers global commands in Discord API
     * @param applicationId Application ID
     * @param commands Commands to register (if not specified, all registered commands are used)
     */
    registerGlobalCommands(applicationId: string, commands?: RESTPostAPIApplicationCommandsJSONBody[]): Promise<void>;
    /**
     * Registers commands for a specific guild in Discord API
     * @param applicationId Application ID
     * @param guildId Guild ID
     * @param commands Commands to register (if not specified, all registered commands are used)
     */
    registerGuildCommands(applicationId: string, guildId: string, commands?: RESTPostAPIApplicationCommandsJSONBody[]): Promise<void>;
    /**
     * Gets commands for registration in Discord API
     * @returns Array of command data
     */
    private getCommandsForRegistration;
}
