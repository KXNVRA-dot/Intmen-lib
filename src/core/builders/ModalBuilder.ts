import { TextInputStyle } from 'discord.js';
import { InteractionType, Modal, ModalHandler } from '../../types';

/**
 * Input component in modal window
 */
export interface ModalInputComponent {
  customId: string;
  label: string;
  style: TextInputStyle;
  placeholder?: string;
  value?: string;
  minLength?: number;
  maxLength?: number;
  required?: boolean;
}

/**
 * Modal input styles
 * @deprecated Use TextInputStyle from discord.js
 */
export enum ModalInputStyle {
  SHORT = 1,
  PARAGRAPH = 2
}

/**
 * Builder for creating modal windows
 */
export class ModalBuilder {
  private _customId: string = '';
  private _title: string = '';
  private _components: ModalInputComponent[] = [];
  private _handler: ModalHandler | null = null;

  /**
   * Sets the custom ID for the modal
   * @param customId Unique ID for the modal to handle interactions
   */
  public setCustomId(customId: string): ModalBuilder {
    this._customId = customId;
    return this;
  }

  /**
   * Sets the title of the modal
   * @param title Modal title
   */
  public setTitle(title: string): ModalBuilder {
    this._title = title;
    return this;
  }

  /**
   * Adds a short text input field
   * @param customId Unique ID for the field
   * @param label Field label
   * @param options Additional field options
   */
  public addShortTextInput(
    customId: string,
    label: string,
    options?: {
      placeholder?: string;
      value?: string;
      minLength?: number;
      maxLength?: number;
      required?: boolean;
    }
  ): ModalBuilder {
    this._components.push({
      customId,
      label,
      style: TextInputStyle.Short,
      placeholder: options?.placeholder,
      value: options?.value,
      minLength: options?.minLength,
      maxLength: options?.maxLength,
      required: options?.required ?? true
    });
    
    return this;
  }

  /**
   * Adds a paragraph text input field
   * @param customId Unique ID for the field
   * @param label Field label
   * @param options Additional field options
   */
  public addParagraphTextInput(
    customId: string,
    label: string,
    options?: {
      placeholder?: string;
      value?: string;
      minLength?: number;
      maxLength?: number;
      required?: boolean;
    }
  ): ModalBuilder {
    this._components.push({
      customId,
      label,
      style: TextInputStyle.Paragraph,
      placeholder: options?.placeholder,
      value: options?.value,
      minLength: options?.minLength,
      maxLength: options?.maxLength,
      required: options?.required ?? true
    });
    
    return this;
  }

  /**
   * Sets the handler for modal submission
   * @param handler Handler function called when the modal is submitted
   */
  public setHandler(handler: ModalHandler): ModalBuilder {
    this._handler = handler;
    return this;
  }

  /**
   * Builds and returns the modal object
   * @returns Modal object ready for registration
   */
  public build(): Modal {
    if (!this._customId) {
      throw new Error('Custom ID is required for modals');
    }
    
    if (!this._title) {
      throw new Error('Title is required for modals');
    }
    
    if (this._components.length === 0) {
      throw new Error('Modal must have at least one component');
    }
    
    if (this._components.length > 5) {
      throw new Error('Modal cannot have more than 5 components');
    }
    
    if (!this._handler) {
      throw new Error('Handler is required for modals');
    }
    
    return {
      type: InteractionType.MODAL,
      id: this._customId,
      handler: this._handler
    };
  }

  /**
   * Creates a data object to send to Discord API
   * @returns Modal data object for Discord API
   */
  public toJSON() {
    return {
      custom_id: this._customId,
      title: this._title,
      components: this._components.map((component) => ({
        type: 1, // Action Row
        components: [
          {
            type: 4, // Text Input
            custom_id: component.customId,
            label: component.label,
            style: component.style,
            placeholder: component.placeholder,
            value: component.value,
            min_length: component.minLength,
            max_length: component.maxLength,
            required: component.required
          }
        ]
      }))
    };
  }
} 