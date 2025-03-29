import { Client, RESTPostAPIApplicationCommandsJSONBody, Collection } from 'discord.js';
import { InteractionManagerOptions, Command, Button, SelectMenu, Modal, ContextMenu, Autocomplete, RegisterableInteraction, SelectMenuHandler, ButtonHandler, ModalHandler } from '../types';
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
    private readonly patterns;
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
     * Handles interaction errors with customizable responses
     * @param interaction The interaction that caused the error
     * @param error The error that occurred
     * @param options Options for customizing the error response
     */
    private handleInteractionError;
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
     * Registers a button with a pattern-matching ID
     * @param pattern Regular expression to match button IDs
     * @param handler Button handler
     */
    registerButtonPattern(pattern: RegExp, handler: ButtonHandler): void;
    /**
     * Registers a select menu
     * @param selectMenu Select menu object
     */
    registerSelectMenu(selectMenu: SelectMenu): void;
    /**
     * Registers a select menu with a pattern-matching ID
     * @param pattern Regular expression to match select menu IDs
     * @param handler Select menu handler
     */
    registerSelectMenuPattern(pattern: RegExp, handler: SelectMenuHandler): void;
    /**
     * Registers a modal
     * @param modal Modal object
     */
    registerModal(modal: Modal): void;
    /**
     * Registers a modal with a pattern-matching ID
     * @param pattern Regular expression to match modal IDs
     * @param handler Modal handler
     */
    registerModalPattern(pattern: RegExp, handler: ModalHandler): void;
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
     * Gets all registered interactions
     * @returns Collection of registered interactions
     */
    getInteractions(): Collection<string, RegisterableInteraction>;
    /**
     * Unregisters an interaction by ID
     * @param id ID of the interaction to remove
     * @returns True if the interaction was found and removed, false otherwise
     */
    unregisterInteraction(id: string): boolean;
    /**
     * Updates the REST token - useful when the client reconnects with a new token
     * @param token New bot token
     */
    updateToken(token: string): void;
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
    /**
     * Validates application command permissions
     * Ensures commands have valid options and configurations
     * @param commands Commands to validate
     * @returns Array of validation error messages (empty if no errors)
     */
    validateCommands(commands?: RESTPostAPIApplicationCommandsJSONBody[]): string[];
    /**
     * Validates command options recursively
     * @param commandName Name of the command for context in error messages
     * @param options Options to validate
     * @returns Array of validation error messages
     */
    private validateCommandOptions;
}
