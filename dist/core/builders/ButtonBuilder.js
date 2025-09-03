"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ButtonBuilder = void 0;
const types_1 = require("../../types");
/**
 * Builder for creating buttons
 */
class ButtonBuilder {
    constructor() {
        this._customId = '';
        this._label = '';
        this._style = types_1.ButtonStyle.PRIMARY;
        this._disabled = false;
        this._handler = null;
        this._middlewares = [];
    }
    /**
     * Sets the custom ID for the button
     * @param customId Unique ID for the button to handle interactions
     */
    setCustomId(customId) {
        this._customId = customId;
        return this;
    }
    /**
     * Sets the text on the button
     * @param label Text displayed on the button
     */
    setLabel(label) {
        this._label = label;
        return this;
    }
    /**
     * Sets the button style
     * @param style Style from ButtonStyle enum
     */
    setStyle(style) {
        this._style = style;
        return this;
    }
    /**
     * Sets the URL for the button (only for ButtonStyle.LINK)
     * @param url URL to which the user will be redirected when clicked
     */
    setURL(url) {
        this._url = url;
        return this;
    }
    /**
     * Sets the emoji for the button
     * @param emoji Emoji displayed on the button
     */
    setEmoji(emoji) {
        this._emoji = emoji;
        return this;
    }
    /**
     * Sets whether the button is disabled
     * @param disabled Whether the button is disabled
     */
    setDisabled(disabled) {
        this._disabled = disabled;
        return this;
    }
    /**
     * Sets the button click handler
     * @param handler Handler function called when the button is clicked
     */
    setHandler(handler) {
        this._handler = handler;
        return this;
    }
    /** Attach one or more middlewares to this button */
    use(...middlewares) {
        this._middlewares.push(...middlewares);
        return this;
    }
    /**
     * Builds and returns the button object
     * @returns Button object ready for registration
     */
    build() {
        if (this._style === types_1.ButtonStyle.LINK) {
            if (!this._url) {
                throw new Error('URL is required for LINK buttons');
            }
            // For link buttons, customId and handler are not needed
            return {
                type: types_1.InteractionType.BUTTON,
                id: this._url,
                handler: async () => { }
            };
        }
        if (!this._customId) {
            throw new Error('Custom ID is required for non-LINK buttons');
        }
        if (!this._handler) {
            throw new Error('Handler is required for non-LINK buttons');
        }
        return {
            type: types_1.InteractionType.BUTTON,
            id: this._customId,
            handler: this._handler,
            middlewares: this._middlewares
        };
    }
    /**
     * Creates a data object to send to Discord API
     * @returns Button data object for Discord API
     */
    toJSON() {
        const json = {
            type: 2, // Button type
            style: this._style,
            label: this._label,
            disabled: this._disabled
        };
        if (this._style === types_1.ButtonStyle.LINK) {
            json.url = this._url;
        }
        else {
            json.custom_id = this._customId;
        }
        if (this._emoji) {
            json.emoji = { name: this._emoji };
        }
        return json;
    }
}
exports.ButtonBuilder = ButtonBuilder;
