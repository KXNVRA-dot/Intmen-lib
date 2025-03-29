"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextMenuCommandBuilder = void 0;
const discord_js_1 = require("discord.js");
const types_1 = require("../../types");
/**
 * Builder for creating context menu commands (user and message commands)
 */
class ContextMenuCommandBuilder {
    /**
     * Creates a new context menu command builder instance
     */
    constructor() {
        this._handler = null;
        this._defaultMemberPermissions = null;
        this._dmPermission = true;
        this._nsfw = false;
        this._data = {
            name: '',
            type: discord_js_1.ApplicationCommandType.User // Default to user command
        };
    }
    /**
     * Sets the command name
     * @param name Command name (1-32 characters)
     */
    setName(name) {
        if (!name || name.length < 1 || name.length > 32) {
            throw new Error('Context menu command name must be between 1-32 characters');
        }
        this._data.name = name;
        return this;
    }
    /**
     * Sets the command type to user context menu
     */
    setUserContextMenu() {
        this._data.type = discord_js_1.ApplicationCommandType.User;
        return this;
    }
    /**
     * Sets the command type to message context menu
     */
    setMessageContextMenu() {
        this._data.type = discord_js_1.ApplicationCommandType.Message;
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
exports.ContextMenuCommandBuilder = ContextMenuCommandBuilder;
