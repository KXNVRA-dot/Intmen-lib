"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteractionManager = void 0;
const discord_js_1 = require("discord.js");
const types_1 = require("../types");
/* eslint-disable @typescript-eslint/no-explicit-any */
const logger_1 = require("../utils/logger");
const interaction_timeout_1 = require("../utils/interaction-timeout");
const types_2 = require("../types");
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
            defaultErrorMessage: 'An error occurred while handling the interaction',
            defaultErrorEphemeral: true,
            interactionTimeout: 15000,
            cooldownMessage: 'Please wait {remaining}s before using this command again.',
            ...options
        };
        this.logger = new logger_1.Logger({
            prefix: 'Intmen-lib',
            level: this.options.debug ? logger_1.LogLevel.DEBUG : logger_1.LogLevel.INFO
        });
        this.interactions = new Map();
        this.patterns = new Map();
        this.cooldowns = new Map();
        this.globalMiddlewares = this.options.middlewares || [];
        // Initialize the REST client with the provided token
        if (!client.token && !this.options.botToken) {
            this.logger.warn('No token provided - API commands registration will fail. Either the Client must be ready or botToken must be provided in options');
            this.rest = new discord_js_1.REST({ version: '10' });
        }
        else {
            this.rest = new discord_js_1.REST({ version: '10' }).setToken(client.token || this.options.botToken || '');
        }
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
            else {
                // Do not warn for unsupported types in tests; log at debug level instead
                this.logger.debug(`Unsupported interaction type: ${interaction.type}`);
            }
        }
        catch (error) {
            this.logger.error('Error handling interaction', error);
            this.handleInteractionError(interaction, error);
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
        // Cooldown handling for commands
        if (command.cooldown && command.cooldown > 0) {
            const cooldownMs = command.cooldown;
            const scope = command.cooldownScope || types_2.CooldownScope.USER;
            const now = Date.now();
            const store = this.cooldowns.get(command.id) || new Map();
            const key = this.getCooldownKey(scope, interaction);
            const lastUsed = store.get(key) || 0;
            const remaining = lastUsed + cooldownMs - now;
            if (remaining > 0) {
                const msg = (this.options.cooldownMessage || 'Please wait {remaining}s before using this command again.')
                    .replace('{remaining}', Math.ceil(remaining / 1000).toString());
                try {
                    if (!interaction.replied && !interaction.deferred) {
                        await interaction.reply({ content: msg, ephemeral: true });
                    }
                    else if (interaction.deferred && !interaction.replied) {
                        await interaction.editReply({ content: msg });
                    }
                }
                catch (err) {
                    this.logger.error('Failed to send cooldown message', err);
                }
                return;
            }
            store.set(key, now);
            this.cooldowns.set(command.id, store);
        }
        try {
            if (command.type === types_1.InteractionType.COMMAND || command.type === types_1.InteractionType.CONTEXT_MENU) {
                if (command.type === types_1.InteractionType.COMMAND && interaction.isCommand()) {
                    await this.runWithMiddlewares(command, interaction, async (ctx) => {
                        if (this.options.interactionTimeout && this.options.interactionTimeout > 0) {
                            await (0, interaction_timeout_1.withTimeout)(command.handler(ctx), interaction, {
                                timeout: this.options.interactionTimeout,
                                timeoutMessage: 'Command processing timed out',
                                ephemeral: true
                            });
                        }
                        else {
                            await command.handler(ctx);
                        }
                    });
                }
                else if (command.type === types_1.InteractionType.CONTEXT_MENU && interaction.isContextMenuCommand()) {
                    await this.runWithMiddlewares(command, interaction, async (ctx) => {
                        if (this.options.interactionTimeout && this.options.interactionTimeout > 0) {
                            await (0, interaction_timeout_1.withTimeout)(command.handler(ctx), interaction, {
                                timeout: this.options.interactionTimeout,
                                timeoutMessage: 'Command processing timed out',
                                ephemeral: true
                            });
                        }
                        else {
                            await command.handler(ctx);
                        }
                    });
                }
            }
        }
        catch (error) {
            this.logger.error(`Error executing command ${interaction.commandName}`, error);
            // Handle the error with default response
            await this.handleInteractionError(interaction, error);
        }
    }
    /**
     * Handles button interaction
     * @param interaction Button interaction
     */
    async handleButtonInteraction(interaction) {
        let button = this.interactions.get(interaction.customId);
        // If no exact match is found, try pattern matching
        if (!button) {
            for (const [pattern, handler] of this.patterns.entries()) {
                if (pattern.test(interaction.customId) && handler.type === types_1.InteractionType.BUTTON) {
                    button = handler;
                    break;
                }
            }
        }
        if (!button) {
            this.logger.warn(`Button not found: ${interaction.customId}`);
            return;
        }
        try {
            if (button.type === types_1.InteractionType.BUTTON) {
                await this.runWithMiddlewares(button, interaction, async (ctx) => {
                    if (this.options.interactionTimeout && this.options.interactionTimeout > 0) {
                        await (0, interaction_timeout_1.withTimeout)(button.handler(ctx), interaction, {
                            timeout: this.options.interactionTimeout,
                            timeoutMessage: 'Button processing timed out',
                            ephemeral: true
                        });
                    }
                    else {
                        await button.handler(ctx);
                    }
                });
            }
        }
        catch (error) {
            this.logger.error(`Error handling button ${interaction.customId}`, error);
            // Handle the error with custom or default response
            await this.handleInteractionError(interaction, error, {
                customMessage: `Error handling button ${interaction.customId}`
            });
        }
    }
    /**
     * Handles select menu interaction
     * @param interaction Select menu interaction
     */
    async handleSelectMenuInteraction(interaction) {
        let selectMenu = this.interactions.get(interaction.customId);
        // If no exact match is found, try pattern matching
        if (!selectMenu) {
            for (const [pattern, handler] of this.patterns.entries()) {
                if (pattern.test(interaction.customId) && handler.type === types_1.InteractionType.SELECT_MENU) {
                    selectMenu = handler;
                    break;
                }
            }
        }
        if (!selectMenu) {
            this.logger.warn(`Select menu not found: ${interaction.customId}`);
            return;
        }
        try {
            if (selectMenu.type === types_1.InteractionType.SELECT_MENU) {
                await this.runWithMiddlewares(selectMenu, interaction, async (ctx) => {
                    if (this.options.interactionTimeout && this.options.interactionTimeout > 0) {
                        await (0, interaction_timeout_1.withTimeout)(selectMenu.handler(ctx), interaction, {
                            timeout: this.options.interactionTimeout,
                            timeoutMessage: 'Select menu processing timed out',
                            ephemeral: true
                        });
                    }
                    else {
                        await selectMenu.handler(ctx);
                    }
                });
            }
        }
        catch (error) {
            this.logger.error(`Error handling select menu ${interaction.customId}`, error);
            // Handle the error with custom or default response
            await this.handleInteractionError(interaction, error, {
                customMessage: `Error handling select menu ${interaction.customId}`
            });
        }
    }
    /**
     * Handles modal interaction
     * @param interaction Modal interaction
     */
    async handleModalInteraction(interaction) {
        let modal = this.interactions.get(interaction.customId);
        // If no exact match is found, try pattern matching
        if (!modal) {
            for (const [pattern, handler] of this.patterns.entries()) {
                if (pattern.test(interaction.customId) && handler.type === types_1.InteractionType.MODAL) {
                    modal = handler;
                    break;
                }
            }
        }
        if (!modal) {
            this.logger.warn(`Modal not found: ${interaction.customId}`);
            return;
        }
        try {
            if (modal.type === types_1.InteractionType.MODAL) {
                await this.runWithMiddlewares(modal, interaction, async (ctx) => {
                    if (this.options.interactionTimeout && this.options.interactionTimeout > 0) {
                        await (0, interaction_timeout_1.withTimeout)(modal.handler(ctx), interaction, {
                            timeout: this.options.interactionTimeout,
                            timeoutMessage: 'Modal processing timed out',
                            ephemeral: true
                        });
                    }
                    else {
                        await modal.handler(ctx);
                    }
                });
            }
        }
        catch (error) {
            this.logger.error(`Error handling modal ${interaction.customId}`, error);
            // Handle the error with custom or default response
            await this.handleInteractionError(interaction, error, {
                customMessage: `Error handling modal ${interaction.customId}`
            });
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
            // For autocomplete, we should at least return an empty array
            try {
                await interaction.respond([]);
            }
            catch (error) {
                this.logger.error('Failed to respond with empty autocomplete results', error);
            }
            return;
        }
        try {
            if (autocomplete.type === types_1.InteractionType.AUTOCOMPLETE) {
                await this.runWithMiddlewares(autocomplete, interaction, async (ctx) => {
                    await autocomplete.handler(ctx);
                });
            }
        }
        catch (error) {
            this.logger.error(`Error handling autocomplete ${interaction.commandName}`, error);
            // Try to respond with empty results in case of error
            try {
                await interaction.respond([]);
            }
            catch (respondError) {
                this.logger.error('Failed to respond with empty autocomplete results after handler error', respondError);
            }
        }
    }
    /**
     * Handles interaction errors with customizable responses
     * @param interaction The interaction that caused the error
     * @param error The error that occurred
     * @param options Options for customizing the error response
     */
    async handleInteractionError(interaction, error, options = {}) {
        // Skip for autocomplete interactions as they can only receive a specific response format
        if (interaction.isAutocomplete())
            return;
        // Check if we can reply to this interaction
        const canReply = !interaction.isAutocomplete() &&
            'replied' in interaction &&
            'deferred' in interaction;
        if (!canReply)
            return;
        const replyableInteraction = interaction;
        // Only try to respond if the interaction hasn't been replied to yet
        if (!replyableInteraction.replied && !replyableInteraction.deferred) {
            try {
                const message = options.customMessage || this.options.defaultErrorMessage || 'An error occurred';
                const ephemeral = options.ephemeral ?? this.options.defaultErrorEphemeral ?? true;
                await replyableInteraction.reply({
                    content: message,
                    ephemeral: ephemeral
                }).catch(() => { });
            }
            catch (replyError) {
                this.logger.error('Failed to send error response', replyError);
            }
        }
        // Execute custom error handler if provided
        if (this.options.onError) {
            try {
                await this.options.onError(interaction, error);
            }
            catch (handlerError) {
                this.logger.error('Error in custom error handler', handlerError);
            }
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
     * Registers a button with a pattern-matching ID
     * @param pattern Regular expression to match button IDs
     * @param handler Button handler
     */
    registerButtonPattern(pattern, handler) {
        const button = {
            type: types_1.InteractionType.BUTTON,
            id: pattern.toString(),
            handler
        };
        this.patterns.set(pattern, button);
        this.logger.debug(`Registered button pattern: ${pattern.toString()}`);
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
     * Registers a select menu with a pattern-matching ID
     * @param pattern Regular expression to match select menu IDs
     * @param handler Select menu handler
     */
    registerSelectMenuPattern(pattern, handler) {
        const selectMenu = {
            type: types_1.InteractionType.SELECT_MENU,
            id: pattern.toString(),
            handler
        };
        this.patterns.set(pattern, selectMenu);
        this.logger.debug(`Registered select menu pattern: ${pattern.toString()}`);
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
     * Registers a modal with a pattern-matching ID
     * @param pattern Regular expression to match modal IDs
     * @param handler Modal handler
     */
    registerModalPattern(pattern, handler) {
        const modal = {
            type: types_1.InteractionType.MODAL,
            id: pattern.toString(),
            handler
        };
        this.patterns.set(pattern, modal);
        this.logger.debug(`Registered modal pattern: ${pattern.toString()}`);
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
     * Gets all registered interactions
     * @returns Collection of registered interactions
     */
    getInteractions() {
        return new discord_js_1.Collection(this.interactions);
    }
    /**
     * Unregisters an interaction by ID
     * @param id ID of the interaction to remove
     * @returns True if the interaction was found and removed, false otherwise
     */
    unregisterInteraction(id) {
        const deleted = this.interactions.delete(id);
        if (deleted) {
            this.logger.debug(`Unregistered interaction: ${id}`);
        }
        return deleted;
    }
    /**
     * Updates the REST token - useful when the client reconnects with a new token
     * @param token New bot token
     */
    updateToken(token) {
        this.rest.setToken(token);
        this.logger.debug('Updated REST API token');
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
    /**
     * Validates application command permissions
     * Ensures commands have valid options and configurations
     * @param commands Commands to validate
     * @returns Array of validation error messages (empty if no errors)
     */
    validateCommands(commands) {
        const commandsToValidate = commands || this.getCommandsForRegistration();
        const errors = [];
        for (const command of commandsToValidate) {
            // Name validation
            if (!command.name || command.name.length < 1 || command.name.length > 32) {
                errors.push(`Command name must be between 1-32 characters: ${command.name || 'undefined'}`);
            }
            // Description validation for chat input commands
            if (command.type === 1 && (!command.description || command.description.length < 1 || command.description.length > 100)) {
                errors.push(`Command description must be between 1-100 characters: ${command.name}`);
            }
            // Options validation
            if (command.options) {
                errors.push(...this.validateCommandOptions(command.name, command.options));
            }
        }
        return errors;
    }
    /**
     * Validates command options recursively
     * @param commandName Name of the command for context in error messages
     * @param options Options to validate
     * @returns Array of validation error messages
     */
    validateCommandOptions(commandName, options) {
        const errors = [];
        for (const option of options) {
            // Name validation
            if (!option.name || option.name.length < 1 || option.name.length > 32) {
                errors.push(`Option name must be between 1-32 characters in command ${commandName}`);
            }
            // Description validation
            if (!option.description || option.description.length < 1 || option.description.length > 100) {
                errors.push(`Option description must be between 1-100 characters: ${option.name} in command ${commandName}`);
            }
            // Validate sub-options recursively (for subcommands and subcommand groups)
            if ((option.type === 1 || option.type === 2) && option.options) {
                errors.push(...this.validateCommandOptions(commandName, option.options));
            }
            // Validate choices if present
            if ('choices' in option && option.choices) {
                for (const choice of option.choices) {
                    if (!choice.name || choice.name.length < 1 || choice.name.length > 100) {
                        errors.push(`Choice name must be between 1-100 characters in option ${option.name} of command ${commandName}`);
                    }
                }
            }
        }
        return errors;
    }
    /** Compose and execute middlewares + handler */
    async runWithMiddlewares(interactionDef, interaction, finalHandler) {
        const ctx = { interaction, state: new Map(), logger: this.logger, manager: this };
        // extract params for pattern-based matches using named capture groups
        const match = this.findPatternMatch(interactionDef, interaction);
        if (match && match.groups) {
            ctx.params = { ...match.groups };
        }
        const chain = [...this.globalMiddlewares, ...(interactionDef.middlewares || [])];
        let idx = -1;
        const dispatch = async (i) => {
            if (i <= idx)
                throw new Error('next() called multiple times');
            idx = i;
            const mw = chain[i];
            if (mw) {
                await mw(ctx, () => dispatch(i + 1));
            }
            else {
                await finalHandler(ctx);
            }
        };
        await dispatch(0);
    }
    findPatternMatch(interactionDef, interaction) {
        // Try to find a matching pattern for buttons/select/modals to extract named groups
        let id;
        if (interaction.isButton())
            id = interaction.customId;
        else if (interaction.isSelectMenu())
            id = interaction.customId;
        else if (interaction.isModalSubmit())
            id = interaction.customId;
        if (!id)
            return null;
        for (const [pattern, handler] of this.patterns.entries()) {
            if (handler === interactionDef) {
                const m = pattern.exec(id);
                if (m)
                    return m;
            }
        }
        return null;
    }
    getCooldownKey(scope, interaction) {
        switch (scope) {
            case types_2.CooldownScope.GUILD:
                return `${interaction.guildId || 'dm'}`;
            case types_2.CooldownScope.CHANNEL:
                return `${interaction.channelId}`;
            case types_2.CooldownScope.GLOBAL:
                return `global`;
            case types_2.CooldownScope.USER:
            default:
                return `${interaction.user.id}`;
        }
    }
}
exports.InteractionManager = InteractionManager;
