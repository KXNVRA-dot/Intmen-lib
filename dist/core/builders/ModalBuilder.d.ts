import { TextInputStyle } from 'discord.js';
import { Modal, ModalHandler } from '../../types';
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
export declare enum ModalInputStyle {
    SHORT = 1,
    PARAGRAPH = 2
}
/**
 * Builder for creating modal windows
 */
export declare class ModalBuilder {
    private _customId;
    private _title;
    private _components;
    private _handler;
    /**
     * Sets the custom ID for the modal
     * @param customId Unique ID for the modal to handle interactions
     */
    setCustomId(customId: string): ModalBuilder;
    /**
     * Sets the title of the modal
     * @param title Modal title
     */
    setTitle(title: string): ModalBuilder;
    /**
     * Adds a short text input field
     * @param customId Unique ID for the field
     * @param label Field label
     * @param options Additional field options
     */
    addShortTextInput(customId: string, label: string, options?: {
        placeholder?: string;
        value?: string;
        minLength?: number;
        maxLength?: number;
        required?: boolean;
    }): ModalBuilder;
    /**
     * Adds a paragraph text input field
     * @param customId Unique ID for the field
     * @param label Field label
     * @param options Additional field options
     */
    addParagraphTextInput(customId: string, label: string, options?: {
        placeholder?: string;
        value?: string;
        minLength?: number;
        maxLength?: number;
        required?: boolean;
    }): ModalBuilder;
    /**
     * Sets the handler for modal submission
     * @param handler Handler function called when the modal is submitted
     */
    setHandler(handler: ModalHandler): ModalBuilder;
    /**
     * Builds and returns the modal object
     * @returns Modal object ready for registration
     */
    build(): Modal;
    /**
     * Creates a data object to send to Discord API
     * @returns Modal data object for Discord API
     */
    toJSON(): {
        custom_id: string;
        title: string;
        components: {
            type: number;
            components: {
                type: number;
                custom_id: string;
                label: string;
                style: TextInputStyle;
                placeholder: string | undefined;
                value: string | undefined;
                min_length: number | undefined;
                max_length: number | undefined;
                required: boolean | undefined;
            }[];
        }[];
    };
}
