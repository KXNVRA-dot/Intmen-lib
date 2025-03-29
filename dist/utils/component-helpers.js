"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createActionRow = createActionRow;
exports.createActionRows = createActionRows;
exports.createButton = createButton;
exports.createLinkButton = createLinkButton;
exports.createSelectMenu = createSelectMenu;
exports.createTextInput = createTextInput;
const discord_js_1 = require("discord.js");
const types_1 = require("../types");
/**
 * Create an action row containing message components for Discord interactions
 * @param components One or more components to include in the row
 * @returns An action row containing the given components
 */
function createActionRow(...components) {
    return {
        type: discord_js_1.ComponentType.ActionRow, // ActionRow type
        components,
    };
}
/**
 * Create multiple action rows, each containing the specified components
 * @param componentRows Arrays of components, where each array becomes one row
 * @returns Array of action rows
 */
function createActionRows(...componentRows) {
    return componentRows.map(components => createActionRow(...components));
}
/**
 * Create a button component with a custom ID (for handling click events)
 * @param customId Unique ID for the button
 * @param options Button configuration options
 * @returns Button component for use in an action row
 */
function createButton(customId, options = {}) {
    return {
        type: discord_js_1.ComponentType.Button,
        custom_id: customId,
        label: options.label || '',
        style: (options.style || types_1.ButtonStyle.PRIMARY),
        emoji: options.emoji ? { name: options.emoji } : undefined,
        disabled: options.disabled || false,
    };
}
/**
 * Create a link button component
 * @param url URL to open when the button is clicked
 * @param options Button configuration options
 * @returns Button component for use in an action row
 */
function createLinkButton(url, options = {}) {
    return {
        type: discord_js_1.ComponentType.Button,
        style: discord_js_1.ButtonStyle.Link,
        url,
        label: options.label || 'Link',
        emoji: options.emoji ? { name: options.emoji } : undefined,
        disabled: options.disabled || false,
    };
}
/**
 * Create a select menu component
 * @param customId Unique ID for the select menu
 * @param options Select menu configuration options
 * @returns Select menu component for use in an action row
 */
function createSelectMenu(customId, options = {}) {
    return {
        type: discord_js_1.ComponentType.SelectMenu,
        custom_id: customId,
        placeholder: options.placeholder,
        options: options.options?.map(option => ({
            label: option.label,
            value: option.value,
            description: option.description,
            emoji: option.emoji ? { name: option.emoji } : undefined,
            default: option.default || false,
        })) || [],
        min_values: options.minValues ?? 1,
        max_values: options.maxValues ?? 1,
        disabled: options.disabled || false,
    };
}
/**
 * Create a text input component for a modal
 * @param customId Unique ID for the text input
 * @param label Label text shown above the input
 * @param options Text input configuration options
 * @returns Text input component for use in a modal
 */
function createTextInput(customId, label, options = {}) {
    return {
        type: discord_js_1.ComponentType.TextInput,
        custom_id: customId,
        label,
        style: options.style || discord_js_1.TextInputStyle.Short,
        placeholder: options.placeholder,
        value: options.value,
        min_length: options.minLength,
        max_length: options.maxLength,
        required: options.required !== undefined ? options.required : true,
    };
}
