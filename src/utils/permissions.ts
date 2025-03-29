import { GuildMember, PermissionFlagsBits, PermissionResolvable } from 'discord.js';

/**
 * Utility functions for checking and managing Discord permissions
 */
export class PermissionUtils {
  /**
   * Checks if a member has the specified permissions
   * @param member The guild member to check permissions for
   * @param permissions The permissions to check for (can be a single permission or array)
   * @param checkAdmin Whether to automatically pass if user has administrator permission
   * @returns True if the member has all the specified permissions, false otherwise
   */
  public static hasPermission(
    member: GuildMember,
    permissions: PermissionResolvable | PermissionResolvable[],
    checkAdmin = true
  ): boolean {
    // If user is server owner, they have all permissions
    if (member.guild.ownerId === member.id) {
      return true;
    }
    
    // Check for admin permission if requested
    if (checkAdmin && member.permissions.has(PermissionFlagsBits.Administrator)) {
      return true;
    }
    
    // Handle array of permissions (must have all of them)
    if (Array.isArray(permissions)) {
      return permissions.every(perm => member.permissions.has(perm));
    }
    
    // Handle single permission
    return member.permissions.has(permissions);
  }
  
  /**
   * Returns a list of missing permissions from the specified list
   * @param member The guild member to check permissions for
   * @param permissions The permissions to check for
   * @returns Array of missing permission flag bits
   */
  public static getMissingPermissions(
    member: GuildMember,
    permissions: PermissionResolvable[]
  ): PermissionResolvable[] {
    if (member.guild.ownerId === member.id || 
        member.permissions.has(PermissionFlagsBits.Administrator)) {
      return [];
    }
    
    return permissions.filter(perm => !member.permissions.has(perm));
  }
  
  /**
   * Converts permission flag bits to readable permission names
   * @param permissions Permission flag bits to convert
   * @returns Array of readable permission names
   */
  public static getReadablePermissionNames(permissions: PermissionResolvable[]): string[] {
    const nameMap: { [key: string]: string } = {
      // Standard permissions
      'CreateInstantInvite': 'Create Invite',
      'KickMembers': 'Kick Members',
      'BanMembers': 'Ban Members',
      'Administrator': 'Administrator',
      'ManageChannels': 'Manage Channels',
      'ManageGuild': 'Manage Server',
      'AddReactions': 'Add Reactions',
      'ViewAuditLog': 'View Audit Log',
      'PrioritySpeaker': 'Priority Speaker',
      'Stream': 'Stream',
      'ViewChannel': 'View Channels',
      'SendMessages': 'Send Messages',
      'SendTTSMessages': 'Send TTS Messages',
      'ManageMessages': 'Manage Messages',
      'EmbedLinks': 'Embed Links',
      'AttachFiles': 'Attach Files',
      'ReadMessageHistory': 'Read Message History',
      'MentionEveryone': 'Mention Everyone',
      'UseExternalEmojis': 'Use External Emojis',
      'ViewGuildInsights': 'View Guild Insights',
      'Connect': 'Connect to Voice',
      'Speak': 'Speak in Voice',
      'MuteMembers': 'Mute Members',
      'DeafenMembers': 'Deafen Members',
      'MoveMembers': 'Move Members',
      'UseVAD': 'Use Voice Activity',
      'ChangeNickname': 'Change Nickname',
      'ManageNicknames': 'Manage Nicknames',
      'ManageRoles': 'Manage Roles',
      'ManageWebhooks': 'Manage Webhooks',
      'ManageEmojisAndStickers': 'Manage Emojis and Stickers',
      'UseApplicationCommands': 'Use Application Commands',
      'RequestToSpeak': 'Request to Speak',
      'ManageEvents': 'Manage Events',
      'ManageThreads': 'Manage Threads',
      'CreatePublicThreads': 'Create Public Threads',
      'CreatePrivateThreads': 'Create Private Threads',
      'UseExternalStickers': 'Use External Stickers',
      'SendMessagesInThreads': 'Send Messages in Threads',
      'UseEmbeddedActivities': 'Use Activities',
      'ModerateMembers': 'Moderate Members',
      'ViewCreatorMonetizationAnalytics': 'View Creator Monetization Analytics',
      'UseSoundboard': 'Use Soundboard',
      'CreateGuildExpressions': 'Create Guild Expressions',
      'SendVoiceMessages': 'Send Voice Messages',
    };
    
    const names: string[] = [];
    
    permissions.forEach(perm => {
      // If it's a bit flag
      if (typeof perm === 'bigint') {
        // Find the corresponding key in PermissionFlagsBits
        for (const [key, value] of Object.entries(PermissionFlagsBits)) {
          if (value === perm) {
            names.push(nameMap[key] || key);
            break;
          }
        }
      } else {
        // If it's a string key, convert it directly
        const key = String(perm);
        names.push(nameMap[key] || key);
      }
    });
    
    return names;
  }
}
