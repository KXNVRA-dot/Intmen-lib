# Discord-Intmen

A specialized library for managing interactive elements of Discord bots, including slash commands, buttons, select menus, and modals.

## Features

- 🚀 Simple and intuitive API for managing Discord interactions
- 🛠️ Strong typing with TypeScript
- 📦 Support for all Discord interaction types: slash commands, context menus, buttons, select menus, and modals
- 🧩 Modular architecture for flexible code organization
- ⚡ Builder pattern for easy creation of interactive elements

## Installation

```bash
npm install discord-intmen
```

## Quick Start

```typescript
import { Client, GatewayIntentBits } from 'discord.js';
import { InteractionManager, SlashCommandBuilder } from 'discord-intmen';

// Create Discord client
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Create interaction manager
const interactionManager = new InteractionManager(client);

// Register slash command
const pingCommand = new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Replies with latency!')
  .setHandler(async (interaction) => {
    await interaction.reply('Pong!');
  });

// Add command to manager
interactionManager.registerCommand(pingCommand);

// Authenticate bot
client.login('YOUR_TOKEN_HERE');
```

## Documentation

Full documentation is available on [our website](https://github.com/yourusername/discord-intmen).

## Examples

### Creating Buttons

```typescript
import { ButtonBuilder, ButtonStyle } from 'discord-intmen';

// Create button
const button = new ButtonBuilder()
  .setCustomId('primary_button')
  .setLabel('Click me!')
  .setStyle(ButtonStyle.Primary)
  .setHandler(async (interaction) => {
    await interaction.reply({ content: 'Button clicked!', ephemeral: true });
  });

// Register button handler
interactionManager.registerButton(button);
```

### Creating Select Menus

```typescript
import { SelectMenuBuilder } from 'discord-intmen';

// Create select menu
const selectMenu = new SelectMenuBuilder()
  .setCustomId('select_menu')
  .setPlaceholder('Select an option')
  .addOptions([
    { label: 'Option 1', value: 'option_1', description: 'This is the first option' },
    { label: 'Option 2', value: 'option_2', description: 'This is the second option' }
  ])
  .setHandler(async (interaction) => {
    const values = interaction.values;
    await interaction.reply({ content: `Selected: ${values.join(', ')}`, ephemeral: true });
  });

// Register menu handler
interactionManager.registerSelectMenu(selectMenu);
```

## License

[MIT](LICENSE) 