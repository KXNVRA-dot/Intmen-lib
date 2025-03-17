import { Button, ButtonHandler, ButtonStyle, InteractionType } from '../../types';

/**
 * Builder for creating buttons
 */
export class ButtonBuilder {
  private _customId: string = '';
  private _label: string = '';
  private _style: ButtonStyle = ButtonStyle.PRIMARY;
  private _disabled: boolean = false;
  private _url?: string;
  private _emoji?: string;
  private _handler: ButtonHandler | null = null;

  /**
   * Sets the custom ID for the button
   * @param customId Unique ID for the button to handle interactions
   */
  public setCustomId(customId: string): ButtonBuilder {
    this._customId = customId;
    return this;
  }

  /**
   * Sets the text on the button
   * @param label Text displayed on the button
   */
  public setLabel(label: string): ButtonBuilder {
    this._label = label;
    return this;
  }

  /**
   * Sets the button style
   * @param style Style from ButtonStyle enum
   */
  public setStyle(style: ButtonStyle): ButtonBuilder {
    this._style = style;
    return this;
  }

  /**
   * Sets the URL for the button (only for ButtonStyle.LINK)
   * @param url URL to which the user will be redirected when clicked
   */
  public setURL(url: string): ButtonBuilder {
    this._url = url;
    return this;
  }

  /**
   * Sets the emoji for the button
   * @param emoji Emoji displayed on the button
   */
  public setEmoji(emoji: string): ButtonBuilder {
    this._emoji = emoji;
    return this;
  }

  /**
   * Sets whether the button is disabled
   * @param disabled Whether the button is disabled
   */
  public setDisabled(disabled: boolean): ButtonBuilder {
    this._disabled = disabled;
    return this;
  }

  /**
   * Sets the button click handler
   * @param handler Handler function called when the button is clicked
   */
  public setHandler(handler: ButtonHandler): ButtonBuilder {
    this._handler = handler;
    return this;
  }

  /**
   * Builds and returns the button object
   * @returns Button object ready for registration
   */
  public build(): Button {
    if (this._style === ButtonStyle.LINK) {
      if (!this._url) {
        throw new Error('URL is required for LINK buttons');
      }
      
      // For link buttons, customId and handler are not needed
      return {
        type: InteractionType.BUTTON,
        id: this._url,
        handler: async () => {/* Links are handled by Discord automatically */}
      };
    }
    
    if (!this._customId) {
      throw new Error('Custom ID is required for non-LINK buttons');
    }
    
    if (!this._handler) {
      throw new Error('Handler is required for non-LINK buttons');
    }
    
    return {
      type: InteractionType.BUTTON,
      id: this._customId,
      handler: this._handler
    };
  }

  /**
   * Creates a data object to send to Discord API
   * @returns Button data object for Discord API
   */
  public toJSON() {
    const json: any = {
      type: 2, // Button type
      style: this._style,
      label: this._label,
      disabled: this._disabled
    };
    
    if (this._style === ButtonStyle.LINK) {
      json.url = this._url;
    } else {
      json.custom_id = this._customId;
    }
    
    if (this._emoji) {
      json.emoji = { name: this._emoji };
    }
    
    return json;
  }
} 