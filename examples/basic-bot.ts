import { 
  Client, 
  GatewayIntentBits,
  InteractionManager,
  SlashCommandBuilder,
  ButtonBuilder,
  ButtonStyle,
  SelectMenuBuilder,
  ModalBuilder,
  TextInputStyle
} from '../src';

// Create Discord client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages
  ]
});

// Create interaction manager
const interactionManager = new InteractionManager(client, {
  debug: true
});

// Create ping command
const pingCommand = new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Check the bot latency')
  .setHandler(async (interaction) => {
    const sentTimestamp = Date.now();
    await interaction.reply('Measuring latency...');
    const latency = Date.now() - sentTimestamp;
    await interaction.editReply(`🏓 Pong! Latency: ${latency}ms`);
  });

// Create command with options
const echoCommand = new SlashCommandBuilder()
  .setName('echo')
  .setDescription('Repeats your message')
  .addStringOption((option) => ({
    ...option,
    name: 'message',
    description: 'Message to repeat',
    required: true
  }))
  .addBooleanOption((option) => ({
    ...option,
    name: 'ephemeral',
    description: 'Send the message only to you?',
    required: false
  }))
  .setHandler(async (interaction) => {
    const message = interaction.options.get('message')?.value as string;
    const ephemeral = interaction.options.get('ephemeral')?.value as boolean ?? false;
    
    await interaction.reply({
      content: message,
      ephemeral
    });
  });

// Create button
const testButton = new ButtonBuilder()
  .setCustomId('test_button')
  .setLabel('Click me!')
  .setStyle(ButtonStyle.PRIMARY)
  .setHandler(async (interaction) => {
    await interaction.reply({
      content: 'You clicked the button!',
      ephemeral: true
    });
  });

// Create select menu
const testSelectMenu = new SelectMenuBuilder()
  .setCustomId('test_select')
  .setPlaceholder('Select an option')
  .addOptions([
    { label: 'Option 1', value: 'option_1', description: 'First option' },
    { label: 'Option 2', value: 'option_2', description: 'Second option' },
    { label: 'Option 3', value: 'option_3', description: 'Third option' }
  ])
  .setHandler(async (interaction) => {
    const selectedValues = interaction.values;
    await interaction.reply({
      content: `You selected: ${selectedValues.join(', ')}`,
      ephemeral: true
    });
  });

// Create modal
const testModal = new ModalBuilder()
  .setCustomId('test_modal')
  .setTitle('Test Modal')
  .addShortTextInput(
    'name_input',
    'Your name',
    { placeholder: 'Enter your name', required: true }
  )
  .addParagraphTextInput(
    'feedback_input',
    'Your feedback',
    { placeholder: 'Please leave your feedback', required: true }
  )
  .setHandler(async (interaction) => {
    const name = interaction.fields.getTextInputValue('name_input');
    const feedback = interaction.fields.getTextInputValue('feedback_input');
    
    await interaction.reply({
      content: `Thank you for your feedback, ${name}!\n\nYour feedback: ${feedback}`,
      ephemeral: true
    });
  });

// Command to demonstrate components
const componentsCommand = new SlashCommandBuilder()
  .setName('components')
  .setDescription('Show interactive components')
  .setHandler(async (interaction) => {
    // Create component objects to send
    const buttonComponent = testButton.toJSON();
    const selectMenuComponent = testSelectMenu.toJSON();
    
    await interaction.reply({
      content: 'Here are some interactive components:',
      components: [
        {
          type: 1, // ActionRow
          components: [buttonComponent]
        },
        {
          type: 1, // ActionRow
          components: [selectMenuComponent]
        }
      ]
    });
  });

// Command to demonstrate modal
const modalCommand = new SlashCommandBuilder()
  .setName('feedback')
  .setDescription('Leave feedback through a modal')
  .setHandler(async (interaction) => {
    // Get modal data
    const modalData = testModal.toJSON();
    
    // Show modal
    try {
      await interaction.showModal(modalData);
    } catch (error) {
      console.error('Error showing modal:', error);
      await interaction.reply({
        content: 'An error occurred while opening the feedback form.',
        ephemeral: true
      });
    }
  });

// Register all interactions
interactionManager.registerCommand(pingCommand.build());
interactionManager.registerCommand(echoCommand.build());
interactionManager.registerCommand(componentsCommand.build());
interactionManager.registerCommand(modalCommand.build());
interactionManager.registerButton(testButton.build());
interactionManager.registerSelectMenu(testSelectMenu.build());
interactionManager.registerModal(testModal.build());

// Bot ready event handler
client.once('ready', () => {
  console.log(`Bot ${client.user?.tag} successfully launched!`);
  
  // Register commands (in a real bot, use your application ID)
  // interactionManager.registerGlobalCommands('YOUR_APPLICATION_ID');
  // or
  // interactionManager.registerGuildCommands('YOUR_APPLICATION_ID', 'YOUR_GUILD_ID');
});

// Start the bot
client.login('YOUR_BOT_TOKEN'); 