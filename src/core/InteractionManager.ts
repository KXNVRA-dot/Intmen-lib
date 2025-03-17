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
  RouteBases,
  RESTPostAPIApplicationCommandsJSONBody
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
  RegisterableInteraction
} from '../types';

import { Logger } from '../utils/logger';

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
      ...options
    };
    this.logger = new Logger('Intmen-lib', this.options.debug);
    this.interactions = new Map<string, RegisterableInteraction>();
    this.rest = new REST({ version: '10' }).setToken(this.client.token || '');

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
      }
    } catch (error) {
      this.logger.error('Error handling interaction', error);
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

    try {
      if (command.type === InteractionType.COMMAND || command.type === InteractionType.CONTEXT_MENU) {
        await command.handler(interaction as any);
      }
    } catch (error) {
      this.logger.error(`Error executing command ${interaction.commandName}`, error);
      
      // If response not yet sent, send error message
      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({ 
          content: 'An error occurred while executing the command', 
          ephemeral: true 
        }).catch(() => {});
      }
    }
  }

  /**
   * Handles button interaction
   * @param interaction Button interaction
   */
  private async handleButtonInteraction(interaction: ButtonInteraction): Promise<void> {
    const button = this.interactions.get(interaction.customId);

    if (!button) {
      this.logger.warn(`Button not found: ${interaction.customId}`);
      return;
    }

    try {
      if (button.type === InteractionType.BUTTON) {
        await button.handler(interaction);
      }
    } catch (error) {
      this.logger.error(`Error handling button ${interaction.customId}`, error);
      
      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({ 
          content: 'An error occurred while handling the button', 
          ephemeral: true 
        }).catch(() => {});
      }
    }
  }

  /**
   * Handles select menu interaction
   * @param interaction Select menu interaction
   */
  private async handleSelectMenuInteraction(interaction: SelectMenuInteraction): Promise<void> {
    const selectMenu = this.interactions.get(interaction.customId);

    if (!selectMenu) {
      this.logger.warn(`Select menu not found: ${interaction.customId}`);
      return;
    }

    try {
      if (selectMenu.type === InteractionType.SELECT_MENU) {
        await selectMenu.handler(interaction);
      }
    } catch (error) {
      this.logger.error(`Error handling select menu ${interaction.customId}`, error);
      
      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({ 
          content: 'An error occurred while handling the select menu', 
          ephemeral: true 
        }).catch(() => {});
      }
    }
  }

  /**
   * Handles modal interaction
   * @param interaction Modal interaction
   */
  private async handleModalInteraction(interaction: ModalSubmitInteraction): Promise<void> {
    const modal = this.interactions.get(interaction.customId);

    if (!modal) {
      this.logger.warn(`Modal not found: ${interaction.customId}`);
      return;
    }

    try {
      if (modal.type === InteractionType.MODAL) {
        await modal.handler(interaction);
      }
    } catch (error) {
      this.logger.error(`Error handling modal ${interaction.customId}`, error);
      
      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({ 
          content: 'An error occurred while handling the modal', 
          ephemeral: true 
        }).catch(() => {});
      }
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
      return;
    }

    try {
      if (autocomplete.type === InteractionType.AUTOCOMPLETE) {
        await autocomplete.handler(interaction);
      }
    } catch (error) {
      this.logger.error(`Error handling autocomplete ${interaction.commandName}`, error);
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
   * Registers a select menu
   * @param selectMenu Select menu object
   */
  public registerSelectMenu(selectMenu: SelectMenu): void {
    this.interactions.set(selectMenu.id, selectMenu);
    this.logger.debug(`Registered select menu: ${selectMenu.id}`);
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
} 