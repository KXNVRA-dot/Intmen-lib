// Core components
export { InteractionManager } from './core/InteractionManager';

// Builders
export { SlashCommandBuilder, SubcommandBuilder, SubcommandGroupBuilder } from './core/builders/SlashCommandBuilder';
export { ContextMenuCommandBuilder } from './core/builders/ContextMenuCommandBuilder';
export { ButtonBuilder } from './core/builders/ButtonBuilder';
export { SelectMenuBuilder } from './core/builders/SelectMenuBuilder';
export { 
  ModalBuilder, 
  ModalInputComponent
} from './core/builders/ModalBuilder';

// Types
export {
  Command,
  InteractionHandler,
  Middleware,
  InteractionContext,
  CommandOption,
  ButtonHandler,
  ModalHandler,
  SelectMenuHandler,
  ErrorResponseOptions,
  ErrorHandler,
  InteractionManagerOptions,
  ButtonStyle,
  SelectMenuOption,
  InteractionType,
  ContextMenu,
  Autocomplete,
  RegisterableInteraction,
  CooldownScope
} from './types';

// Utilities
export { Logger, LogLevel } from './utils/logger';
export { 
  createActionRow, 
  createActionRows, 
  createButton, 
  createSelectMenu,
  createTextInput
} from './utils/component-helpers';
export { withTimeout } from './utils/interaction-timeout';
export { PermissionUtils } from './utils/permissions';
export { InteractionValidators } from './utils/interaction-validators';

// Re-export TimeoutOptions from interaction-timeout
export type { TimeoutOptions } from './utils/interaction-timeout';

// Re-export necessary types from discord.js for convenience
export {
  Client,
  GatewayIntentBits,
  Partials,
  ActivityType,
  ChannelType,
  ApplicationCommandType,
  ApplicationCommandOptionType,
  MessageType,
  TextInputStyle,
  Interaction,
  CommandInteraction,
  ButtonInteraction,
  SelectMenuInteraction,
  ModalSubmitInteraction,
  ContextMenuCommandInteraction,
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  UserContextMenuCommandInteraction,
  MessageContextMenuCommandInteraction,
  REST,
  Routes
} from 'discord.js';