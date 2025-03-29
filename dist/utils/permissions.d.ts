import { GuildMember, PermissionResolvable } from 'discord.js';
/**
 * Utility functions for checking and managing Discord permissions
 */
export declare class PermissionUtils {
    /**
     * Checks if a member has the specified permissions
     * @param member The guild member to check permissions for
     * @param permissions The permissions to check for (can be a single permission or array)
     * @param checkAdmin Whether to automatically pass if user has administrator permission
     * @returns True if the member has all the specified permissions, false otherwise
     */
    static hasPermission(member: GuildMember, permissions: PermissionResolvable | PermissionResolvable[], checkAdmin?: boolean): boolean;
    /**
     * Returns a list of missing permissions from the specified list
     * @param member The guild member to check permissions for
     * @param permissions The permissions to check for
     * @returns Array of missing permission flag bits
     */
    static getMissingPermissions(member: GuildMember, permissions: PermissionResolvable[]): PermissionResolvable[];
    /**
     * Converts permission flag bits to readable permission names
     * @param permissions Permission flag bits to convert
     * @returns Array of readable permission names
     */
    static getReadablePermissionNames(permissions: PermissionResolvable[]): string[];
}
