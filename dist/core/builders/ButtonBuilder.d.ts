import { Button, ButtonHandler, ButtonStyle, Middleware } from '../../types';
/**
 * Interface representing the Discord API button data
 */
interface DiscordButtonData {
    type: number;
    style: ButtonStyle;
    label: string;
    disabled: boolean;
    url?: string;
    custom_id?: string;
    emoji?: {
        name: string;
    };
}
/**
 * Builder for creating buttons
 */
export declare class ButtonBuilder {
    private _customId;
    private _label;
    private _style;
    private _disabled;
    private _url?;
    private _emoji?;
    private _handler;
    private _middlewares;
    /**
     * Sets the custom ID for the button
     * @param customId Unique ID for the button to handle interactions
     */
    setCustomId(customId: string): ButtonBuilder;
    /**
     * Sets the text on the button
     * @param label Text displayed on the button
     */
    setLabel(label: string): ButtonBuilder;
    /**
     * Sets the button style
     * @param style Style from ButtonStyle enum
     */
    setStyle(style: ButtonStyle): ButtonBuilder;
    /**
     * Sets the URL for the button (only for ButtonStyle.LINK)
     * @param url URL to which the user will be redirected when clicked
     */
    setURL(url: string): ButtonBuilder;
    /**
     * Sets the emoji for the button
     * @param emoji Emoji displayed on the button
     */
    setEmoji(emoji: string): ButtonBuilder;
    /**
     * Sets whether the button is disabled
     * @param disabled Whether the button is disabled
     */
    setDisabled(disabled: boolean): ButtonBuilder;
    /**
     * Sets the button click handler
     * @param handler Handler function called when the button is clicked
     */
    setHandler(handler: ButtonHandler): ButtonBuilder;
    /** Attach one or more middlewares to this button */
    use(...middlewares: Middleware[]): ButtonBuilder;
    /**
     * Builds and returns the button object
     * @returns Button object ready for registration
     */
    build(): Button;
    /**
     * Creates a data object to send to Discord API
     * @returns Button data object for Discord API
     */
    toJSON(): DiscordButtonData;
}
export {};
