import { 
  APIActionRowComponent, 
  APIMessageActionRowComponent,
  ButtonStyle as DiscordButtonStyle,
  ComponentType,
  APIButtonComponentWithCustomId,
  APIButtonComponentWithURL,
  APISelectMenuComponent,
  APITextInputComponent,
  TextInputStyle
} from 'discord.js';

import { ButtonStyle, SelectMenuOption } from '../types';

/**
 * Create an action row containing message components for Discord interactions
 * @param components One or more components to include in the row
 * @returns An action row containing the given components
 */
export function createActionRow(
  ...components: APIMessageActionRowComponent[]
): APIActionRowComponent<APIMessageActionRowComponent> {
  return {
    type: ComponentType.ActionRow, // ActionRow type
    components,
  };
}

/**
 * Create multiple action rows, each containing the specified components
 * @param componentRows Arrays of components, where each array becomes one row
 * @returns Array of action rows
 */
export function createActionRows(
  ...componentRows: APIMessageActionRowComponent[][]
): APIActionRowComponent<APIMessageActionRowComponent>[] {
  return componentRows.map(components => createActionRow(...components));
}

/**
 * Create a button component with a custom ID (for handling click events)
 * @param customId Unique ID for the button
 * @param options Button configuration options
 * @returns Button component for use in an action row
 */
export function createButton(
  customId: string,
  options: {
    label?: string;
    style?: ButtonStyle;
    emoji?: string;
    disabled?: boolean;
  } = {}
): APIButtonComponentWithCustomId {
  return {
    type: ComponentType.Button,
    custom_id: customId,
    label: options.label || '',
    style: (options.style || ButtonStyle.PRIMARY) as number,
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
export function createLinkButton(
  url: string,
  options: {
    label?: string;
    emoji?: string;
    disabled?: boolean;
  } = {}
): APIButtonComponentWithURL {
  return {
    type: ComponentType.Button,
    style: DiscordButtonStyle.Link,
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
export function createSelectMenu(
  customId: string,
  options: {
    placeholder?: string;
    options?: SelectMenuOption[];
    minValues?: number;
    maxValues?: number;
    disabled?: boolean;
  } = {}
): APISelectMenuComponent {
  return {
    type: ComponentType.SelectMenu,
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
export function createTextInput(
  customId: string,
  label: string,
  options: {
    style?: TextInputStyle;
    placeholder?: string;
    value?: string;
    minLength?: number;
    maxLength?: number;
    required?: boolean;
  } = {}
): APITextInputComponent {
  return {
    type: ComponentType.TextInput,
    custom_id: customId,
    label,
    style: options.style || TextInputStyle.Short,
    placeholder: options.placeholder,
    value: options.value,
    min_length: options.minLength,
    max_length: options.maxLength,
    required: options.required !== undefined ? options.required : true,
  };
}
