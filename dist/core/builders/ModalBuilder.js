"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModalBuilder = exports.ModalInputStyle = void 0;
const discord_js_1 = require("discord.js");
const types_1 = require("../../types");
/**
 * Modal input styles
 * @deprecated Use TextInputStyle from discord.js
 */
var ModalInputStyle;
(function (ModalInputStyle) {
    ModalInputStyle[ModalInputStyle["SHORT"] = 1] = "SHORT";
    ModalInputStyle[ModalInputStyle["PARAGRAPH"] = 2] = "PARAGRAPH";
})(ModalInputStyle || (exports.ModalInputStyle = ModalInputStyle = {}));
/**
 * Builder for creating modal windows
 */
class ModalBuilder {
    constructor() {
        this._customId = '';
        this._title = '';
        this._components = [];
        this._handler = null;
    }
    /**
     * Sets the custom ID for the modal
     * @param customId Unique ID for the modal to handle interactions
     */
    setCustomId(customId) {
        this._customId = customId;
        return this;
    }
    /**
     * Sets the title of the modal
     * @param title Modal title
     */
    setTitle(title) {
        this._title = title;
        return this;
    }
    /**
     * Adds a short text input field
     * @param customId Unique ID for the field
     * @param label Field label
     * @param options Additional field options
     */
    addShortTextInput(customId, label, options) {
        this._components.push({
            customId,
            label,
            style: discord_js_1.TextInputStyle.Short,
            placeholder: options?.placeholder,
            value: options?.value,
            minLength: options?.minLength,
            maxLength: options?.maxLength,
            required: options?.required ?? true
        });
        return this;
    }
    /**
     * Adds a paragraph text input field
     * @param customId Unique ID for the field
     * @param label Field label
     * @param options Additional field options
     */
    addParagraphTextInput(customId, label, options) {
        this._components.push({
            customId,
            label,
            style: discord_js_1.TextInputStyle.Paragraph,
            placeholder: options?.placeholder,
            value: options?.value,
            minLength: options?.minLength,
            maxLength: options?.maxLength,
            required: options?.required ?? true
        });
        return this;
    }
    /**
     * Sets the handler for modal submission
     * @param handler Handler function called when the modal is submitted
     */
    setHandler(handler) {
        this._handler = handler;
        return this;
    }
    /**
     * Builds and returns the modal object
     * @returns Modal object ready for registration
     */
    build() {
        if (!this._customId) {
            throw new Error('Custom ID is required for modals');
        }
        if (!this._title) {
            throw new Error('Title is required for modals');
        }
        if (this._components.length === 0) {
            throw new Error('Modal must have at least one component');
        }
        if (this._components.length > 5) {
            throw new Error('Modal cannot have more than 5 components');
        }
        if (!this._handler) {
            throw new Error('Handler is required for modals');
        }
        return {
            type: types_1.InteractionType.MODAL,
            id: this._customId,
            handler: this._handler
        };
    }
    /**
     * Creates a data object to send to Discord API
     * @returns Modal data object for Discord API
     */
    toJSON() {
        return {
            custom_id: this._customId,
            title: this._title,
            components: this._components.map((component) => ({
                type: 1, // Action Row
                components: [
                    {
                        type: 4, // Text Input
                        custom_id: component.customId,
                        label: component.label,
                        style: component.style,
                        placeholder: component.placeholder,
                        value: component.value,
                        min_length: component.minLength,
                        max_length: component.maxLength,
                        required: component.required
                    }
                ]
            }))
        };
    }
}
exports.ModalBuilder = ModalBuilder;
