"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubcommandGroupBuilder = exports.SubcommandBuilder = exports.SlashCommandBuilder = void 0;
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
        this._defaultMemberPermissions = null;
        this._dmPermission = true;
        this._nsfw = false;
        this._data = {
            name: '',
            type: discord_js_1.ApplicationCommandType.ChatInput,
            description: '',
            options: []
        };
    }
    /**
     * Sets the command name
     * @param name Command name (must be lowercase, without spaces, 1-32 characters)
     */
    setName(name) {
        if (!name || name.length < 1 || name.length > 32) {
            throw new Error('Command name must be between 1-32 characters');
        }
        // Discord requires command names to be lowercase, no spaces
        const formattedName = name.toLowerCase().replace(/\s+/g, '-');
        if (formattedName !== name) {
            console.warn(`Command name "${name}" was automatically converted to "${formattedName}" to conform to Discord's requirements`);
        }
        this._data.name = formattedName;
        return this;
    }
    /**
     * Sets the command description
     * @param description Command description (1-100 characters)
     */
    setDescription(description) {
        if (!description || description.length < 1 || description.length > 100) {
            throw new Error('Command description must be between 1-100 characters');
        }
        if (this._data.type === discord_js_1.ApplicationCommandType.ChatInput) {
            this._data.description = description;
        }
        return this;
    }
    /**
     * Sets whether the command is available in DMs with the bot
     * @param allowed Whether the command is available in DMs
     */
    setDMPermission(allowed) {
        this._data.dm_permission = allowed;
        return this;
    }
    /**
     * Sets whether the command is age-restricted (NSFW)
     * @param nsfw Whether the command is NSFW
     */
    setNSFW(nsfw) {
        this._data.nsfw = nsfw;
        return this;
    }
    /**
     * Sets the default member permissions required to use the command (bitfield)
     * @param permissions Permission bit flags
     */
    setDefaultMemberPermissions(permissions) {
        this._data.default_member_permissions = permissions?.toString() || null;
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
        this.validateOption(builtOption);
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
        this.validateOption(builtOption);
        this._data.options = this._data.options || [];
        this._data.options.push(builtOption);
        return this;
    }
    /**
     * Adds a number (float/double) option to the command
     * @param builder Function to configure the option
     */
    addNumberOption(builder) {
        const option = {
            name: '',
            description: '',
            type: discord_js_1.ApplicationCommandOptionType.Number
        };
        const builtOption = builder(option);
        this.validateOption(builtOption);
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
        this.validateOption(builtOption);
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
        this.validateOption(builtOption);
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
        this.validateOption(builtOption);
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
        this.validateOption(builtOption);
        this._data.options = this._data.options || [];
        this._data.options.push(builtOption);
        return this;
    }
    /**
     * Adds a mentionable option (users and roles) to the command
     * @param builder Function to configure the option
     */
    addMentionableOption(builder) {
        const option = {
            name: '',
            description: '',
            type: discord_js_1.ApplicationCommandOptionType.Mentionable
        };
        const builtOption = builder(option);
        this.validateOption(builtOption);
        this._data.options = this._data.options || [];
        this._data.options.push(builtOption);
        return this;
    }
    /**
     * Adds an attachment option to the command
     * @param builder Function to configure the option
     */
    addAttachmentOption(builder) {
        const option = {
            name: '',
            description: '',
            type: discord_js_1.ApplicationCommandOptionType.Attachment
        };
        const builtOption = builder(option);
        this.validateOption(builtOption);
        this._data.options = this._data.options || [];
        this._data.options.push(builtOption);
        return this;
    }
    /**
     * Adds a subcommand to the command
     * @param builder Function to configure the subcommand
     */
    addSubcommand(builder) {
        const subcommand = new SubcommandBuilder();
        const builtSubcommand = builder(subcommand);
        this._data.options = this._data.options || [];
        this._data.options.push(builtSubcommand.toJSON());
        return this;
    }
    /**
     * Adds a subcommand group to the command
     * @param builder Function to configure the subcommand group
     */
    addSubcommandGroup(builder) {
        const group = new SubcommandGroupBuilder();
        const builtGroup = builder(group);
        this._data.options = this._data.options || [];
        this._data.options.push(builtGroup.toJSON());
        return this;
    }
    /**
     * Validates an option object
     * @param option Option to validate
     */
    validateOption(option) {
        if (!option.name || option.name.length < 1 || option.name.length > 32) {
            throw new Error(`Option name must be between 1-32 characters: ${option.name}`);
        }
        // Discord requires option names to be lowercase, no spaces
        const formattedName = option.name.toLowerCase().replace(/\s+/g, '_');
        if (formattedName !== option.name) {
            console.warn(`Option name "${option.name}" was automatically converted to "${formattedName}" to conform to Discord's requirements`);
            option.name = formattedName;
        }
        if (!option.description || option.description.length < 1 || option.description.length > 100) {
            throw new Error(`Option description must be between 1-100 characters for option: ${option.name}`);
        }
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
/**
 * Builder for creating subcommands
 */
class SubcommandBuilder {
    constructor() {
        this.data = {
            type: discord_js_1.ApplicationCommandOptionType.Subcommand,
            name: '',
            description: '',
            options: []
        };
    }
    /**
     * Sets the subcommand name
     * @param name Subcommand name (must be lowercase, without spaces, 1-32 characters)
     */
    setName(name) {
        if (!name || name.length < 1 || name.length > 32) {
            throw new Error('Subcommand name must be between 1-32 characters');
        }
        const formattedName = name.toLowerCase().replace(/\s+/g, '-');
        this.data.name = formattedName;
        return this;
    }
    /**
     * Sets the subcommand description
     * @param description Subcommand description (1-100 characters)
     */
    setDescription(description) {
        if (!description || description.length < 1 || description.length > 100) {
            throw new Error('Subcommand description must be between 1-100 characters');
        }
        this.data.description = description;
        return this;
    }
    /**
     * Adds a string option to the subcommand
     * @param builder Function to configure the option
     */
    addStringOption(builder) {
        const option = {
            name: '',
            description: '',
            type: discord_js_1.ApplicationCommandOptionType.String
        };
        const builtOption = builder(option);
        this.validateOption(builtOption);
        this.data.options = this.data.options || [];
        this.data.options.push(builtOption);
        return this;
    }
    /**
     * Adds an integer option to the subcommand
     * @param builder Function to configure the option
     */
    addIntegerOption(builder) {
        const option = {
            name: '',
            description: '',
            type: discord_js_1.ApplicationCommandOptionType.Integer
        };
        const builtOption = builder(option);
        this.validateOption(builtOption);
        this.data.options = this.data.options || [];
        this.data.options.push(builtOption);
        return this;
    }
    /**
     * Adds a boolean option to the subcommand
     * @param builder Function to configure the option
     */
    addBooleanOption(builder) {
        const option = {
            name: '',
            description: '',
            type: discord_js_1.ApplicationCommandOptionType.Boolean
        };
        const builtOption = builder(option);
        this.validateOption(builtOption);
        this.data.options = this.data.options || [];
        this.data.options.push(builtOption);
        return this;
    }
    /**
     * Adds a user option to the subcommand
     * @param builder Function to configure the option
     */
    addUserOption(builder) {
        const option = {
            name: '',
            description: '',
            type: discord_js_1.ApplicationCommandOptionType.User
        };
        const builtOption = builder(option);
        this.validateOption(builtOption);
        this.data.options = this.data.options || [];
        this.data.options.push(builtOption);
        return this;
    }
    /**
     * Adds a channel option to the subcommand
     * @param builder Function to configure the option
     */
    addChannelOption(builder) {
        const option = {
            name: '',
            description: '',
            type: discord_js_1.ApplicationCommandOptionType.Channel
        };
        const builtOption = builder(option);
        this.validateOption(builtOption);
        this.data.options = this.data.options || [];
        this.data.options.push(builtOption);
        return this;
    }
    /**
     * Adds a role option to the subcommand
     * @param builder Function to configure the option
     */
    addRoleOption(builder) {
        const option = {
            name: '',
            description: '',
            type: discord_js_1.ApplicationCommandOptionType.Role
        };
        const builtOption = builder(option);
        this.validateOption(builtOption);
        this.data.options = this.data.options || [];
        this.data.options.push(builtOption);
        return this;
    }
    /**
     * Validates an option object
     * @param option Option to validate
     */
    validateOption(option) {
        if (!option.name || option.name.length < 1 || option.name.length > 32) {
            throw new Error(`Option name must be between 1-32 characters: ${option.name}`);
        }
        const formattedName = option.name.toLowerCase().replace(/\s+/g, '_');
        if (formattedName !== option.name) {
            console.warn(`Option name "${option.name}" was automatically converted to "${formattedName}" to conform to Discord's requirements`);
            option.name = formattedName;
        }
        if (!option.description || option.description.length < 1 || option.description.length > 100) {
            throw new Error(`Option description must be between 1-100 characters for option: ${option.name}`);
        }
    }
    /**
     * Returns the JSON representation of this subcommand
     * @returns The JSON data for the API
     */
    toJSON() {
        if (!this.data.name) {
            throw new Error('Subcommand name is required');
        }
        if (!this.data.description) {
            throw new Error('Subcommand description is required');
        }
        return this.data;
    }
}
exports.SubcommandBuilder = SubcommandBuilder;
/**
 * Builder for creating subcommand groups
 */
class SubcommandGroupBuilder {
    constructor() {
        this.data = {
            type: discord_js_1.ApplicationCommandOptionType.SubcommandGroup,
            name: '',
            description: '',
            options: []
        };
    }
    /**
     * Sets the group name
     * @param name Group name (must be lowercase, without spaces, 1-32 characters)
     */
    setName(name) {
        if (!name || name.length < 1 || name.length > 32) {
            throw new Error('Subcommand group name must be between 1-32 characters');
        }
        const formattedName = name.toLowerCase().replace(/\s+/g, '-');
        this.data.name = formattedName;
        return this;
    }
    /**
     * Sets the group description
     * @param description Group description (1-100 characters)
     */
    setDescription(description) {
        if (!description || description.length < 1 || description.length > 100) {
            throw new Error('Subcommand group description must be between 1-100 characters');
        }
        this.data.description = description;
        return this;
    }
    /**
     * Adds a subcommand to this group
     * @param builder Function to configure the subcommand
     */
    addSubcommand(builder) {
        const subcommand = new SubcommandBuilder();
        const builtSubcommand = builder(subcommand);
        this.data.options = this.data.options || [];
        this.data.options.push(builtSubcommand.toJSON());
        return this;
    }
    /**
     * Returns the JSON representation of this subcommand group
     * @returns The JSON data for the API
     */
    toJSON() {
        if (!this.data.name) {
            throw new Error('Subcommand group name is required');
        }
        if (!this.data.description) {
            throw new Error('Subcommand group description is required');
        }
        if (!this.data.options || this.data.options.length === 0) {
            throw new Error('Subcommand group must contain at least one subcommand');
        }
        return this.data;
    }
}
exports.SubcommandGroupBuilder = SubcommandGroupBuilder;
