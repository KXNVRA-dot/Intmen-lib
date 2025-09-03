import { SelectMenu, SelectMenuHandler, SelectMenuOption, Middleware } from '../../types';
/**
 * Builder for creating select menus
 */
export declare class SelectMenuBuilder {
    private _customId;
    private _placeholder;
    private _minValues;
    private _maxValues;
    private _disabled;
    private _options;
    private _handler;
    private _middlewares;
    /**
     * Sets the custom ID for the select menu
     * @param customId Unique ID for the menu to handle interactions
     */
    setCustomId(customId: string): SelectMenuBuilder;
    /**
     * Sets the placeholder text for the select menu
     * @param placeholder Text displayed when nothing is selected
     */
    setPlaceholder(placeholder: string): SelectMenuBuilder;
    /**
     * Sets the minimum number of options that a user must select
     * @param min Minimum number of selectable options
     */
    setMinValues(min: number): SelectMenuBuilder;
    /**
     * Sets the maximum number of options that a user can select
     * @param max Maximum number of selectable options
     */
    setMaxValues(max: number): SelectMenuBuilder;
    /**
     * Sets whether the select menu is disabled
     * @param disabled Whether the menu is disabled
     */
    setDisabled(disabled: boolean): SelectMenuBuilder;
    /**
     * Adds options to the select menu
     * @param options Array of options for the select menu
     */
    addOptions(options: SelectMenuOption[]): SelectMenuBuilder;
    /**
     * Adds a single option to the select menu
     * @param option Option for the select menu
     */
    addOption(option: SelectMenuOption): SelectMenuBuilder;
    /**
     * Sets the handler for selection in the select menu
     * @param handler Handler function called when an option is selected
     */
    setHandler(handler: SelectMenuHandler): SelectMenuBuilder;
    /** Attach one or more middlewares to this select menu */
    use(...middlewares: Middleware[]): SelectMenuBuilder;
    /**
     * Builds and returns the select menu object
     * @returns Select menu object ready for registration
     */
    build(): SelectMenu;
    /**
     * Creates a data object to send to Discord API
     * @returns Select menu data object for Discord API
     */
    toJSON(): {
        type: number;
        custom_id: string;
        placeholder: string;
        min_values: number;
        max_values: number;
        disabled: boolean;
        options: {
            label: string;
            value: string;
            description: string | undefined;
            emoji: {
                name: string;
            } | undefined;
            default: boolean | undefined;
        }[];
    };
}
