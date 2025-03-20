import { 
  Client, 
  GatewayIntentBits,
  InteractionManager,
  SlashCommandBuilder,
  ButtonBuilder,
  ButtonStyle,
  SelectMenuBuilder,
  ModalBuilder,
  Logger,
  createActionRow,
  createActionRows,
  withTimeout
} from '../src';

// Initialize Logger
const logger = new Logger('AdvancedBot', true);

// Create Discord.js client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages
  ]
});

// Create Interaction Manager with debug mode
const manager = new InteractionManager(client, { debug: true });

// Example of utilizing the timeout utility
const asyncTaskCommand = new SlashCommandBuilder()
  .setName('task')
  .setDescription('Perform a task with timeout protection')
  .addStringOption(option => ({
    ...option,
    name: 'duration',
    description: 'How long the task should take (fast/medium/slow)',
    required: true
  }))
  .setHandler(async (interaction) => {
    const duration = interaction.options.getString('duration', true);
    
    // Defer the reply to get more time
    await interaction.deferReply();
    
    let delay = 1000; // default: fast
    
    if (duration === 'medium') delay = 3000;
    if (duration === 'slow') delay = 6000;
    
    try {
      // Execute with timeout protection
      await withTimeout(
        simulateTask(delay),
        interaction,
        { 
          timeout: 5000,
          timeoutMessage: 'This task took too long and timed out!',
          ephemeral: true
        }
      );
      
      await interaction.editReply(`Task completed in ${delay}ms! 🎉`);
    } catch (error) {
      logger.error(`Task failed: ${error instanceof Error ? error.message : String(error)}`);
      
      // Only respond if we haven't already sent a timeout message
      if (error instanceof Error && error.message !== 'Interaction timed out after 5000ms') {
        // Check if the interaction is still valid before responding
        try {
          await interaction.editReply('An error occurred while processing your task.');
        } catch (replyError) {
          logger.error('Failed to edit reply', replyError);
        }
      }
    }
  });

// Simulate an async task
async function simulateTask(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Multi-step workflow example
const workflowCommand = new SlashCommandBuilder()
  .setName('workflow')
  .setDescription('Start a multi-step workflow')
  .setHandler(async (interaction) => {
    try {
      // Send the initial message with buttons
      await interaction.reply({
        content: '## Workflow System\nThis is a multi-step workflow demonstration.',
        components: [createActionRow(
          new ButtonBuilder()
            .setCustomId('workflow_start')
            .setLabel('Start Workflow')
            .setStyle(ButtonStyle.SUCCESS)
            .setEmoji('▶️')
            .toJSON(),
          new ButtonBuilder()
            .setCustomId('workflow_cancel')
            .setLabel('Cancel')
            .setStyle(ButtonStyle.DANGER)
            .toJSON()
        )]
      });
      
      // Create buttons for the workflow and register button handlers
      const startButton = new ButtonBuilder()
        .setCustomId('workflow_start')
        .setLabel('Start Workflow')
        .setStyle(ButtonStyle.SUCCESS)
        .setEmoji('▶️')
        .setHandler(async (btnInteraction) => {
          try {
            // Update the message with the select menu
            await btnInteraction.update({
              content: '## Workflow Step 1\nPlease select an option to continue:',
              components: [createActionRow(
                new SelectMenuBuilder()
                  .setCustomId('workflow_select')
                  .setPlaceholder('Select an option to continue')
                  .addOptions([
                    { label: 'Option A', value: 'a', description: 'First option', emoji: '🅰️' },
                    { label: 'Option B', value: 'b', description: 'Second option', emoji: '🅱️' },
                    { label: 'Option C', value: 'c', description: 'Third option', emoji: '©️' }
                  ])
                  .toJSON()
              )]
            });
          } catch (error) {
            logger.error('Error in start button handler', error);
          }
        })
        .build();
        
      const cancelButton = new ButtonBuilder()
        .setCustomId('workflow_cancel')
        .setLabel('Cancel')
        .setStyle(ButtonStyle.DANGER)
        .setHandler(async (btnInteraction) => {
          try {
            await btnInteraction.update({
              content: '## Workflow Cancelled\nYou have cancelled the workflow.',
              components: [] // Remove all components
            });
          } catch (error) {
            logger.error('Error in cancel button handler', error);
          }
        })
        .build();
      
      // Register buttons
      manager.registerButton(startButton);
      manager.registerButton(cancelButton);
      
      // Create and register select menu
      const selectMenu = new SelectMenuBuilder()
        .setCustomId('workflow_select')
        .setPlaceholder('Select an option')
        .setHandler(async (menuInteraction) => {
          try {
            const selected = menuInteraction.values[0];
            
            // Create modal data
            const modalData = new ModalBuilder()
              .setCustomId(`workflow_feedback_${selected}`)
              .setTitle('Provide Feedback')
              .addShortTextInput('feedback_name', 'Your Name')
              .addParagraphTextInput('feedback_content', 'Your Feedback')
              .toJSON();
            
            // Show the modal
            await menuInteraction.showModal(modalData);
            
            // Register modal handler
            const feedbackModal = new ModalBuilder()
              .setCustomId(`workflow_feedback_${selected}`)
              .setTitle('Provide Feedback')
              .addShortTextInput('feedback_name', 'Your Name')
              .addParagraphTextInput('feedback_content', 'Your Feedback')
              .setHandler(async (modalInteraction) => {
                try {
                  const name = modalInteraction.fields.getTextInputValue('feedback_name');
                  const feedback = modalInteraction.fields.getTextInputValue('feedback_content');
                  
                  await modalInteraction.reply({
                    content: `## Workflow Complete!\n
Thank you, ${name}! You selected Option ${selected.toUpperCase()} and provided the following feedback:

> ${feedback}

The workflow is now complete.`,
                    ephemeral: true
                  });
                } catch (error) {
                  logger.error('Error in modal handler', error);
                }
              })
              .build();
              
            manager.registerModal(feedbackModal);
          } catch (error) {
            logger.error('Error in select menu handler', error);
          }
        })
        .build();
        
      manager.registerSelectMenu(selectMenu);
      
    } catch (error) {
      logger.error('Error in workflow command', error);
      await interaction.reply({ 
        content: 'An error occurred while starting the workflow', 
        ephemeral: true 
      });
    }
  });

// Register commands
manager.registerCommand(asyncTaskCommand.build());
manager.registerCommand(workflowCommand.build());

// Bot ready event
client.once('ready', () => {
  logger.info(`Bot is ready as ${client.user?.tag}!`);
});

// Error handling
process.on('unhandledRejection', (error) => {
  logger.error('Unhandled promise rejection:', error);
});

// Start the bot (in production, use environment variables)
if (process.env.DISCORD_TOKEN) {
  client.login(process.env.DISCORD_TOKEN)
    .catch(err => {
      logger.error('Failed to login', err);
      process.exit(1);
    });
} else {
  logger.error('No Discord token provided! Please set the DISCORD_TOKEN environment variable.');
  process.exit(1);
}
