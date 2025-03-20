"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteractionManager = void 0;
const discord_js_1 = require("discord.js");
const types_1 = require("../types");
const logger_1 = require("../utils/logger");
/**
 * Interaction Manager - the main library class
 * for managing all types of interactions
 */
class InteractionManager {
    /**
     * Creates a new interaction manager instance
     * @param client Discord.js client
     * @param options Options for the manager
     */
    constructor(client, options = {}) {
        this.client = client;
        this.options = {
            autoRegisterEvents: true,
            debug: false,
            ...options
        };
        this.logger = new logger_1.Logger('Intmen-lib', this.options.debug);
        this.interactions = new Map();
        this.rest = new discord_js_1.REST({ version: '10' }).setToken(this.client.token || '');
        // Automatically register event handlers
        if (this.options.autoRegisterEvents) {
            this.registerEvents();
        }
    }
    /**
     * Registers interaction event handlers
     */
    registerEvents() {
        this.client.on('interactionCreate', (interaction) => this.handleInteraction(interaction));
        this.logger.debug('Interaction events registered');
    }
    /**
     * Handles incoming interaction
     * @param interaction Interaction from Discord API
     */
    async handleInteraction(interaction) {
        try {
            this.logger.debug(`Received interaction: ${interaction.type}`);
            if (interaction.isCommand() || interaction.isContextMenuCommand()) {
                await this.handleCommandInteraction(interaction);
            }
            else if (interaction.isButton()) {
                await this.handleButtonInteraction(interaction);
            }
            else if (interaction.isSelectMenu()) {
                await this.handleSelectMenuInteraction(interaction);
            }
            else if (interaction.isModalSubmit()) {
                await this.handleModalInteraction(interaction);
            }
            else if (interaction.isAutocomplete()) {
                await this.handleAutocompleteInteraction(interaction);
            }
        }
        catch (error) {
            this.logger.error('Error handling interaction', error);
        }
    }
    /**
     * Handles command interaction
     * @param interaction Command interaction
     */
    async handleCommandInteraction(interaction) {
        const command = this.interactions.get(interaction.commandName);
        if (!command) {
            this.logger.warn(`Command not found: ${interaction.commandName}`);
            return;
        }
        try {
            if (command.type === types_1.InteractionType.COMMAND || command.type === types_1.InteractionType.CONTEXT_MENU) {
                if (command.type === types_1.InteractionType.COMMAND && interaction.isCommand()) {
                    await command.handler(interaction);
                }
                else if (command.type === types_1.InteractionType.CONTEXT_MENU && interaction.isContextMenuCommand()) {
                    await command.handler(interaction);
                }
            }
        }
        catch (error) {
            this.logger.error(`Error executing command ${interaction.commandName}`, error);
            // If response not yet sent, send error message
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({
                    content: 'An error occurred while executing the command',
                    ephemeral: true
                }).catch(() => { });
            }
        }
    }
    /**
     * Handles button interaction
     * @param interaction Button interaction
     */
    async handleButtonInteraction(interaction) {
        const button = this.interactions.get(interaction.customId);
        if (!button) {
            this.logger.warn(`Button not found: ${interaction.customId}`);
            return;
        }
        try {
            if (button.type === types_1.InteractionType.BUTTON) {
                await button.handler(interaction);
            }
        }
        catch (error) {
            this.logger.error(`Error handling button ${interaction.customId}`, error);
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({
                    content: 'An error occurred while handling the button',
                    ephemeral: true
                }).catch(() => { });
            }
        }
    }
    /**
     * Handles select menu interaction
     * @param interaction Select menu interaction
     */
    async handleSelectMenuInteraction(interaction) {
        const selectMenu = this.interactions.get(interaction.customId);
        if (!selectMenu) {
            this.logger.warn(`Select menu not found: ${interaction.customId}`);
            return;
        }
        try {
            if (selectMenu.type === types_1.InteractionType.SELECT_MENU) {
                await selectMenu.handler(interaction);
            }
        }
        catch (error) {
            this.logger.error(`Error handling select menu ${interaction.customId}`, error);
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({
                    content: 'An error occurred while handling the select menu',
                    ephemeral: true
                }).catch(() => { });
            }
        }
    }
    /**
     * Handles modal interaction
     * @param interaction Modal interaction
     */
    async handleModalInteraction(interaction) {
        const modal = this.interactions.get(interaction.customId);
        if (!modal) {
            this.logger.warn(`Modal not found: ${interaction.customId}`);
            return;
        }
        try {
            if (modal.type === types_1.InteractionType.MODAL) {
                await modal.handler(interaction);
            }
        }
        catch (error) {
            this.logger.error(`Error handling modal ${interaction.customId}`, error);
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({
                    content: 'An error occurred while handling the modal',
                    ephemeral: true
                }).catch(() => { });
            }
        }
    }
    /**
     * Handles autocomplete interaction
     * @param interaction Autocomplete interaction
     */
    async handleAutocompleteInteraction(interaction) {
        const autocomplete = this.interactions.get(interaction.commandName);
        if (!autocomplete) {
            this.logger.warn(`Autocomplete not found: ${interaction.commandName}`);
            return;
        }
        try {
            if (autocomplete.type === types_1.InteractionType.AUTOCOMPLETE) {
                await autocomplete.handler(interaction);
            }
        }
        catch (error) {
            this.logger.error(`Error handling autocomplete ${interaction.commandName}`, error);
        }
    }
    /**
     * Registers a slash command
     * @param command Command object
     */
    registerCommand(command) {
        this.interactions.set(command.id, command);
        this.logger.debug(`Registered command: ${command.id}`);
    }
    /**
     * Registers a button
     * @param button Button object
     */
    registerButton(button) {
        this.interactions.set(button.id, button);
        this.logger.debug(`Registered button: ${button.id}`);
    }
    /**
     * Registers a select menu
     * @param selectMenu Select menu object
     */
    registerSelectMenu(selectMenu) {
        this.interactions.set(selectMenu.id, selectMenu);
        this.logger.debug(`Registered select menu: ${selectMenu.id}`);
    }
    /**
     * Registers a modal
     * @param modal Modal object
     */
    registerModal(modal) {
        this.interactions.set(modal.id, modal);
        this.logger.debug(`Registered modal: ${modal.id}`);
    }
    /**
     * Registers a context menu
     * @param contextMenu Context menu object
     */
    registerContextMenu(contextMenu) {
        this.interactions.set(contextMenu.id, contextMenu);
        this.logger.debug(`Registered context menu: ${contextMenu.id}`);
    }
    /**
     * Registers an autocomplete handler
     * @param autocomplete Autocomplete object
     */
    registerAutocomplete(autocomplete) {
        this.interactions.set(autocomplete.id, autocomplete);
        this.logger.debug(`Registered autocomplete: ${autocomplete.id}`);
    }
    /**
     * Registers global commands in Discord API
     * @param applicationId Application ID
     * @param commands Commands to register (if not specified, all registered commands are used)
     */
    async registerGlobalCommands(applicationId, commands) {
        try {
            const commandsToRegister = commands || this.getCommandsForRegistration();
            this.logger.info(`Registering ${commandsToRegister.length} global commands...`);
            await this.rest.put(discord_js_1.Routes.applicationCommands(applicationId), { body: commandsToRegister });
            this.logger.info('Global commands successfully registered');
        }
        catch (error) {
            this.logger.error('Error registering global commands', error);
            throw error;
        }
    }
    /**
     * Registers commands for a specific guild in Discord API
     * @param applicationId Application ID
     * @param guildId Guild ID
     * @param commands Commands to register (if not specified, all registered commands are used)
     */
    async registerGuildCommands(applicationId, guildId, commands) {
        try {
            const commandsToRegister = commands || this.getCommandsForRegistration();
            this.logger.info(`Registering ${commandsToRegister.length} commands on guild ${guildId}...`);
            await this.rest.put(discord_js_1.Routes.applicationGuildCommands(applicationId, guildId), { body: commandsToRegister });
            this.logger.info(`Commands successfully registered on guild ${guildId}`);
        }
        catch (error) {
            this.logger.error(`Error registering commands on guild ${guildId}`, error);
            throw error;
        }
    }
    /**
     * Gets commands for registration in Discord API
     * @returns Array of command data
     */
    getCommandsForRegistration() {
        const commands = [];
        for (const interaction of this.interactions.values()) {
            if (interaction.type === types_1.InteractionType.COMMAND ||
                interaction.type === types_1.InteractionType.CONTEXT_MENU) {
                commands.push(interaction.data);
            }
        }
        return commands;
    }
}
exports.InteractionManager = InteractionManager;
