"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectMenuBuilder = void 0;
const types_1 = require("../../types");
/**
 * Builder for creating select menus
 */
class SelectMenuBuilder {
    constructor() {
        this._customId = '';
        this._placeholder = '';
        this._minValues = 1;
        this._maxValues = 1;
        this._disabled = false;
        this._options = [];
        this._handler = null;
    }
    /**
     * Sets the custom ID for the select menu
     * @param customId Unique ID for the menu to handle interactions
     */
    setCustomId(customId) {
        this._customId = customId;
        return this;
    }
    /**
     * Sets the placeholder text for the select menu
     * @param placeholder Text displayed when nothing is selected
     */
    setPlaceholder(placeholder) {
        this._placeholder = placeholder;
        return this;
    }
    /**
     * Sets the minimum number of options that a user must select
     * @param min Minimum number of selectable options
     */
    setMinValues(min) {
        this._minValues = min;
        return this;
    }
    /**
     * Sets the maximum number of options that a user can select
     * @param max Maximum number of selectable options
     */
    setMaxValues(max) {
        this._maxValues = max;
        return this;
    }
    /**
     * Sets whether the select menu is disabled
     * @param disabled Whether the menu is disabled
     */
    setDisabled(disabled) {
        this._disabled = disabled;
        return this;
    }
    /**
     * Adds options to the select menu
     * @param options Array of options for the select menu
     */
    addOptions(options) {
        this._options = [...this._options, ...options];
        return this;
    }
    /**
     * Adds a single option to the select menu
     * @param option Option for the select menu
     */
    addOption(option) {
        this._options.push(option);
        return this;
    }
    /**
     * Sets the handler for selection in the select menu
     * @param handler Handler function called when an option is selected
     */
    setHandler(handler) {
        this._handler = handler;
        return this;
    }
    /**
     * Builds and returns the select menu object
     * @returns Select menu object ready for registration
     */
    build() {
        if (!this._customId) {
            throw new Error('Custom ID is required for select menus');
        }
        if (this._options.length === 0) {
            throw new Error('Select menu must have at least one option');
        }
        if (!this._handler) {
            throw new Error('Handler is required for select menus');
        }
        return {
            type: types_1.InteractionType.SELECT_MENU,
            id: this._customId,
            handler: this._handler
        };
    }
    /**
     * Creates a data object to send to Discord API
     * @returns Select menu data object for Discord API
     */
    toJSON() {
        return {
            type: 3, // SELECT_MENU type
            custom_id: this._customId,
            placeholder: this._placeholder,
            min_values: this._minValues,
            max_values: this._maxValues,
            disabled: this._disabled,
            options: this._options.map(option => ({
                label: option.label,
                value: option.value,
                description: option.description,
                emoji: option.emoji ? { name: option.emoji } : undefined,
                default: option.default
            }))
        };
    }
}
exports.SelectMenuBuilder = SelectMenuBuilder;
