import { InteractionType, SelectMenu, SelectMenuHandler, SelectMenuOption, Middleware } from '../../types';

/**
 * Builder for creating select menus
 */
export class SelectMenuBuilder {
  private _customId: string = '';
  private _placeholder: string = '';
  private _minValues: number = 1;
  private _maxValues: number = 1;
  private _disabled: boolean = false;
  private _options: SelectMenuOption[] = [];
  private _handler: SelectMenuHandler | null = null;
  private _middlewares: Middleware[] = [];

  /**
   * Sets the custom ID for the select menu
   * @param customId Unique ID for the menu to handle interactions
   */
  public setCustomId(customId: string): SelectMenuBuilder {
    this._customId = customId;
    return this;
  }

  /**
   * Sets the placeholder text for the select menu
   * @param placeholder Text displayed when nothing is selected
   */
  public setPlaceholder(placeholder: string): SelectMenuBuilder {
    this._placeholder = placeholder;
    return this;
  }

  /**
   * Sets the minimum number of options that a user must select
   * @param min Minimum number of selectable options
   */
  public setMinValues(min: number): SelectMenuBuilder {
    this._minValues = min;
    return this;
  }

  /**
   * Sets the maximum number of options that a user can select
   * @param max Maximum number of selectable options
   */
  public setMaxValues(max: number): SelectMenuBuilder {
    this._maxValues = max;
    return this;
  }

  /**
   * Sets whether the select menu is disabled
   * @param disabled Whether the menu is disabled
   */
  public setDisabled(disabled: boolean): SelectMenuBuilder {
    this._disabled = disabled;
    return this;
  }

  /**
   * Adds options to the select menu
   * @param options Array of options for the select menu
   */
  public addOptions(options: SelectMenuOption[]): SelectMenuBuilder {
    this._options = [...this._options, ...options];
    return this;
  }

  /**
   * Adds a single option to the select menu
   * @param option Option for the select menu
   */
  public addOption(option: SelectMenuOption): SelectMenuBuilder {
    this._options.push(option);
    return this;
  }

  /**
   * Sets the handler for selection in the select menu
   * @param handler Handler function called when an option is selected
   */
  public setHandler(handler: SelectMenuHandler): SelectMenuBuilder {
    this._handler = handler;
    return this;
  }

  /** Attach one or more middlewares to this select menu */
  public use(...middlewares: Middleware[]): SelectMenuBuilder {
    this._middlewares.push(...middlewares);
    return this;
  }

  /**
   * Builds and returns the select menu object
   * @returns Select menu object ready for registration
   */
  public build(): SelectMenu {
    if (!this._customId) {
      throw new Error('Custom ID is required for select menus');
    }
    
    if (this._options.length === 0) {
      throw new Error('Select menu must have at least one option');
    }
    
    if (!this._handler) {
      throw new Error('Handler is required for select menus');
    }
    
    return {
      type: InteractionType.SELECT_MENU,
      id: this._customId,
  handler: this._handler,
  middlewares: this._middlewares
    };
  }

  /**
   * Creates a data object to send to Discord API
   * @returns Select menu data object for Discord API
   */
  public toJSON() {
    return {
      type: 3, // SELECT_MENU type
      custom_id: this._customId,
      placeholder: this._placeholder,
      min_values: this._minValues,
      max_values: this._maxValues,
      disabled: this._disabled,
      options: this._options.map(option => ({
        label: option.label,
        value: option.value,
        description: option.description,
        emoji: option.emoji ? { name: option.emoji } : undefined,
        default: option.default
      }))
    };
  }
} 