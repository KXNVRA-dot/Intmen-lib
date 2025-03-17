# Discord-Intmen

<div align="center">

![Discord-Intmen](https://img.shields.io/badge/Discord-Intmen-5865F2?style=for-the-badge&logo=discord&logoColor=white)
[![npm version](https://img.shields.io/badge/npm-1.0.0-blue?style=flat-square)](https://www.npmjs.com/package/discord-intmen)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9+-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Discord.js](https://img.shields.io/badge/discord.js-v14-blue?style=flat-square)](https://discord.js.org)

A specialized library for managing interactive elements of Discord bots, including slash commands, buttons, select menus, and modals.

</div>

## ✨ Features

- 🚀 **Simple API** - Intuitive interface for managing Discord interactions
- 🔒 **Type-Safe** - Built with TypeScript for robust type checking
- 📦 **Complete** - Supports all Discord interaction types: slash commands, context menus, buttons, select menus, and modals
- 🧩 **Modular** - Flexible architecture for clean code organization
- ⚡ **Builder Pattern** - Fluent builders for easy creation of interactive elements
- 🛡️ **Error Handling** - Comprehensive error management
- 📘 **Well Documented** - Clear and concise documentation

## 📥 Installation

```bash
# Using npm
npm install discord-intmen

# Using yarn
yarn add discord-intmen

# Using pnpm
pnpm add discord-intmen
```

## 🚀 Quick Start

```typescript
import { Client, GatewayIntentBits } from 'discord.js';
import { InteractionManager, SlashCommandBuilder } from 'discord-intmen';

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
manager.registerCommand(pingCommand);

// Login
client.login('YOUR_TOKEN_HERE');
```

## 📖 Documentation

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

manager.registerCommand(userCommand);
```

#### Buttons

```typescript
import { ButtonBuilder, ButtonStyle } from 'discord-intmen';

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

manager.registerButton(button);

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
import { SelectMenuBuilder } from 'discord-intmen';

// Create a select menu with options
const roleMenu = new SelectMenuBuilder()
  .setCustomId('role_menu')
  .setPlaceholder('Select your role')
  .addOptions([
    { 
      label: 'Developer', 
      value: 'dev', 
      description: 'Software developer', 
      emoji: '💻' 
    },
    { 
      label: 'Designer', 
      value: 'design', 
      description: 'UI/UX designer',
      emoji: '🎨' 
    }
  ])
  .setHandler(async (interaction) => {
    const roles = interaction.values;
    await interaction.reply({
      content: `You selected: ${roles.join(', ')}`,
      ephemeral: true
    });
  });

manager.registerSelectMenu(roleMenu);
```

#### Modal Forms

```typescript
import { ModalBuilder, ModalInputStyle } from 'discord-intmen';

// Create a modal form
const feedbackModal = new ModalBuilder()
  .setCustomId('feedback_form')
  .setTitle('Submit Feedback')
  .addTextInput({
    customId: 'feedback_title',
    label: 'Title',
    style: ModalInputStyle.SHORT,
    required: true,
    placeholder: 'Brief summary'
  })
  .addTextInput({
    customId: 'feedback_description',
    label: 'Description',
    style: ModalInputStyle.PARAGRAPH,
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

manager.registerModal(feedbackModal);

// Show the modal in a button handler
buttonHandler.setHandler(async (interaction) => {
  await interaction.showModal(feedbackModal.toJSON());
});
```

## 🧰 Advanced Usage

See the [examples directory](https://github.com/KXNVRA-dot/Intmen-lib/tree/master/examples) for more advanced usage patterns.

## 🤝 Contributing

Contributions are welcome! Please see our [Contributing Guide](CONTRIBUTING.md) for more details.

## 📄 License

[MIT](LICENSE) © KXNVRA 