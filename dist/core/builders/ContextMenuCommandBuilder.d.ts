import { ContextMenu, InteractionHandler, CooldownScope, Middleware } from '../../types';
/**
 * Builder for creating context menu commands (user and message commands)
 */
export declare class ContextMenuCommandBuilder {
    private readonly _data;
    private _handler;
    private readonly _defaultMemberPermissions;
    private readonly _dmPermission;
    private readonly _nsfw;
    private _cooldown;
    private _cooldownScope;
    private _middlewares;
    /**
     * Creates a new context menu command builder instance
     */
    constructor();
    /**
     * Sets the command name
     * @param name Command name (1-32 characters)
     */
    setName(name: string): ContextMenuCommandBuilder;
    /**
     * Sets the command type to user context menu
     */
    setUserContextMenu(): ContextMenuCommandBuilder;
    /**
     * Sets the command type to message context menu
     */
    setMessageContextMenu(): ContextMenuCommandBuilder;
    /**
     * Sets whether the command is available in DMs with the bot
     * @param allowed Whether the command is available in DMs
     */
    setDMPermission(allowed: boolean): ContextMenuCommandBuilder;
    /**
     * Sets whether the command is age-restricted (NSFW)
     * @param nsfw Whether the command is NSFW
     */
    setNSFW(nsfw: boolean): ContextMenuCommandBuilder;
    /**
     * Sets cooldown duration in milliseconds
     * @param cooldownMs Cooldown time in ms
     */
    setCooldown(cooldownMs: number): ContextMenuCommandBuilder;
    /** Sets cooldown scope (user/guild/channel/global) */
    setCooldownScope(scope: CooldownScope): ContextMenuCommandBuilder;
    /**
     * Sets the default member permissions required to use the command (bitfield)
     * @param permissions Permission bit flags
     */
    setDefaultMemberPermissions(permissions: bigint | null): ContextMenuCommandBuilder;
    /**
     * Sets the command handler
     * @param handler Handler function called when the command is used
     */
    setHandler(handler: InteractionHandler): ContextMenuCommandBuilder;
    /** Attach one or more middlewares to this context menu */
    use(...middlewares: Middleware[]): ContextMenuCommandBuilder;
    /**
     * Builds and returns the command object
     * @returns Command object ready for registration
     */
    build(): ContextMenu;
}
