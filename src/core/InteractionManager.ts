import { 
  Client, 
  Interaction,
  ButtonInteraction,
  CommandInteraction,
  ModalSubmitInteraction,
  SelectMenuInteraction,
  ContextMenuCommandInteraction,
  AutocompleteInteraction,
  REST,
  Routes,
  RESTPostAPIApplicationCommandsJSONBody,
  Collection,
  APIApplicationCommandOption
} from 'discord.js';

import {
  InteractionManagerOptions,
  Command,
  Button,
  SelectMenu,
  Modal,
  ContextMenu,
  Autocomplete,
  InteractionType,
  RegisterableInteraction,
  ErrorResponseOptions,
  SelectMenuHandler,
  ButtonHandler,
  ModalHandler
} from '../types';

import { Logger, LoggerOptions, LogLevel } from '../utils/logger';
import { withTimeout } from '../utils/interaction-timeout';

/**
 * Interaction Manager - the main library class
 * for managing all types of interactions
 */
export class InteractionManager {
  private readonly client: Client;
  private readonly options: InteractionManagerOptions;
  private readonly logger: Logger;
  private readonly interactions: Map<string, RegisterableInteraction>;
  private readonly rest: REST;
  private readonly patterns: Map<RegExp, RegisterableInteraction>;
  private readonly cooldowns: Map<string, Map<string, number>>;

  /**
   * Creates a new interaction manager instance
   * @param client Discord.js client
   * @param options Options for the manager
   */
  constructor(client: Client, options: InteractionManagerOptions = {}) {
    this.client = client;
    this.options = {
      autoRegisterEvents: true,
      debug: false,
      defaultErrorMessage: 'An error occurred while handling the interaction',
      defaultErrorEphemeral: true,
      interactionTimeout: 15000,
      cooldownMessage: 'Please wait {remaining}s before using this command again.',
      ...options
    };
    this.logger = new Logger({
      prefix: 'Intmen-lib',
      level: this.options.debug ? LogLevel.DEBUG : LogLevel.INFO
    });
    this.interactions = new Map<string, RegisterableInteraction>();
    this.patterns = new Map<RegExp, RegisterableInteraction>();
    this.cooldowns = new Map<string, Map<string, number>>();
    
    // Initialize the REST client with the provided token
    if (!client.token && !this.options.botToken) {
      this.logger.warn('No token provided - API commands registration will fail. Either the Client must be ready or botToken must be provided in options');
      this.rest = new REST({ version: '10' });
    } else {
      this.rest = new REST({ version: '10' }).setToken(client.token || this.options.botToken || '');
    }

    // Automatically register event handlers
    if (this.options.autoRegisterEvents) {
      this.registerEvents();
    }
  }

  /**
   * Registers interaction event handlers
   */
  private registerEvents(): void {
    this.client.on('interactionCreate', (interaction: Interaction) => this.handleInteraction(interaction));
    this.logger.debug('Interaction events registered');
  }

  /**
   * Handles incoming interaction
   * @param interaction Interaction from Discord API
   */
  private async handleInteraction(interaction: Interaction): Promise<void> {
    try {
      this.logger.debug(`Received interaction: ${interaction.type}`);

      if (interaction.isCommand() || interaction.isContextMenuCommand()) {
        await this.handleCommandInteraction(interaction);
      } else if (interaction.isButton()) {
        await this.handleButtonInteraction(interaction);
      } else if (interaction.isSelectMenu()) {
        await this.handleSelectMenuInteraction(interaction);
      } else if (interaction.isModalSubmit()) {
        await this.handleModalInteraction(interaction);
      } else if (interaction.isAutocomplete()) {
        await this.handleAutocompleteInteraction(interaction);
      } else {
        this.logger.warn(`Unsupported interaction type: ${interaction.type}`);
      }
    } catch (error) {
      this.logger.error('Error handling interaction', error);
      this.handleInteractionError(interaction, error as Error);
    }
  }

