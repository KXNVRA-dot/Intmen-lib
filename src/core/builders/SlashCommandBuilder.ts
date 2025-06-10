import { 
  ApplicationCommandOptionType, 
  ApplicationCommandType,
  APIApplicationCommandOption,
  RESTPostAPIApplicationCommandsJSONBody,
  APIApplicationCommandSubcommandOption,
  APIApplicationCommandSubcommandGroupOption,
  APIApplicationCommandBasicOption
} from 'discord.js';
import { Command, CommandHandler, CommandOption, InteractionType } from '../../types';

/**
 * Builder for creating slash commands
 */
export class SlashCommandBuilder {
  private readonly _data: RESTPostAPIApplicationCommandsJSONBody;
  private _handler: CommandHandler | null = null;
  private readonly _defaultMemberPermissions: bigint | null = null;
  private readonly _dmPermission: boolean = true;
  private readonly _nsfw: boolean = false;
  private _cooldown: number = 0;

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
   * @param name Command name (must be lowercase, without spaces, 1-32 characters)
   */
  public setName(name: string): SlashCommandBuilder {
    if (!name || name.length < 1 || name.length > 32) {
      throw new Error('Command name must be between 1-32 characters');
    }
    
    // Discord requires command names to be lowercase, no spaces
    const formattedName = name.toLowerCase().replace(/\s+/g, '-');
    if (formattedName !== name) {
      console.warn(`Command name "${name}" was automatically converted to "${formattedName}" to conform to Discord's requirements`);
    }
    
    this._data.name = formattedName;
    return this;
  }

  /**
   * Sets the command description
   * @param description Command description (1-100 characters)
   */
  public setDescription(description: string): SlashCommandBuilder {
    if (!description || description.length < 1 || description.length > 100) {
      throw new Error('Command description must be between 1-100 characters');
    }
    
    if (this._data.type === ApplicationCommandType.ChatInput) {
      this._data.description = description;
    }
    return this;
  }

  /**
   * Sets whether the command is available in DMs with the bot
   * @param allowed Whether the command is available in DMs
   */
  public setDMPermission(allowed: boolean): SlashCommandBuilder {
    this._data.dm_permission = allowed;
    return this;
  }

  /**
   * Sets whether the command is age-restricted (NSFW)
   * @param nsfw Whether the command is NSFW
   */
  public setNSFW(nsfw: boolean): SlashCommandBuilder {
    this._data.nsfw = nsfw;
    return this;
  }

  /**
   * Sets the default member permissions required to use the command (bitfield)
   * @param permissions Permission bit flags
   */
  public setDefaultMemberPermissions(permissions: bigint | null): SlashCommandBuilder {
    this._data.default_member_permissions = permissions?.toString() || null;
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
    this.validateOption(builtOption);
    
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
    this.validateOption(builtOption);
    
    this._data.options = this._data.options || [];
    this._data.options.push(builtOption as unknown as APIApplicationCommandOption);
    
    return this;
  }

  /**
   * Adds a number (float/double) option to the command
   * @param builder Function to configure the option
   */
  public addNumberOption(builder: (option: CommandOption) => CommandOption): SlashCommandBuilder {
    const option: CommandOption = {
      name: '',
      description: '',
      type: ApplicationCommandOptionType.Number
    };
    
    const builtOption = builder(option);
    this.validateOption(builtOption);
    
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
    this.validateOption(builtOption);
    
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
    this.validateOption(builtOption);
    
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
    this.validateOption(builtOption);
    
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
    this.validateOption(builtOption);
    
    this._data.options = this._data.options || [];
    this._data.options.push(builtOption as unknown as APIApplicationCommandOption);
    
    return this;
  }

  /**
   * Adds a mentionable option (users and roles) to the command
   * @param builder Function to configure the option
   */
  public addMentionableOption(builder: (option: CommandOption) => CommandOption): SlashCommandBuilder {
    const option: CommandOption = {
      name: '',
      description: '',
      type: ApplicationCommandOptionType.Mentionable
    };
    
    const builtOption = builder(option);
    this.validateOption(builtOption);
    
    this._data.options = this._data.options || [];
    this._data.options.push(builtOption as unknown as APIApplicationCommandOption);
    
    return this;
  }

  /**
   * Adds an attachment option to the command
   * @param builder Function to configure the option
   */
  public addAttachmentOption(builder: (option: CommandOption) => CommandOption): SlashCommandBuilder {
    const option: CommandOption = {
      name: '',
      description: '',
      type: ApplicationCommandOptionType.Attachment
    };
    
    const builtOption = builder(option);
    this.validateOption(builtOption);
    
    this._data.options = this._data.options || [];
    this._data.options.push(builtOption as unknown as APIApplicationCommandOption);
    
    return this;
  }

