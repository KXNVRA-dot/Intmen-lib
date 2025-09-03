# Intmen-lib

<div align="center">

![Intmen-lib](https://img.shields.io/badge/Intmen-lib-5865F2?style=for-the-badge&logo=discord&logoColor=white)
[![npm version](https://img.shields.io/badge/npm-2.0.0-blue?style=flat-square)](https://www.npmjs.com/package/intmen-lib)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3+-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Discord.js](https://img.shields.io/badge/discord.js-v14-blue?style=flat-square)](https://discord.js.org)

A specialized library for managing interactive elements of Discord bots, including slash commands, buttons, select menus, modals, context menus, and autocomplete interactions.

</div>

> 🚀 **NEW MAJOR VERSION 2.0.0**: Context-based handlers, first-class middleware, expanded cooldown scopes, and pattern-based ID matching with named params. This is a breaking release—see Migration.

## ✨ Features

- 🚀 Simple API – Intuitive interface for managing Discord interactions
- 🔒 Type-Safe – Built with TypeScript
- 📦 Complete – Slash commands, context menus, buttons, select menus, modals, autocomplete
- 🧩 Modular – Clean builder-based architecture
- 🧭 New: Context-based handlers – Access interaction, logger, manager, state, params via a single context object
- 🧵 New: Middleware – Global and per-interaction middleware chains with next()
- ⏱️ New: Cooldown scopes – user, guild, channel, global
- � New: Pattern matching – Register handlers by RegExp and use named capture groups as params
- �️ Error handling – Customizable error responses with timeouts
- 🔑 Permission utilities – Simple permission checks

## 📥 Installation

```bash
# Using npm
npm install intmen-lib

# Using yarn
yarn add intmen-lib

# Using pnpm
pnpm add intmen-lib
```

## 🚀 Quick Start

```typescript
import { Client, GatewayIntentBits } from 'discord.js';
import { InteractionManager, SlashCommandBuilder } from 'intmen-lib';

// Create Discord client
const client = new Client({ 
  intents: [GatewayIntentBits.Guilds] 
});

// Create interaction manager
// Optional global middlewares
const auth = async (ctx, next) => {
  // authorize or short-circuit
  await next();
};

const manager = new InteractionManager(client, { middlewares: [auth] });

// Register slash command
const pingCommand = new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Check bot latency')
  .setHandler(async ({ interaction, logger }) => {
    const sent = await interaction.reply({ 
      content: '📡 Pinging...', 
      fetchReply: true 
    });
    
    const latency = sent.createdTimestamp - interaction.createdTimestamp;
    await interaction.editReply(`📡 Pong! Latency: ${latency}ms`);
  });

// Add command to manager
manager.registerCommand(pingCommand.build());

// Register commands with Discord API
client.once('ready', async () => {
  await manager.registerGlobalCommands(client.application.id);
  console.log('Bot is ready and commands are registered!');
});

// Login
client.login('YOUR_TOKEN_HERE');
```

## 📖 Documentation

### New in v2.0.0

- Context-based handler signature: handlers receive a single object `{ interaction, state, params, logger, manager }`
- Middleware pipeline: global (manager options) and per-interaction via `.use(...)`
- Cooldown scopes for commands and context menus: user, guild, channel, global
- Pattern-based component IDs with named params available in `ctx.params`
- Improved default error responses and timeouts

### New in v1.1.0

- Enhanced error handling with customizable error responses
- Improved SlashCommandBuilder with subcommand support
- Added ContextMenuCommandBuilder for easier creation of context menu commands
- New permission utilities for checking user permissions
- Interaction validators for validating and filtering interactions
- Improved type safety throughout the library
- Better timeout handling for interactions

### Interactive Elements

#### Slash Commands

```typescript
// Create a command with options
const userCommand = new SlashCommandBuilder()
  .setName('user')
  .setDescription('Get information about a user')
  .addUserOption(option => 
    option
      .setName('target')
      .setDescription('Target user')
      .setRequired(true)
  )
  .use(async (ctx, next) => {
    // per-command middleware example
    ctx.state.set('start', Date.now());
    await next();
  })
  .setHandler(async ({ interaction, state, logger }) => {
    const user = interaction.options.getUser('target');
    logger?.debug('Handling user command');
    await interaction.reply(`Username: ${user.username} (took ${Date.now() - state.get('start')}ms)`);
  });

manager.registerCommand(userCommand.build());
```

#### Slash Commands with Subcommands

```typescript
// Create a command with subcommands
const settingsCommand = new SlashCommandBuilder()
  .setName('settings')
  .setDescription('Manage bot settings')
  .addSubcommand(subcommand =>
    subcommand
      .setName('view')
      .setDescription('View current settings')
  )
  .addSubcommand(subcommand =>
    subcommand
      .setName('edit')
      .setDescription('Edit a setting')
      .addStringOption(option =>
        option
          .setName('setting')
          .setDescription('Setting to edit')
          .setRequired(true)
      )
      .addStringOption(option =>
        option
          .setName('value')
          .setDescription('New value')
          .setRequired(true)
      )
  )
  .setHandler(async ({ interaction }) => {
    const subcommand = interaction.options.getSubcommand();
    
    if (subcommand === 'view') {
      await interaction.reply('Here are your current settings...');
    } else if (subcommand === 'edit') {
      const setting = interaction.options.getString('setting');
      const value = interaction.options.getString('value');
      await interaction.reply(`Setting ${setting} updated to ${value}`);
    }
  });

manager.registerCommand(settingsCommand.build());
```

#### Context Menu Commands

```typescript
import { ContextMenuCommandBuilder } from 'intmen-lib';

// Create a user context menu command
const userInfoContextMenu = new ContextMenuCommandBuilder()
  .setName('User Info')
  .setUserContextMenu()
  .setHandler(async ({ interaction }) => {
    const user = interaction.targetUser;
    await interaction.reply({
      content: `Information about ${user.username}`,
      ephemeral: true
    });
  });

manager.registerCommand(userInfoContextMenu.build());

// Create a message context menu command
const translateContextMenu = new ContextMenuCommandBuilder()
  .setName('Translate Message')
  .setMessageContextMenu()
  .setHandler(async ({ interaction }) => {
    const message = interaction.targetMessage;
    await interaction.reply({
      content: `Translating: ${message.content.slice(0, 100)}...`,
      ephemeral: true
    });
  });

manager.registerCommand(translateContextMenu.build());
```

#### Buttons

```typescript
import { ButtonBuilder, ButtonStyle } from 'intmen-lib';

// Create a styled button
const button = new ButtonBuilder()
  .setCustomId('confirm_button')
  .setLabel('Confirm')
  .setStyle(ButtonStyle.SUCCESS)
  .setEmoji('✅')
  .use(async (ctx, next) => { /* check something */ await next(); })
  .setHandler(async ({ interaction, params }) => {
    await interaction.reply({ 
      content: 'Action confirmed!', 
      ephemeral: true 
    });
  });

manager.registerButton(button.build());

// In your command handler
await interaction.reply({
  content: 'Please confirm this action',
  components: [
    {
      type: 1, // ActionRow
      components: [button.toJSON()]
    }
  ]
});
```

#### Select Menus

```typescript
import { SelectMenuBuilder } from 'intmen-lib';

// Create a select menu with options
const roleMenu = new SelectMenuBuilder()
  .setCustomId('role_menu')
  .setPlaceholder('Select your role')
  .addOption({
    label: 'Developer', 
    value: 'dev', 
    description: 'Software developer', 
    emoji: '💻'
  })
  .addOption({
    label: 'Designer', 
    value: 'design', 
    description: 'UI/UX designer',
    emoji: '🎨'
  })
  .setHandler(async ({ interaction }) => {
    const roles = interaction.values;
    await interaction.reply({
      content: `You selected: ${roles.join(', ')}`,
      ephemeral: true
    });
  });

manager.registerSelectMenu(roleMenu.build());
```

#### Modals

```typescript
import { ModalBuilder, TextInputStyle } from 'intmen-lib';

// Create a modal form
const feedbackModal = new ModalBuilder()
  .setCustomId('feedback_form')
  .setTitle('Submit Feedback')
  .addTextInput({
    customId: 'feedback_name',
    label: 'Your Name',
    style: TextInputStyle.Short,
    required: true
  })
  .addTextInput({
    customId: 'feedback_content',
    label: 'Your Feedback',
    style: TextInputStyle.Paragraph,
    placeholder: 'Please provide your feedback here...',
    required: true,
    minLength: 10,
    maxLength: 1000
  })
  .setHandler(async ({ interaction }) => {
    const name = interaction.fields.getTextInputValue('feedback_name');
    const feedback = interaction.fields.getTextInputValue('feedback_content');
    
    await interaction.reply({
      content: `Thank you, ${name}! Your feedback has been received.`,
      ephemeral: true
    });
    
    // Process the feedback...
  });

manager.registerModal(feedbackModal.build());

// Show modal in a command or button handler
await interaction.showModal(feedbackModal.toJSON());
```

### Middlewares and Cooldowns

Per-command cooldown with scope:

```typescript
import { CooldownScope } from 'intmen-lib';

const cmd = new SlashCommandBuilder()
  .setName('cool')
  .setDescription('Cooldown demo')
  .setCooldown(5000)
  .setCooldownScope(CooldownScope.GUILD)
  .setHandler(async ({ interaction }) => interaction.reply('OK'));
```

Per-interaction middleware:

```typescript
const restricted = new ButtonBuilder()
  .setCustomId('restricted')
  .use(async (ctx, next) => {
    if (ctx.interaction.user.id !== 'owner') return ctx.interaction.reply({ content: 'Nope', ephemeral: true });
    await next();
  })
  .setLabel('Owner Only')
  .setHandler(async ({ interaction }) => interaction.reply('Welcome, owner!'));
```

#### Permission Utilities

```typescript
import { PermissionUtils, PermissionFlagsBits } from 'intmen-lib';

// In a command handler
if (PermissionUtils.hasPermission(interaction.member, PermissionFlagsBits.ManageMessages)) {
  // User has permission to manage messages
  await interaction.reply('You can manage messages!');
} else {
  // User lacks permission
  const missingPermissions = PermissionUtils.getMissingPermissions(
    interaction.member, 
    [PermissionFlagsBits.ManageMessages]
  );
  
  const readableNames = PermissionUtils.getReadablePermissionNames(missingPermissions);
  await interaction.reply({
    content: `You lack the required permissions: ${readableNames.join(', ')}`,
    ephemeral: true
  });
}
```

#### Interaction Validators

```typescript
import { InteractionValidators } from 'intmen-lib';

// In a button handler
if (InteractionValidators.isFromUser(interaction, originalUserId)) {
  // Only the original user can interact with this button
  await interaction.reply('Processing your request...');
} else {
  await interaction.reply({
    content: 'This button is not for you!',
    ephemeral: true
  });
}

// Combine multiple conditions
const isValid = InteractionValidators.all(interaction, [
  // Must be in a guild
  (int) => InteractionValidators.isInGuild(int),
  // Must be in a specific channel
  (int) => InteractionValidators.isInChannel(int, targetChannelId),
  // Custom condition
  (int) => InteractionValidators.custom(int, i => i.user.id === ownerId || i.member.roles.cache.has(adminRoleId))
]);

if (isValid) {
  // All conditions passed
  await interaction.reply('Command executed successfully!');
} else {
  await interaction.reply({
    content: 'You cannot use this command here!',
    ephemeral: true
  });
}
```

#### Timeout Utilities

```typescript
import { withTimeout } from 'intmen-lib';

// Automatically timeout a long-running operation
await withTimeout(
  someAsyncOperation(), // Promise that might take too long
  interaction, // the related Discord.js interaction
  {
    timeout: 5000,
    timeoutMessage: 'Operation timed out',
    ephemeral: true
  }
);

// With interaction handler
const command = new SlashCommandBuilder()
  .setName('search')
  .setDescription('Search for something')
  .setHandler(async ({ interaction }) => {
    // Defer the reply first
    await interaction.deferReply();
    
    try {
      // Wrap the long operation with timeout
      await withTimeout(
        performLongSearch(interaction.options.getString('query')),
        interaction,
        {
          timeout: 10000,
          timeoutMessage: 'The search operation timed out!',
          ephemeral: true
        }
      );
      
      if (result) {
        await interaction.editReply(`Search results: ${result}`);
      }
    } catch (error) {
      await interaction.editReply('An error occurred during the search.');
    }
  });
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

Distributed under the [MIT License](https://opensource.org/licenses/MIT). See `LICENSE` for more information.

## 🔄 Changelog

### v2.0.0

- BREAKING: Handlers now receive a context object `{ interaction, state, params, logger, manager }`
- New: Global and per-interaction middlewares with `next()`
- New: Cooldown scopes (user, guild, channel, global)
- New: Pattern-based component IDs with `ctx.params`
- Improved: Error handling defaults and timeouts

### v1.2.0

- Command cooldowns, error handling improvements