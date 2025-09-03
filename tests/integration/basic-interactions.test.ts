import { Client, CommandInteraction, ButtonInteraction } from 'discord.js';
import { InteractionManager } from '../../src/core/InteractionManager';
import { SlashCommandBuilder } from '../../src/core/builders/SlashCommandBuilder';
import { ButtonBuilder } from '../../src/core/builders/ButtonBuilder';
import { ButtonStyle, InteractionType } from '../../src/types';

jest.mock('discord.js');

describe('Integration tests: Basic Interactions', () => {
  let client: Client;
  let manager: InteractionManager;
  
  beforeEach(() => {
    client = new Client({ intents: [] });
    manager = new InteractionManager(client);
  });
  
  it('should register and handle a command that creates a button', async () => {
    const buttonId = 'test-button';
    let buttonInteractionReceived = false;
    
    const commandHandler = jest.fn().mockImplementation(async () => {
      return true;
    });
    
    const buttonHandler = jest.fn().mockImplementation(async () => {
      buttonInteractionReceived = true;
      return true;
    });
    
    const command = new SlashCommandBuilder()
      .setName('create-button')
      .setDescription('Creates a test button')
      .setHandler(commandHandler);
    
    manager.registerCommand(command.build());
    
    const button = new ButtonBuilder()
      .setCustomId(buttonId)
      .setLabel('Test Button')
      .setStyle(ButtonStyle.PRIMARY)
      .setHandler(buttonHandler);
    
    manager.registerButton(button.build());
    
    const mockCommandInteraction = {
      isCommand: () => true,
      isButton: () => false,
      isSelectMenu: () => false,
      isModalSubmit: () => false,
      isContextMenuCommand: () => false,
      isAutocomplete: () => false,
      commandName: 'create-button',
      deferReply: jest.fn().mockResolvedValue(undefined)
    } as unknown as CommandInteraction;
    
    await manager['handleInteraction'](mockCommandInteraction as any);
    
  expect(commandHandler).toHaveBeenCalledTimes(1);
  expect(commandHandler).toHaveBeenCalledWith(expect.objectContaining({ interaction: mockCommandInteraction }));
    
    const mockButtonInteraction = {
      isCommand: () => false,
      isButton: () => true,
      isSelectMenu: () => false,
      isModalSubmit: () => false,
      isContextMenuCommand: () => false,
      isAutocomplete: () => false,
      customId: buttonId,
      deferUpdate: jest.fn().mockResolvedValue(undefined)
    } as unknown as ButtonInteraction;
    
    await manager['handleInteraction'](mockButtonInteraction as any);
    
  expect(buttonHandler).toHaveBeenCalledTimes(1);
  expect(buttonHandler).toHaveBeenCalledWith(expect.objectContaining({ interaction: mockButtonInteraction }));
    expect(buttonInteractionReceived).toBe(true);
  });
  
  it('should allow command chaining through a sequential flow', async () => {
    let sharedContext = {
      step1Completed: false,
      step2Completed: false,
      step3Completed: false
    };
    
    const command1Handler = jest.fn().mockImplementation(async () => {
      sharedContext.step1Completed = true;
      return true;
    });
    
    const buttonHandler = jest.fn().mockImplementation(async () => {
      if (sharedContext.step1Completed) {
        sharedContext.step2Completed = true;
      }
      return true;
    });
    
    const command2Handler = jest.fn().mockImplementation(async () => {
      if (sharedContext.step2Completed) {
        sharedContext.step3Completed = true;
      }
      return true;
    });
    
    const command1 = new SlashCommandBuilder()
      .setName('command-1')
      .setDescription('First command in chain')
      .setHandler(command1Handler);
    
    manager.registerCommand(command1.build());
    
    const button = new ButtonBuilder()
      .setCustomId('chain-button')
      .setLabel('Continue Chain')
      .setStyle(ButtonStyle.PRIMARY)
      .setHandler(buttonHandler);
    
    manager.registerButton(button.build());
    
    const command2 = new SlashCommandBuilder()
      .setName('command-2')
      .setDescription('Second command in chain')
      .setHandler(command2Handler);
    
    manager.registerCommand(command2.build());
    
    const mockCommand1Interaction = {
      isCommand: () => true,
      isButton: () => false,
      isSelectMenu: () => false,
      isModalSubmit: () => false,
      isContextMenuCommand: () => false,
      isAutocomplete: () => false,
      commandName: 'command-1',
      deferReply: jest.fn().mockResolvedValue(undefined)
    } as unknown as CommandInteraction;
    
    await manager['handleInteraction'](mockCommand1Interaction as any);
    
    expect(command1Handler).toHaveBeenCalledTimes(1);
    expect(sharedContext.step1Completed).toBe(true);
    
    const mockButtonInteraction = {
      isCommand: () => false,
      isButton: () => true,
      isSelectMenu: () => false,
      isModalSubmit: () => false,
      isContextMenuCommand: () => false,
      isAutocomplete: () => false,
      customId: 'chain-button',
      deferUpdate: jest.fn().mockResolvedValue(undefined)
    } as unknown as ButtonInteraction;
    
    await manager['handleInteraction'](mockButtonInteraction as any);
    
    expect(buttonHandler).toHaveBeenCalledTimes(1);
    expect(sharedContext.step2Completed).toBe(true);
    
    const mockCommand2Interaction = {
      isCommand: () => true,
      isButton: () => false,
      isSelectMenu: () => false,
      isModalSubmit: () => false,
      isContextMenuCommand: () => false,
      isAutocomplete: () => false,
      commandName: 'command-2',
      deferReply: jest.fn().mockResolvedValue(undefined)
    } as unknown as CommandInteraction;
    
    await manager['handleInteraction'](mockCommand2Interaction as any);
    
    expect(command2Handler).toHaveBeenCalledTimes(1);
    expect(sharedContext.step3Completed).toBe(true);
    
    expect(sharedContext).toEqual({
      step1Completed: true,
      step2Completed: true,
      step3Completed: true
    });
  });
});