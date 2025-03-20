# Intmen-lib

<div align="center">

![Intmen-lib](https://img.shields.io/badge/Intmen-lib-5865F2?style=for-the-badge&logo=discord&logoColor=white)
[![npm version](https://img.shields.io/badge/npm-1.0.4-blue?style=flat-square)](https://www.npmjs.com/package/intmen-lib)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3+-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Discord.js](https://img.shields.io/badge/discord.js-v14-blue?style=flat-square)](https://discord.js.org)
[![Test Coverage](https://img.shields.io/badge/coverage-93%25-green?style=flat-square)](https://github.com/KXNVRA-dot/Intmen-lib)

A specialized library for managing interactive elements of Discord bots, including slash commands, buttons, select menus, modals, context menus, and autocomplete interactions.

</div>

> ⚠️ **IMPORTANT WARNING**: Version 1.0.4 is currently **UNSTABLE** and not recommended for production use. Breaking changes and bugs may be present. Please use version 1.0.3 for production environments or wait for the next stable release.

## ✨ Features

- 🚀 **Simple API** - Intuitive interface for managing Discord interactions
- 🔒 **Type-Safe** - Built with TypeScript for robust type checking and strict typing
- 📦 **Complete** - Supports all Discord interaction types: slash commands, context menus, buttons, select menus, modals, and autocomplete
- 🧩 **Modular** - Flexible architecture for clean code organization
- ⚡ **Builder Pattern** - Fluent builders for easy creation of interactive elements
- 🛡️ **Error Handling** - Comprehensive error management with proper typing
- 🧪 **Fully Tested** - High test coverage (>93%) for reliability
- 📘 **Well Documented** - Clear and concise documentation

## 📥 Installation

```bash
# Using npm
npm install intmen-lib@1.0.3  # Use stable version 1.0.3 for production

# For testing the unstable version
npm install intmen-lib@1.0.4  # UNSTABLE - use with caution

# Using yarn
yarn add intmen-lib@1.0.3  # Stable version

# Using pnpm
pnpm add intmen-lib@1.0.3  # Stable version
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
const manager = new InteractionManager(client);

// Register slash command
const pingCommand = new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Check bot latency')
  .setHandler(async (interaction) => {
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

### Known Issues in v1.0.4 (Unstable)

- Autocomplete interactions may cause errors in certain scenarios
- Command registration might not work correctly with large command sets
- TypeScript type definitions may have inconsistencies

These issues are currently being fixed and will be resolved in the next stable release.

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
  .setHandler(async (interaction) => {
    const user = interaction.options.getUser('target');
    await interaction.reply(`Username: ${user.username}`);
  });

manager.registerCommand(userCommand.build());
```

#### Context Menu Commands

```typescript
import { InteractionType } from 'intmen-lib';

// Create a user context menu command
const userContextMenu = {
  id: 'userInfo',
  type: InteractionType.CONTEXT_MENU,
  data: {
    name: 'User Info',
    type: 2 // USER type
  },
  handler: async (interaction) => {
    const user = interaction.targetUser;
    await interaction.reply({
      content: `Information about ${user.username}`,
      ephemeral: true
    });
  }
};

manager.registerContextMenu(userContextMenu);
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
  .setHandler(async (interaction) => {
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
  .setHandler(async (interaction) => {
    const roles = interaction.values;
    await interaction.reply({
      content: `You selected: ${roles.join(', ')}`,
      ephemeral: true
    });
  });

manager.registerSelectMenu(roleMenu.build());
```

#### Modal Forms

```typescript
import { ModalBuilder } from 'intmen-lib';

// Create a modal form
const feedbackModal = new ModalBuilder()
  .setCustomId('feedback_form')
  .setTitle('Submit Feedback')
  .addShortTextInput('feedback_title', 'Title', {
    required: true,
    placeholder: 'Brief summary'
  })
  .addParagraphInput('feedback_description', 'Description', {
    required: true,
    placeholder: 'Detailed feedback'
  })
  .setHandler(async (interaction) => {
    const title = interaction.fields.getTextInputValue('feedback_title');
    const description = interaction.fields.getTextInputValue('feedback_description');
    
    await interaction.reply({
      content: `Feedback received!\nTitle: ${title}\nDescription: ${description}`,
      ephemeral: true
    });
  });

manager.registerModal(feedbackModal.build());

// Show the modal in a button handler
buttonHandler.setHandler(async (interaction) => {
  await interaction.showModal(feedbackModal.toJSON());
});
```

#### Autocomplete Interactions

> ⚠️ **Note**: Autocomplete interactions have known issues in version 1.0.4

```typescript
import { InteractionType } from 'intmen-lib';

// Create a slash command with autocomplete
const searchCommand = new SlashCommandBuilder()
  .setName('search')
  .setDescription('Search for an item')
  .addStringOption(option =>
    option
      .setName('query')
      .setDescription('Search query')
      .setRequired(true)
      .setAutocomplete(true)
  )
  .setHandler(async (interaction) => {
    const query = interaction.options.getString('query');
    await interaction.reply(`Searching for: ${query}`);
  });

// Register the autocomplete handler separately
const searchAutocomplete = {
  id: 'search',
  type: InteractionType.AUTOCOMPLETE,
  handler: async (interaction) => {
    const input = interaction.options.getFocused().toString();
    
    // Filter your items based on input
    const items = ['apple', 'banana', 'cherry', 'date'].filter(
      item => item.startsWith(input.toLowerCase())
    );
    
    // Send filtered results
    await interaction.respond(
      items.map(item => ({ name: item, value: item }))
    );
  }
};

manager.registerCommand(searchCommand.build());
manager.registerAutocomplete(searchAutocomplete);
```

## 🧰 Advanced Usage

### Timeout Handling

The library provides built-in timeout handling for interactions:

```typescript
import { withTimeout } from 'intmen-lib';

// In your command handler
async function handleCommand(interaction) {
  // Wrap asynchronous operations with timeout
  try {
    await withTimeout(
      someAsyncFunction(), // Your async operation
      interaction,
      {
        timeout: 5000, // 5 seconds timeout
        timeoutMessage: 'The operation took too long to complete',
        ephemeral: true
      }
    );
  } catch (error) {
    console.error('Operation timed out or failed:', error);
  }
}
```

### Command Registration

```typescript
// Register global commands (available in all guilds)
await manager.registerGlobalCommands(applicationId);

// Register guild-specific commands (only available in specified guild)
await manager.registerGuildCommands(applicationId, guildId);

// Register custom command list
const customCommands = [
  {
    name: 'custom',
    description: 'A custom command',
    type: 1
  }
];
await manager.registerGlobalCommands(applicationId, customCommands);
```

## 🔄 Update Plan

Version 1.0.4 is an **unstable development version**. We are actively working on the following improvements for the next stable release:

- Fix autocomplete interaction handling issues
- Improve type safety throughout the codebase
- Enhance error handling with more descriptive messages
- Optimize command registration performance
- Fix edge cases in interaction timeout utility

Stay tuned for the next stable release, which will incorporate all these improvements with full backward compatibility.

## 🤝 Contributing

Contributions are welcome! Please see our [Contributing Guide](CONTRIBUTING.md) for more details.

## 📄 License

[MIT](LICENSE) © KXNVRA 