  /**
   * Handles command interaction
   * @param interaction Command interaction
   */
  private async handleCommandInteraction(
    interaction: CommandInteraction | ContextMenuCommandInteraction
  ): Promise<void> {
    const command = this.interactions.get(interaction.commandName);

    if (!command) {
      this.logger.warn(`Command not found: ${interaction.commandName}`);
      return;
    }

    // Cooldown handling for commands
    if (command.cooldown && command.cooldown > 0) {
      const now = Date.now();
      const userCooldowns = this.cooldowns.get(command.id) || new Map<string, number>();
      const lastUsed = userCooldowns.get(interaction.user.id) || 0;
      const remaining = lastUsed + command.cooldown - now;
      if (remaining > 0) {
        const msg = (this.options.cooldownMessage || 'Please wait {remaining}s before using this command again.')
          .replace('{remaining}', Math.ceil(remaining / 1000).toString());
        try {
          if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({ content: msg, ephemeral: true });
          } else if (interaction.deferred && !interaction.replied) {
            await interaction.editReply({ content: msg });
          }
        } catch (err) {
          this.logger.error('Failed to send cooldown message', err as Error);
        }
        return;
      }
      userCooldowns.set(interaction.user.id, now);
      this.cooldowns.set(command.id, userCooldowns);
    }

