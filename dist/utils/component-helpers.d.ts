import { APIActionRowComponent, APIMessageActionRowComponent, APIButtonComponentWithCustomId, APIButtonComponentWithURL, APISelectMenuComponent, APITextInputComponent, TextInputStyle } from 'discord.js';
import { ButtonStyle, SelectMenuOption } from '../types';
/**
 * Create an action row containing message components for Discord interactions
 * @param components One or more components to include in the row
 * @returns An action row containing the given components
 */
export declare function createActionRow(...components: APIMessageActionRowComponent[]): APIActionRowComponent<APIMessageActionRowComponent>;
/**
 * Create multiple action rows, each containing the specified components
 * @param componentRows Arrays of components, where each array becomes one row
 * @returns Array of action rows
 */
export declare function createActionRows(...componentRows: APIMessageActionRowComponent[][]): APIActionRowComponent<APIMessageActionRowComponent>[];
/**
 * Create a button component with a custom ID (for handling click events)
 * @param customId Unique ID for the button
 * @param options Button configuration options
 * @returns Button component for use in an action row
 */
export declare function createButton(customId: string, options?: {
    label?: string;
    style?: ButtonStyle;
    emoji?: string;
    disabled?: boolean;
}): APIButtonComponentWithCustomId;
/**
 * Create a link button component
 * @param url URL to open when the button is clicked
 * @param options Button configuration options
 * @returns Button component for use in an action row
 */
export declare function createLinkButton(url: string, options?: {
    label?: string;
    emoji?: string;
    disabled?: boolean;
}): APIButtonComponentWithURL;
/**
 * Create a select menu component
 * @param customId Unique ID for the select menu
 * @param options Select menu configuration options
 * @returns Select menu component for use in an action row
 */
export declare function createSelectMenu(customId: string, options?: {
    placeholder?: string;
    options?: SelectMenuOption[];
    minValues?: number;
    maxValues?: number;
    disabled?: boolean;
}): APISelectMenuComponent;
/**
 * Create a text input component for a modal
 * @param customId Unique ID for the text input
 * @param label Label text shown above the input
 * @param options Text input configuration options
 * @returns Text input component for use in a modal
 */
export declare function createTextInput(customId: string, label: string, options?: {
    style?: TextInputStyle;
    placeholder?: string;
    value?: string;
    minLength?: number;
    maxLength?: number;
    required?: boolean;
}): APITextInputComponent;