  /**
   * Adds a subcommand to the command
   * @param builder Function to configure the subcommand
   */
  public addSubcommand(builder: (subcommand: SubcommandBuilder) => SubcommandBuilder): SlashCommandBuilder {
    const subcommand = new SubcommandBuilder();
    const builtSubcommand = builder(subcommand);
    
    this._data.options = this._data.options || [];
    this._data.options.push(builtSubcommand.toJSON());
    
    return this;
  }

  /**
   * Adds a subcommand group to the command
   * @param builder Function to configure the subcommand group
   */
  public addSubcommandGroup(builder: (group: SubcommandGroupBuilder) => SubcommandGroupBuilder): SlashCommandBuilder {
    const group = new SubcommandGroupBuilder();
    const builtGroup = builder(group);
    
    this._data.options = this._data.options || [];
    this._data.options.push(builtGroup.toJSON());
    
    return this;
  }

  /**
   * Validates an option object
   * @param option Option to validate
   */
  private validateOption(option: CommandOption): void {
    if (!option.name || option.name.length < 1 || option.name.length > 32) {
      throw new Error(`Option name must be between 1-32 characters: ${option.name}`);
    }
    
    // Discord requires option names to be lowercase, no spaces
    const formattedName = option.name.toLowerCase().replace(/\s+/g, '_');
    if (formattedName !== option.name) {
      console.warn(`Option name "${option.name}" was automatically converted to "${formattedName}" to conform to Discord's requirements`);
      option.name = formattedName;
    }
    
    if (!option.description || option.description.length < 1 || option.description.length > 100) {
      throw new Error(`Option description must be between 1-100 characters for option: ${option.name}`);
    }
  }

  /**
   * Sets cooldown duration in milliseconds
   * @param cooldownMs Cooldown time in ms
   */
  public setCooldown(cooldownMs: number): SlashCommandBuilder {
    this._cooldown = cooldownMs;
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
      handler: this._handler,
      cooldown: this._cooldown
    };
  }
}

/**
 * Builder for creating subcommands
 */
export class SubcommandBuilder {
  private readonly data: APIApplicationCommandSubcommandOption;

  constructor() {
    this.data = {
      type: ApplicationCommandOptionType.Subcommand,
      name: '',
      description: '',
      options: []
    };
  }

  /**
   * Sets the subcommand name
   * @param name Subcommand name (must be lowercase, without spaces, 1-32 characters)
   */
  public setName(name: string): SubcommandBuilder {
    if (!name || name.length < 1 || name.length > 32) {
      throw new Error('Subcommand name must be between 1-32 characters');
    }
    
    const formattedName = name.toLowerCase().replace(/\s+/g, '-');
    this.data.name = formattedName;
    return this;
  }

  /**
   * Sets the subcommand description
   * @param description Subcommand description (1-100 characters)
   */
  public setDescription(description: string): SubcommandBuilder {
    if (!description || description.length < 1 || description.length > 100) {
      throw new Error('Subcommand description must be between 1-100 characters');
    }
    
    this.data.description = description;
    return this;
  }

  /**
   * Adds a string option to the subcommand
   * @param builder Function to configure the option
   */
  public addStringOption(builder: (option: CommandOption) => CommandOption): SubcommandBuilder {
    const option: CommandOption = {
      name: '',
      description: '',
      type: ApplicationCommandOptionType.String
    };
    
    const builtOption = builder(option);
    this.validateOption(builtOption);
    
    this.data.options = this.data.options || [];
    this.data.options.push(builtOption as unknown as APIApplicationCommandBasicOption);
    
    return this;
  }

  /**
   * Adds an integer option to the subcommand
   * @param builder Function to configure the option
   */
  public addIntegerOption(builder: (option: CommandOption) => CommandOption): SubcommandBuilder {
    const option: CommandOption = {
      name: '',
      description: '',
      type: ApplicationCommandOptionType.Integer
    };
    
    const builtOption = builder(option);
    this.validateOption(builtOption);
    
    this.data.options = this.data.options || [];
    this.data.options.push(builtOption as unknown as APIApplicationCommandBasicOption);
    
    return this;
  }

  /**
   * Adds a boolean option to the subcommand
   * @param builder Function to configure the option
   */
  public addBooleanOption(builder: (option: CommandOption) => CommandOption): SubcommandBuilder {
    const option: CommandOption = {
      name: '',
      description: '',
      type: ApplicationCommandOptionType.Boolean
    };
    
    const builtOption = builder(option);
    this.validateOption(builtOption);
    
    this.data.options = this.data.options || [];
    this.data.options.push(builtOption as unknown as APIApplicationCommandBasicOption);
    
    return this;
  }

