"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlashCommandBuilder = void 0;
const discord_js_1 = require("discord.js");
const types_1 = require("../../types");
/**
 * Builder for creating slash commands
 */
class SlashCommandBuilder {
    /**
     * Creates a new slash command builder instance
     */
    constructor() {
        this._handler = null;
        this._data = {
            name: '',
            type: discord_js_1.ApplicationCommandType.ChatInput,
            description: '',
            options: []
        };
    }
    /**
     * Sets the command name
     * @param name Command name (must be lowercase, without spaces)
     */
    setName(name) {
        this._data.name = name.toLowerCase();
        return this;
    }
    /**
     * Sets the command description
     * @param description Command description
     */
    setDescription(description) {
        if (this._data.type === discord_js_1.ApplicationCommandType.ChatInput) {
            this._data.description = description;
        }
        return this;
    }
    /**
     * Adds a string option to the command
     * @param builder Function to configure the option
     */
    addStringOption(builder) {
        const option = {
            name: '',
            description: '',
            type: discord_js_1.ApplicationCommandOptionType.String
        };
        const builtOption = builder(option);
        this._data.options = this._data.options || [];
        this._data.options.push(builtOption);
        return this;
    }
    /**
     * Adds an integer option to the command
     * @param builder Function to configure the option
     */
    addIntegerOption(builder) {
        const option = {
            name: '',
            description: '',
            type: discord_js_1.ApplicationCommandOptionType.Integer
        };
        const builtOption = builder(option);
        this._data.options = this._data.options || [];
        this._data.options.push(builtOption);
        return this;
    }
    /**
     * Adds a boolean option to the command
     * @param builder Function to configure the option
     */
    addBooleanOption(builder) {
        const option = {
            name: '',
            description: '',
            type: discord_js_1.ApplicationCommandOptionType.Boolean
        };
        const builtOption = builder(option);
        this._data.options = this._data.options || [];
        this._data.options.push(builtOption);
        return this;
    }
    /**
     * Adds a user option to the command
     * @param builder Function to configure the option
     */
    addUserOption(builder) {
        const option = {
            name: '',
            description: '',
            type: discord_js_1.ApplicationCommandOptionType.User
        };
        const builtOption = builder(option);
        this._data.options = this._data.options || [];
        this._data.options.push(builtOption);
        return this;
    }
    /**
     * Adds a channel option to the command
     * @param builder Function to configure the option
     */
    addChannelOption(builder) {
        const option = {
            name: '',
            description: '',
            type: discord_js_1.ApplicationCommandOptionType.Channel
        };
        const builtOption = builder(option);
        this._data.options = this._data.options || [];
        this._data.options.push(builtOption);
        return this;
    }
    /**
     * Adds a role option to the command
     * @param builder Function to configure the option
     */
    addRoleOption(builder) {
        const option = {
            name: '',
            description: '',
            type: discord_js_1.ApplicationCommandOptionType.Role
        };
        const builtOption = builder(option);
        this._data.options = this._data.options || [];
        this._data.options.push(builtOption);
        return this;
    }
    /**
     * Sets the command handler
     * @param handler Handler function called when the command is used
     */
    setHandler(handler) {
        this._handler = handler;
        return this;
    }
    /**
     * Builds and returns the command object
     * @returns Command object ready for registration
     */
    build() {
        if (!this._data.name) {
            throw new Error('Command name is required');
        }
        if (this._data.type === discord_js_1.ApplicationCommandType.ChatInput && !this._data.description) {
            throw new Error('Command description is required for chat input commands');
        }
        if (!this._handler) {
            throw new Error('Command handler is required');
        }
        return {
            type: types_1.InteractionType.COMMAND,
            id: this._data.name,
            data: this._data,
            handler: this._handler
        };
    }
}
exports.SlashCommandBuilder = SlashCommandBuilder;
