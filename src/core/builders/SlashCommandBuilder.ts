import { 
  ApplicationCommandOptionType, 
  ApplicationCommandType,
  APIApplicationCommandOption,
  RESTPostAPIApplicationCommandsJSONBody
} from 'discord.js';
import { Command, CommandHandler, CommandOption, InteractionType } from '../../types';

/**
 * Builder for creating slash commands
 */
export class SlashCommandBuilder {
  private readonly _data: RESTPostAPIApplicationCommandsJSONBody;
  private _handler: CommandHandler | null = null;

  /**
   * Creates a new slash command builder instance
   */
  constructor() {
    this._data = {
      name: '',
      type: ApplicationCommandType.ChatInput,
      description: '',
      options: []
    };
  }

  /**
   * Sets the command name
   * @param name Command name (must be lowercase, without spaces)
   */
  public setName(name: string): SlashCommandBuilder {
    this._data.name = name.toLowerCase();
    return this;
  }

  /**
   * Sets the command description
   * @param description Command description
   */
  public setDescription(description: string): SlashCommandBuilder {
    if (this._data.type === ApplicationCommandType.ChatInput) {
      this._data.description = description;
    }
    return this;
  }

  /**
   * Adds a string option to the command
   * @param builder Function to configure the option
   */
  public addStringOption(builder: (option: CommandOption) => CommandOption): SlashCommandBuilder {
    const option: CommandOption = {
      name: '',
      description: '',
      type: ApplicationCommandOptionType.String
    };
    
    const builtOption = builder(option);
    this._data.options = this._data.options || [];
    this._data.options.push(builtOption as unknown as APIApplicationCommandOption);
    
    return this;
  }

  /**
   * Adds an integer option to the command
   * @param builder Function to configure the option
   */
  public addIntegerOption(builder: (option: CommandOption) => CommandOption): SlashCommandBuilder {
    const option: CommandOption = {
      name: '',
      description: '',
      type: ApplicationCommandOptionType.Integer
    };
    
    const builtOption = builder(option);
    this._data.options = this._data.options || [];
    this._data.options.push(builtOption as unknown as APIApplicationCommandOption);
    
    return this;
  }

  /**
   * Adds a boolean option to the command
   * @param builder Function to configure the option
   */
  public addBooleanOption(builder: (option: CommandOption) => CommandOption): SlashCommandBuilder {
    const option: CommandOption = {
      name: '',
      description: '',
      type: ApplicationCommandOptionType.Boolean
    };
    
    const builtOption = builder(option);
    this._data.options = this._data.options || [];
    this._data.options.push(builtOption as unknown as APIApplicationCommandOption);
    
    return this;
  }

  /**
   * Adds a user option to the command
   * @param builder Function to configure the option
   */
  public addUserOption(builder: (option: CommandOption) => CommandOption): SlashCommandBuilder {
    const option: CommandOption = {
      name: '',
      description: '',
      type: ApplicationCommandOptionType.User
    };
    
    const builtOption = builder(option);
    this._data.options = this._data.options || [];
    this._data.options.push(builtOption as unknown as APIApplicationCommandOption);
    
    return this;
  }

  /**
   * Adds a channel option to the command
   * @param builder Function to configure the option
   */
  public addChannelOption(builder: (option: CommandOption) => CommandOption): SlashCommandBuilder {
    const option: CommandOption = {
      name: '',
      description: '',
      type: ApplicationCommandOptionType.Channel
    };
    
    const builtOption = builder(option);
    this._data.options = this._data.options || [];
    this._data.options.push(builtOption as unknown as APIApplicationCommandOption);
    
    return this;
  }

  /**
   * Adds a role option to the command
   * @param builder Function to configure the option
   */
  public addRoleOption(builder: (option: CommandOption) => CommandOption): SlashCommandBuilder {
    const option: CommandOption = {
      name: '',
      description: '',
      type: ApplicationCommandOptionType.Role
    };
    
    const builtOption = builder(option);
    this._data.options = this._data.options || [];
    this._data.options.push(builtOption as unknown as APIApplicationCommandOption);
    
    return this;
  }

  /**
   * Sets the command handler
   * @param handler Handler function called when the command is used
   */
  public setHandler(handler: CommandHandler): SlashCommandBuilder {
    this._handler = handler;
    return this;
  }

  /**
   * Builds and returns the command object
   * @returns Command object ready for registration
   */
  public build(): Command {
    if (!this._data.name) {
      throw new Error('Command name is required');
    }
    
    if (this._data.type === ApplicationCommandType.ChatInput && !this._data.description) {
      throw new Error('Command description is required for chat input commands');
    }
    
    if (!this._handler) {
      throw new Error('Command handler is required');
    }
    
    return {
      type: InteractionType.COMMAND,
      id: this._data.name,
      data: this._data,
      handler: this._handler
    };
  }
} 