  /**
   * Adds a user option to the subcommand
   * @param builder Function to configure the option
   */
  public addUserOption(builder: (option: CommandOption) => CommandOption): SubcommandBuilder {
    const option: CommandOption = {
      name: '',
      description: '',
      type: ApplicationCommandOptionType.User
    };
    
    const builtOption = builder(option);
    this.validateOption(builtOption);
    
    this.data.options = this.data.options || [];
    this.data.options.push(builtOption as unknown as APIApplicationCommandBasicOption);
    
    return this;
  }

  /**
   * Adds a channel option to the subcommand
   * @param builder Function to configure the option
   */
  public addChannelOption(builder: (option: CommandOption) => CommandOption): SubcommandBuilder {
    const option: CommandOption = {
      name: '',
      description: '',
      type: ApplicationCommandOptionType.Channel
    };
    
    const builtOption = builder(option);
    this.validateOption(builtOption);
    
    this.data.options = this.data.options || [];
    this.data.options.push(builtOption as unknown as APIApplicationCommandBasicOption);
    
    return this;
  }

  /**
   * Adds a role option to the subcommand
   * @param builder Function to configure the option
   */
  public addRoleOption(builder: (option: CommandOption) => CommandOption): SubcommandBuilder {
    const option: CommandOption = {
      name: '',
      description: '',
      type: ApplicationCommandOptionType.Role
    };
    
    const builtOption = builder(option);
    this.validateOption(builtOption);
    
    this.data.options = this.data.options || [];
    this.data.options.push(builtOption as unknown as APIApplicationCommandBasicOption);
    
    return this;
  }

  /**
   * Validates an option object
   * @param option Option to validate
   */
  private validateOption(option: CommandOption): void {
    if (!option.name || option.name.length < 1 || option.name.length > 32) {
      throw new Error(`Option name must be between 1-32 characters: ${option.name}`);
    }
    
    const formattedName = option.name.toLowerCase().replace(/\s+/g, '_');
    if (formattedName !== option.name) {
      console.warn(`Option name "${option.name}" was automatically converted to "${formattedName}" to conform to Discord's requirements`);
      option.name = formattedName;
    }
    
    if (!option.description || option.description.length < 1 || option.description.length > 100) {
      throw new Error(`Option description must be between 1-100 characters for option: ${option.name}`);
    }
  }

  /**
   * Returns the JSON representation of this subcommand
   * @returns The JSON data for the API
   */
  public toJSON(): APIApplicationCommandSubcommandOption {
    if (!this.data.name) {
      throw new Error('Subcommand name is required');
    }
    
    if (!this.data.description) {
      throw new Error('Subcommand description is required');
    }
    
    return this.data;
  }
}

/**
 * Builder for creating subcommand groups
 */
export class SubcommandGroupBuilder {
  private readonly data: APIApplicationCommandSubcommandGroupOption;

  constructor() {
    this.data = {
      type: ApplicationCommandOptionType.SubcommandGroup,
      name: '',
      description: '',
      options: []
    };
  }

  /**
   * Sets the group name
   * @param name Group name (must be lowercase, without spaces, 1-32 characters)
   */
  public setName(name: string): SubcommandGroupBuilder {
    if (!name || name.length < 1 || name.length > 32) {
      throw new Error('Subcommand group name must be between 1-32 characters');
    }
    
    const formattedName = name.toLowerCase().replace(/\s+/g, '-');
    this.data.name = formattedName;
    return this;
  }

  /**
   * Sets the group description
   * @param description Group description (1-100 characters)
   */
  public setDescription(description: string): SubcommandGroupBuilder {
    if (!description || description.length < 1 || description.length > 100) {
      throw new Error('Subcommand group description must be between 1-100 characters');
    }
    
    this.data.description = description;
    return this;
  }

  /**
   * Adds a subcommand to this group
   * @param builder Function to configure the subcommand
   */
  public addSubcommand(builder: (subcommand: SubcommandBuilder) => SubcommandBuilder): SubcommandGroupBuilder {
    const subcommand = new SubcommandBuilder();
    const builtSubcommand = builder(subcommand);
    
    this.data.options = this.data.options || [];
    this.data.options.push(builtSubcommand.toJSON());
    
    return this;
  }

  /**
   * Returns the JSON representation of this subcommand group
   * @returns The JSON data for the API
   */
  public toJSON(): APIApplicationCommandSubcommandGroupOption {
    if (!this.data.name) {
      throw new Error('Subcommand group name is required');
    }
    
    if (!this.data.description) {
      throw new Error('Subcommand group description is required');
    }
    
    if (!this.data.options || this.data.options.length === 0) {
      throw new Error('Subcommand group must contain at least one subcommand');
    }
    
    return this.data;
  }
}