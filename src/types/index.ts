import { 
  ButtonInteraction, 
  CommandInteraction as DiscordCommandInteraction, 
  ModalSubmitInteraction, 
  SelectMenuInteraction,
  ContextMenuCommandInteraction,
  AutocompleteInteraction,
  ApplicationCommandOptionType,
  RESTPostAPIApplicationCommandsJSONBody,
  Interaction
} from 'discord.js';

/**
 * Extended CommandInteraction type
 */
export type CommandInteraction = DiscordCommandInteraction;

/**
 * Handler for slash commands
 */
export type CommandHandler = (interaction: CommandInteraction) => Promise<void>;

/**
 * Handler for buttons
 */
export type ButtonHandler = (interaction: ButtonInteraction) => Promise<void>;

/**
 * Handler for select menus
 */
export type SelectMenuHandler = (interaction: SelectMenuInteraction) => Promise<void>;

/**
 * Handler for modal windows
 */
export type ModalHandler = (interaction: ModalSubmitInteraction) => Promise<void>;

/**
 * Handler for context menus
 */
export type ContextMenuHandler = (interaction: ContextMenuCommandInteraction) => Promise<void>;

/**
 * Handler for autocomplete
 */
export type AutocompleteHandler = (interaction: AutocompleteInteraction) => Promise<void>;

/**
 * Custom error handler for interactions
 */
export type ErrorHandler = (interaction: Interaction, error: Error) => Promise<void> | void;

/**
 * Interaction types
 */
export enum InteractionType {
  COMMAND = 'command',
  BUTTON = 'button',
  SELECT_MENU = 'selectMenu',
  MODAL = 'modal',
  CONTEXT_MENU = 'contextMenu',
  AUTOCOMPLETE = 'autocomplete'
}

/**
 * Base interface for all registerable interactions
 */
export interface BaseInteraction {
  type: InteractionType;
  id: string;
}

/**
 * Interface for commands
 */
export interface Command extends BaseInteraction {
  type: InteractionType.COMMAND;
  id: string;
  handler: CommandHandler;
  data: RESTPostAPIApplicationCommandsJSONBody;
  /** Optional cooldown in milliseconds */
  cooldown?: number;
}

/**
 * Interface for buttons
 */
export interface Button extends BaseInteraction {
  type: InteractionType.BUTTON;
  id: string;
  handler: ButtonHandler;
}

/**
 * Interface for select menus
 */
export interface SelectMenu extends BaseInteraction {
  type: InteractionType.SELECT_MENU;
  id: string;
  handler: SelectMenuHandler;
}

/**
 * Interface for modal windows
 */
export interface Modal extends BaseInteraction {
  type: InteractionType.MODAL;
  id: string;
  handler: ModalHandler;
}

/**
 * Interface for context menus
 */
export interface ContextMenu extends BaseInteraction {
  type: InteractionType.CONTEXT_MENU;
  id: string;
  handler: ContextMenuHandler;
  data: RESTPostAPIApplicationCommandsJSONBody;
}

/**
 * Interface for autocomplete
 */
export interface Autocomplete extends BaseInteraction {
  type: InteractionType.AUTOCOMPLETE;
  id: string;
  handler: AutocompleteHandler;
}

/**
 * Options for customizing error responses
 */
export interface ErrorResponseOptions {
  /** Custom error message to show instead of default */
  customMessage?: string;
  /** Whether the error message should be ephemeral */
  ephemeral?: boolean;
}

/**
 * Options for interaction manager
 */
export interface InteractionManagerOptions {
  /** Automatically register event handlers */
  autoRegisterEvents?: boolean;
  /** Debug mode */
  debug?: boolean;
  /** Default error message for interaction errors */
  defaultErrorMessage?: string;
  /** Whether default error messages should be ephemeral */
  defaultErrorEphemeral?: boolean;
  /** Custom error handler for all interactions */
  onError?: ErrorHandler;
  /** Maximum time in ms to wait for an interaction handler to complete */
  interactionTimeout?: number;
  /** Bot token (useful when client token is not available at initialization) */
  botToken?: string;
  /** Message shown when a command is used before cooldown expires. Use {remaining} placeholder for seconds */
  cooldownMessage?: string;
}

/**
 * Type for registerable interactions
 */
export type RegisterableInteraction = 
  | Command
  | Button
  | SelectMenu
  | Modal
  | ContextMenu
  | Autocomplete;

/**
 * Type for possible button styles
 */
export enum ButtonStyle {
  PRIMARY = 1,
  SECONDARY = 2,
  SUCCESS = 3,
  DANGER = 4,
  LINK = 5
}

/**
 * Options for creating select menu
 */
export interface SelectMenuOption {
  label: string;
  value: string;
  description?: string;
  emoji?: string;
  default?: boolean;
}

/**
 * Options for creating slash command
 */
export type CommandOption = {
  name: string;
  description: string;
  type: ApplicationCommandOptionType;
  required?: boolean;
  choices?: Array<{
    name: string;
    value: string | number;
  }>;
  options?: CommandOption[];
};