    try {
      if (command.type === InteractionType.COMMAND || command.type === InteractionType.CONTEXT_MENU) {
        if (command.type === InteractionType.COMMAND && interaction.isCommand()) {
          if (this.options.interactionTimeout && this.options.interactionTimeout > 0) {
            await withTimeout<void, CommandInteraction>(
              (command as Command).handler(interaction as CommandInteraction),
              interaction as CommandInteraction,
              {
                timeout: this.options.interactionTimeout,
                timeoutMessage: 'Command processing timed out',
                ephemeral: true
              }
            );
          } else {
            await (command as Command).handler(interaction as CommandInteraction);
          }
        } else if (command.type === InteractionType.CONTEXT_MENU && interaction.isContextMenuCommand()) {
          if (this.options.interactionTimeout && this.options.interactionTimeout > 0) {
            await withTimeout<void, ContextMenuCommandInteraction>(
              (command as ContextMenu).handler(interaction as ContextMenuCommandInteraction),
              interaction as ContextMenuCommandInteraction,
              {
                timeout: this.options.interactionTimeout,
                timeoutMessage: 'Command processing timed out',
                ephemeral: true
              }
            );
          } else {
            await (command as ContextMenu).handler(interaction as ContextMenuCommandInteraction);
          }
        }
      }
    } catch (error) {
      this.logger.error(`Error executing command ${interaction.commandName}`, error);
      
      // Handle the error with custom or default response
      await this.handleInteractionError(interaction, error as Error, {
        customMessage: `Error executing command ${interaction.commandName}`
      });
    }
  }

  /**
   * Handles button interaction
   * @param interaction Button interaction
   */
  private async handleButtonInteraction(interaction: ButtonInteraction): Promise<void> {
    let button: RegisterableInteraction | undefined = this.interactions.get(interaction.customId);
    
    // If no exact match is found, try pattern matching
    if (!button) {
      for (const [pattern, handler] of this.patterns.entries()) {
        if (pattern.test(interaction.customId) && handler.type === InteractionType.BUTTON) {
          button = handler;
          break;
        }
      }
    }

    if (!button) {
      this.logger.warn(`Button not found: ${interaction.customId}`);
      return;
    }

    try {
      if (button.type === InteractionType.BUTTON) {
        if (this.options.interactionTimeout && this.options.interactionTimeout > 0) {
          await withTimeout<void, ButtonInteraction>(
            button.handler(interaction),
            interaction,
            {
              timeout: this.options.interactionTimeout,
              timeoutMessage: 'Button processing timed out',
              ephemeral: true
            }
          );
        } else {
          await button.handler(interaction);
        }
      }
    } catch (error) {
      this.logger.error(`Error handling button ${interaction.customId}`, error);
      
      // Handle the error with custom or default response
      await this.handleInteractionError(interaction, error as Error, {
        customMessage: `Error handling button ${interaction.customId}`
      });
    }
  }

  /**
   * Handles select menu interaction
   * @param interaction Select menu interaction
   */
  private async handleSelectMenuInteraction(interaction: SelectMenuInteraction): Promise<void> {
    let selectMenu: RegisterableInteraction | undefined = this.interactions.get(interaction.customId);
    
    // If no exact match is found, try pattern matching
    if (!selectMenu) {
      for (const [pattern, handler] of this.patterns.entries()) {
        if (pattern.test(interaction.customId) && handler.type === InteractionType.SELECT_MENU) {
          selectMenu = handler;
          break;
        }
      }
    }

    if (!selectMenu) {
      this.logger.warn(`Select menu not found: ${interaction.customId}`);
      return;
    }

    try {
      if (selectMenu.type === InteractionType.SELECT_MENU) {
        if (this.options.interactionTimeout && this.options.interactionTimeout > 0) {
          await withTimeout<void, SelectMenuInteraction>(
            selectMenu.handler(interaction),
            interaction,
            {
              timeout: this.options.interactionTimeout,
              timeoutMessage: 'Select menu processing timed out',
              ephemeral: true
            }
          );
        } else {
          await selectMenu.handler(interaction);
        }
      }
    } catch (error) {
      this.logger.error(`Error handling select menu ${interaction.customId}`, error);
      
      // Handle the error with custom or default response
      await this.handleInteractionError(interaction, error as Error, {
        customMessage: `Error handling select menu ${interaction.customId}`
      });
    }
  }

  /**
   * Handles modal interaction
   * @param interaction Modal interaction
   */
  private async handleModalInteraction(interaction: ModalSubmitInteraction): Promise<void> {
    let modal: RegisterableInteraction | undefined = this.interactions.get(interaction.customId);
    
    // If no exact match is found, try pattern matching
    if (!modal) {
      for (const [pattern, handler] of this.patterns.entries()) {
        if (pattern.test(interaction.customId) && handler.type === InteractionType.MODAL) {
          modal = handler;
          break;
        }
      }
    }

    if (!modal) {
      this.logger.warn(`Modal not found: ${interaction.customId}`);
      return;
    }

    try {
      if (modal.type === InteractionType.MODAL) {
        if (this.options.interactionTimeout && this.options.interactionTimeout > 0) {
          await withTimeout<void, ModalSubmitInteraction>(
            modal.handler(interaction),
            interaction,
            {
              timeout: this.options.interactionTimeout,
              timeoutMessage: 'Modal processing timed out',
              ephemeral: true
            }
          );
        } else {
          await modal.handler(interaction);
        }
      }
    } catch (error) {
      this.logger.error(`Error handling modal ${interaction.customId}`, error);
      
      // Handle the error with custom or default response
      await this.handleInteractionError(interaction, error as Error, {
        customMessage: `Error handling modal ${interaction.customId}`
      });
    }
  }

  /**
   * Handles autocomplete interaction
   * @param interaction Autocomplete interaction
   */
  private async handleAutocompleteInteraction(interaction: AutocompleteInteraction): Promise<void> {
    const autocomplete = this.interactions.get(interaction.commandName);

    if (!autocomplete) {
      this.logger.warn(`Autocomplete not found: ${interaction.commandName}`);
      
      // For autocomplete, we should at least return an empty array
      try {
        await interaction.respond([]);
      } catch (error) {
        this.logger.error('Failed to respond with empty autocomplete results', error);
      }
      return;
    }

    try {
      if (autocomplete.type === InteractionType.AUTOCOMPLETE) {
        // For autocomplete we don't use timeout as it needs to be fast anyway
        await autocomplete.handler(interaction);
      }
    } catch (error) {
      this.logger.error(`Error handling autocomplete ${interaction.commandName}`, error);
      
      // Try to respond with empty results in case of error
      try {
        await interaction.respond([]);
      } catch (respondError) {
        this.logger.error('Failed to respond with empty autocomplete results after handler error', respondError);
      }
    }
  }

  /**
   * Handles interaction errors with customizable responses
   * @param interaction The interaction that caused the error
   * @param error The error that occurred
   * @param options Options for customizing the error response
   */
  private async handleInteractionError(
    interaction: Interaction | CommandInteraction | ButtonInteraction | SelectMenuInteraction | ModalSubmitInteraction | ContextMenuCommandInteraction,
    error: Error,
    options: ErrorResponseOptions = {}
  ): Promise<void> {
    // Skip for autocomplete interactions as they can only receive a specific response format
    if (interaction.isAutocomplete()) return;
    
    // Check if we can reply to this interaction
    const canReply = !interaction.isAutocomplete() && 
      'replied' in interaction && 
      'deferred' in interaction;
    
    if (!canReply) return;
    
    const replyableInteraction = interaction as unknown as (CommandInteraction | 
      ButtonInteraction | 
      SelectMenuInteraction | 
      ModalSubmitInteraction | 
      ContextMenuCommandInteraction);
    
    // Only try to respond if the interaction hasn't been replied to yet
    if (!replyableInteraction.replied && !replyableInteraction.deferred) {
      try {
        const message = options.customMessage || this.options.defaultErrorMessage || 'An error occurred';
        const ephemeral = options.ephemeral ?? this.options.defaultErrorEphemeral ?? true;
        
        await replyableInteraction.reply({ 
          content: message, 
          ephemeral: ephemeral 
        }).catch(() => {});
      } catch (replyError) {
        this.logger.error('Failed to send error response', replyError);
      }
    }
    
    // Execute custom error handler if provided
    if (this.options.onError) {
      try {
        await this.options.onError(interaction as Interaction, error);
      } catch (handlerError) {
        this.logger.error('Error in custom error handler', handlerError);
      }
    }
  }

  /**
   * Registers a slash command
   * @param command Command object
   */
  public registerCommand(command: Command): void {
    this.interactions.set(command.id, command);
    this.logger.debug(`Registered command: ${command.id}`);
  }

  /**
   * Registers a button
   * @param button Button object
   */
  public registerButton(button: Button): void {
    this.interactions.set(button.id, button);
    this.logger.debug(`Registered button: ${button.id}`);
  }

  /**
   * Registers a button with a pattern-matching ID
   * @param pattern Regular expression to match button IDs
   * @param handler Button handler
   */
  public registerButtonPattern(pattern: RegExp, handler: ButtonHandler): void {
    const button: Button = {
      type: InteractionType.BUTTON,
      id: pattern.toString(),
      handler
    };
    
    this.patterns.set(pattern, button);
    this.logger.debug(`Registered button pattern: ${pattern.toString()}`);
  }

  /**
   * Registers a select menu
   * @param selectMenu Select menu object
   */
  public registerSelectMenu(selectMenu: SelectMenu): void {
    this.interactions.set(selectMenu.id, selectMenu);
    this.logger.debug(`Registered select menu: ${selectMenu.id}`);
  }

  /**
   * Registers a select menu with a pattern-matching ID
   * @param pattern Regular expression to match select menu IDs
   * @param handler Select menu handler
   */
  public registerSelectMenuPattern(pattern: RegExp, handler: SelectMenuHandler): void {
    const selectMenu: SelectMenu = {
      type: InteractionType.SELECT_MENU,
      id: pattern.toString(),
      handler
    };
    
    this.patterns.set(pattern, selectMenu);
    this.logger.debug(`Registered select menu pattern: ${pattern.toString()}`);
  }

  /**
   * Registers a modal
   * @param modal Modal object
   */
  public registerModal(modal: Modal): void {
    this.interactions.set(modal.id, modal);
    this.logger.debug(`Registered modal: ${modal.id}`);
  }

  /**
   * Registers a modal with a pattern-matching ID
   * @param pattern Regular expression to match modal IDs
   * @param handler Modal handler
   */
  public registerModalPattern(pattern: RegExp, handler: ModalHandler): void {
    const modal: Modal = {
      type: InteractionType.MODAL,
      id: pattern.toString(),
      handler
    };
    
    this.patterns.set(pattern, modal);
    this.logger.debug(`Registered modal pattern: ${pattern.toString()}`);
  }

  /**
   * Registers a context menu
   * @param contextMenu Context menu object
   */
  public registerContextMenu(contextMenu: ContextMenu): void {
    this.interactions.set(contextMenu.id, contextMenu);
    this.logger.debug(`Registered context menu: ${contextMenu.id}`);
  }

  /**
   * Registers an autocomplete handler
   * @param autocomplete Autocomplete object
   */
  public registerAutocomplete(autocomplete: Autocomplete): void {
    this.interactions.set(autocomplete.id, autocomplete);
    this.logger.debug(`Registered autocomplete: ${autocomplete.id}`);
  }

  /**
   * Gets all registered interactions
   * @returns Collection of registered interactions
   */
  public getInteractions(): Collection<string, RegisterableInteraction> {
    return new Collection(this.interactions);
  }

  /**
   * Unregisters an interaction by ID
   * @param id ID of the interaction to remove
   * @returns True if the interaction was found and removed, false otherwise
   */
  public unregisterInteraction(id: string): boolean {
    const deleted = this.interactions.delete(id);
    if (deleted) {
      this.logger.debug(`Unregistered interaction: ${id}`);
    }
    return deleted;
  }

  /**
   * Updates the REST token - useful when the client reconnects with a new token
   * @param token New bot token
   */
  public updateToken(token: string): void {
    this.rest.setToken(token);
    this.logger.debug('Updated REST API token');
  }

  /**
   * Registers global commands in Discord API
   * @param applicationId Application ID
   * @param commands Commands to register (if not specified, all registered commands are used)
   */
  public async registerGlobalCommands(
    applicationId: string,
    commands?: RESTPostAPIApplicationCommandsJSONBody[]
  ): Promise<void> {
    try {
      const commandsToRegister = commands || this.getCommandsForRegistration();
      
      this.logger.info(`Registering ${commandsToRegister.length} global commands...`);
      
      await this.rest.put(
        Routes.applicationCommands(applicationId),
        { body: commandsToRegister }
      );
      
      this.logger.info('Global commands successfully registered');
    } catch (error) {
      this.logger.error('Error registering global commands', error);
      throw error;
    }
  }

  /**
   * Registers commands for a specific guild in Discord API
   * @param applicationId Application ID
   * @param guildId Guild ID
   * @param commands Commands to register (if not specified, all registered commands are used)
   */
  public async registerGuildCommands(
    applicationId: string,
    guildId: string,
    commands?: RESTPostAPIApplicationCommandsJSONBody[]
  ): Promise<void> {
    try {
      const commandsToRegister = commands || this.getCommandsForRegistration();
      
      this.logger.info(`Registering ${commandsToRegister.length} commands on guild ${guildId}...`);
      
      await this.rest.put(
        Routes.applicationGuildCommands(applicationId, guildId),
        { body: commandsToRegister }
      );
      
      this.logger.info(`Commands successfully registered on guild ${guildId}`);
    } catch (error) {
      this.logger.error(`Error registering commands on guild ${guildId}`, error);
      throw error;
    }
  }

  /**
   * Gets commands for registration in Discord API
   * @returns Array of command data
   */
  private getCommandsForRegistration(): RESTPostAPIApplicationCommandsJSONBody[] {
    const commands: RESTPostAPIApplicationCommandsJSONBody[] = [];
    
    for (const interaction of this.interactions.values()) {
      if (
        interaction.type === InteractionType.COMMAND || 
        interaction.type === InteractionType.CONTEXT_MENU
      ) {
        commands.push((interaction as Command | ContextMenu).data);
      }
    }
    
    return commands;
  }

  /**
   * Validates application command permissions
   * Ensures commands have valid options and configurations
   * @param commands Commands to validate
   * @returns Array of validation error messages (empty if no errors)
   */
  public validateCommands(commands?: RESTPostAPIApplicationCommandsJSONBody[]): string[] {
    const commandsToValidate = commands || this.getCommandsForRegistration();
    const errors: string[] = [];
    
    for (const command of commandsToValidate) {
      // Name validation
      if (!command.name || command.name.length < 1 || command.name.length > 32) {
        errors.push(`Command name must be between 1-32 characters: ${command.name || 'undefined'}`);
      }
      
      // Description validation for chat input commands
      if (command.type === 1 && (!command.description || command.description.length < 1 || command.description.length > 100)) {
        errors.push(`Command description must be between 1-100 characters: ${command.name}`);
      }
      
      // Options validation
      if (command.options) {
        errors.push(...this.validateCommandOptions(command.name, command.options as APIApplicationCommandOption[]));
      }
    }
    
    return errors;
  }

  /**
   * Validates command options recursively
   * @param commandName Name of the command for context in error messages
   * @param options Options to validate
   * @returns Array of validation error messages
   */
  private validateCommandOptions(commandName: string, options: APIApplicationCommandOption[]): string[] {
    const errors: string[] = [];
    
    for (const option of options) {
      // Name validation
      if (!option.name || option.name.length < 1 || option.name.length > 32) {
        errors.push(`Option name must be between 1-32 characters in command ${commandName}`);
      }
      
      // Description validation
      if (!option.description || option.description.length < 1 || option.description.length > 100) {
        errors.push(`Option description must be between 1-100 characters: ${option.name} in command ${commandName}`);
      }
      
      // Validate sub-options recursively (for subcommands and subcommand groups)
      if ((option.type === 1 || option.type === 2) && option.options) {
        errors.push(...this.validateCommandOptions(commandName, option.options as APIApplicationCommandOption[]));
      }
      
      // Validate choices if present
      if ('choices' in option && option.choices) {
        for (const choice of option.choices) {
          if (!choice.name || choice.name.length < 1 || choice.name.length > 100) {
            errors.push(`Choice name must be between 1-100 characters in option ${option.name} of command ${commandName}`);
          }
        }
      }
    }
    
    return errors;
  }
}