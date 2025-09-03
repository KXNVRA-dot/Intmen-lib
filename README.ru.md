# Intmen-lib

<div align="center">

![Intmen-lib](https://img.shields.io/badge/Intmen-lib-5865F2?style=for-the-badge&logo=discord&logoColor=white)
[![npm version](https://img.shields.io/badge/npm-2.0.0-blue?style=flat-square)](https://www.npmjs.com/package/intmen-lib)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3+-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Discord.js](https://img.shields.io/badge/discord.js-v14-blue?style=flat-square)](https://discord.js.org)
 

Специализированная библиотека для управления интерактивными элементами Discord-ботов, включая слэш-команды, кнопки, выпадающие меню, модальные окна, контекстные меню и автозаполнение.

</div>

> 🚀 **MAJOR 2.0.0**: Контекстные обработчики, middleware, области кулдаунов (user/guild/channel/global) и паттерны ID с именованными параметрами. Это ломающий релиз — смотрите раздел Миграция.

## ✨ Особенности

- 🚀 Простое API
- 🔒 TypeScript типобезопасность
- 📦 Все типы взаимодействий: слэш-команды, контекстные меню, кнопки, меню, модальные окна, автозаполнение
- � Новое: контекст обработчика `{ interaction, state, params, logger, manager }`
- 🧵 Новое: middleware (глобальные и локальные) с `next()`
- ⏱️ Новое: области кулдаунов (user/guild/channel/global)
- � Новое: паттерны customId (RegExp) и `ctx.params` из именованных групп
- 🛡️ Улучшенная обработка ошибок и таймаутов

## 📥 Установка

```bash
# Используя npm
npm install intmen-lib

# Используя yarn
yarn add intmen-lib

# Используя pnpm
pnpm add intmen-lib@1.0.3  # Стабильная версия
```

## 🚀 Быстрый старт

```typescript
import { Client, GatewayIntentBits } from 'discord.js';
import { InteractionManager, SlashCommandBuilder } from 'intmen-lib';

// Create Discord client
const client = new Client({ 
  intents: [GatewayIntentBits.Guilds] 
});

// Create interaction manager
const manager = new InteractionManager(client, { middlewares: [async (ctx, next) => { await next(); }] });

// Register slash command
const pingCommand = new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Check bot latency')
  .setHandler(async ({ interaction }) => {
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

## 📖 Документация

### Новое в v2.0.0

- Контекст обработчика: единый объект вместо `(interaction)`
- Цепочки middleware: глобальные и пер-объектные
- Области кулдаунов: пользователь, гильдия, канал, глобально
- Паттерны ID (RegExp) и параметры из именованных групп

### Интерактивные элементы

#### Слэш-команды

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
  .setHandler(async ({ interaction, state }) => {
    const user = interaction.options.getUser('target');
    await interaction.reply(`Username: ${user.username}`);
  });

manager.registerCommand(userCommand.build());
```

#### Контекстные меню

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
  handler: async ({ interaction }) => {
    const user = interaction.targetUser;
    await interaction.reply({
      content: `Information about ${user.username}`,
      ephemeral: true
    });
  }
};

manager.registerContextMenu(userContextMenu);
```

#### Кнопки

```typescript
import { ButtonBuilder, ButtonStyle } from 'intmen-lib';

// Create a styled button
const button = new ButtonBuilder()
  .setCustomId('confirm_button')
  .setLabel('Confirm')
  .setStyle(ButtonStyle.SUCCESS)
  .setEmoji('✅')
  .setHandler(async ({ interaction }) => {
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

#### Выпадающие меню

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

#### Модальные формы

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
  .setHandler(async ({ interaction }) => {
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

#### Взаимодействия автозаполнения

> Пример автозаполнения

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
  .setHandler(async ({ interaction }) => {
    const query = interaction.options.getString('query');
    await interaction.reply(`Searching for: ${query}`);
  });

// Register the autocomplete handler separately
const searchAutocomplete = {
  id: 'search',
  type: InteractionType.AUTOCOMPLETE,
  handler: async ({ interaction }) => {
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

## 🧰 Расширенное использование

### Обработка таймаутов

Библиотека предоставляет встроенную обработку таймаутов для взаимодействий:

```typescript
import { withTimeout } from 'intmen-lib';

// In your command handler
async function handleCommand(interaction) {
  // Wrap asynchronous operations with timeout
  try {
    await withTimeout(
      someAsyncFunction(),
      interaction,
      { timeout: 5000, timeoutMessage: 'The operation took too long to complete', ephemeral: true }
    );
  } catch (error) {
    console.error('Operation timed out or failed:', error);
  }
}
```

### Регистрация команд

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

## 🔄 Изменения

### v2.0.0

- Ломающее изменение: обработчики принимают контекст
- Middleware, области кулдаунов, паттерны ID, улучшенные ошибки и таймауты

## 🤝 Вклад в разработку

Вклад приветствуется! Пожалуйста, ознакомьтесь с нашим [Руководством по внесению вклада](CONTRIBUTING.md) для получения дополнительной информации.

## 📄 Лицензия

[MIT](LICENSE) © KXNVRA 