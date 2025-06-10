import { 
  ApplicationCommandType,
  RESTPostAPIApplicationCommandsJSONBody
} from 'discord.js';
import { Command, CommandHandler, InteractionType } from '../../types';

/**
 * Builder for creating context menu commands (user and message commands)
 */
export class ContextMenuCommandBuilder {
  private readonly _data: RESTPostAPIApplicationCommandsJSONBody;
  private _handler: CommandHandler | null = null;
  private readonly _defaultMemberPermissions: bigint | null = null;
  private readonly _dmPermission: boolean = true;
  private readonly _nsfw: boolean = false;
  private _cooldown: number = 0;

  /**
   * Creates a new context menu command builder instance
   */
  constructor() {
    this._data = {
      name: '',
      type: ApplicationCommandType.User // Default to user command
    };
  }

  /**
   * Sets the command name
   * @param name Command name (1-32 characters)
   */
  public setName(name: string): ContextMenuCommandBuilder {
    if (!name || name.length < 1 || name.length > 32) {
      throw new Error('Context menu command name must be between 1-32 characters');
    }
    
    this._data.name = name;
    return this;
  }

  /**
   * Sets the command type to user context menu
   */
  public setUserContextMenu(): ContextMenuCommandBuilder {
    this._data.type = ApplicationCommandType.User;
    return this;
  }

  /**
   * Sets the command type to message context menu
   */
  public setMessageContextMenu(): ContextMenuCommandBuilder {
    this._data.type = ApplicationCommandType.Message;
    return this;
  }

  /**
   * Sets whether the command is available in DMs with the bot
   * @param allowed Whether the command is available in DMs
   */
  public setDMPermission(allowed: boolean): ContextMenuCommandBuilder {
    this._data.dm_permission = allowed;
    return this;
  }

  /**
   * Sets whether the command is age-restricted (NSFW)
   * @param nsfw Whether the command is NSFW
   */
  public setNSFW(nsfw: boolean): ContextMenuCommandBuilder {
    this._data.nsfw = nsfw;
    return this;
  }

  /**
   * Sets cooldown duration in milliseconds
   * @param cooldownMs Cooldown time in ms
   */
  public setCooldown(cooldownMs: number): ContextMenuCommandBuilder {
    this._cooldown = cooldownMs;
    return this;
  }

  /**
   * Sets the default member permissions required to use the command (bitfield)
   * @param permissions Permission bit flags
   */
  public setDefaultMemberPermissions(permissions: bigint | null): ContextMenuCommandBuilder {
    this._data.default_member_permissions = permissions?.toString() || null;
    return this;
  }

  /**
   * Sets the command handler
   * @param handler Handler function called when the command is used
   */
  public setHandler(handler: CommandHandler): ContextMenuCommandBuilder {
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
