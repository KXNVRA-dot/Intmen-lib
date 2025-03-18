import { Client, Interaction, CommandInteraction, ButtonInteraction, SelectMenuInteraction, ModalSubmitInteraction } from 'discord.js';
import { InteractionManager } from '../../src/core/InteractionManager';
import { SlashCommandBuilder } from '../../src/core/builders/SlashCommandBuilder';
import { ButtonBuilder } from '../../src/core/builders/ButtonBuilder';
import { SelectMenuBuilder } from '../../src/core/builders/SelectMenuBuilder';
import { ModalBuilder } from '../../src/core/builders/ModalBuilder';
import { ButtonStyle, InteractionType } from '../../src/types';
import { expectProperty, typeCast } from '../utils/test-helpers';

jest.mock('discord.js');

describe('InteractionManager', () => {
  let client: Client;
  let manager: InteractionManager;
  
  beforeEach(() => {
    client = new Client({ intents: [] });
    manager = new InteractionManager(client);
  });
  
  it('should initialize with default options', () => {
    expect(manager).toBeInstanceOf(InteractionManager);
    expect(manager['client']).toBe(client);
    expect(manager['options'].autoRegisterEvents).toBe(true);
    expect(manager['options'].debug).toBe(false);
  });
  
  it('should initialize with custom options', () => {
    const customManager = new InteractionManager(client, {
      autoRegisterEvents: false,
      debug: true
    });
    
    expect(customManager['options'].autoRegisterEvents).toBe(false);
    expect(customManager['options'].debug).toBe(true);
  });
  
  it('should register a command', () => {
    const commandBuilder = new SlashCommandBuilder()
      .setName('test')
      .setDescription('Test command')
      .setHandler(async () => {});
    
    const command = commandBuilder.build();
    manager.registerCommand(command);
    
    expect(manager['interactions'].size).toBe(1);
    expect(manager['interactions'].has('test')).toBe(true);
    
    const registeredCommand = manager['interactions'].get('test');
    expect(registeredCommand?.type).toBe(InteractionType.COMMAND);
    expect(registeredCommand?.id).toBe('test');
  });
  
  it('should register a button', () => {
    const buttonId = 'test-button';
    const buttonBuilder = new ButtonBuilder()
      .setCustomId(buttonId)
      .setLabel('Test Button')
      .setStyle(ButtonStyle.PRIMARY)
      .setHandler(async () => {});
    
    const button = buttonBuilder.build();
    manager.registerButton(button);
    
    expect(manager['interactions'].size).toBe(1);
    expect(manager['interactions'].has(buttonId)).toBe(true);
    
    const registeredButton = manager['interactions'].get(buttonId);
    expect(registeredButton?.type).toBe(InteractionType.BUTTON);
    expect(registeredButton?.id).toBe(buttonId);
  });
  
  it('should register a select menu', () => {
    const menuId = 'test-menu';
    const menuBuilder = new SelectMenuBuilder()
      .setCustomId(menuId)
      .setPlaceholder('Select an option')
      .addOption({
        label: 'Option 1',
        value: 'option1',
        description: 'First option'
      })
      .setHandler(async () => {});
    
    const menu = menuBuilder.build();
    manager.registerSelectMenu(menu);
    
    expect(manager['interactions'].size).toBe(1);
    expect(manager['interactions'].has(menuId)).toBe(true);
    
    const registeredMenu = manager['interactions'].get(menuId);
    expect(registeredMenu?.type).toBe(InteractionType.SELECT_MENU);
    expect(registeredMenu?.id).toBe(menuId);
  });
  
  it('should register a modal', () => {
    const modalId = 'test-modal';
    const modalBuilder = new ModalBuilder()
      .setCustomId(modalId)
      .setTitle('Test Modal')
      .addShortTextInput('input-1', 'Test Input')
      .setHandler(async () => {});
    
    const modal = modalBuilder.build();
    manager.registerModal(modal);
    
    expect(manager['interactions'].size).toBe(1);
    expect(manager['interactions'].has(modalId)).toBe(true);
    
    const registeredModal = manager['interactions'].get(modalId);
    expect(registeredModal?.type).toBe(InteractionType.MODAL);
    expect(registeredModal?.id).toBe(modalId);
  });
  
  it('should handle registering duplicate interactions', () => {
    const commandId = 'duplicate';
    
    const command1Builder = new SlashCommandBuilder()
      .setName(commandId)
      .setDescription('First command')
      .setHandler(async () => {});
    
    const command1 = command1Builder.build();
    manager.registerCommand(command1);
    
    const command2Builder = new SlashCommandBuilder()
      .setName(commandId)
      .setDescription('Second command')
      .setHandler(async () => {});
    
    const command2 = command2Builder.build();
    manager.registerCommand(command2);
    
    expect(manager['interactions'].size).toBe(1);
    
    const registeredCommand = manager['interactions'].get(commandId);
    expect(registeredCommand?.id).toBe(commandId);
    
    const cmdData = typeCast<any>(registeredCommand).data;
    expectProperty(cmdData, 'description', 'Second command');
  });

  it('should handle multiple different types of interactions', () => {
    const command = new SlashCommandBuilder()
      .setName('test-cmd')
      .setDescription('Test command')
      .setHandler(async () => {});
    manager.registerCommand(command.build());
    
    const button = new ButtonBuilder()
      .setCustomId('test-btn')
      .setLabel('Click Me')
      .setStyle(ButtonStyle.PRIMARY)
      .setHandler(async () => {});
    manager.registerButton(button.build());
    
    const menu = new SelectMenuBuilder()
      .setCustomId('test-menu')
      .setPlaceholder('Select option')
      .addOption({ label: 'Option', value: 'value' })
      .setHandler(async () => {});
    manager.registerSelectMenu(menu.build());
    
    expect(manager['interactions'].size).toBe(3);
    expect(manager['interactions'].has('test-cmd')).toBe(true);
    expect(manager['interactions'].has('test-btn')).toBe(true);
    expect(manager['interactions'].has('test-menu')).toBe(true);
  });

  describe('Event handling', () => {
    it('should handle command interactions', async () => {
      const commandId = 'test-command';
      const handler = jest.fn();
      
      const command = new SlashCommandBuilder()
        .setName(commandId)
        .setDescription('Test command')
        .setHandler(handler);
      manager.registerCommand(command.build());
      
      const mockInteraction = {
        isCommand: () => true,
        isButton: () => false,
        isSelectMenu: () => false,
        isModalSubmit: () => false,
        isContextMenuCommand: () => false,
        isAutocomplete: () => false,
        commandName: commandId,
        deferReply: jest.fn().mockResolvedValue(undefined)
      } as unknown as CommandInteraction;
      
      await manager['handleInteraction'](mockInteraction as Interaction);
      
      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler).toHaveBeenCalledWith(mockInteraction);
    });
    
    it('should handle button interactions', async () => {
      const buttonId = 'test-button';
      const handler = jest.fn();
      
      const button = new ButtonBuilder()
        .setCustomId(buttonId)
        .setLabel('Test Button')
        .setStyle(ButtonStyle.PRIMARY)
        .setHandler(handler);
      manager.registerButton(button.build());
      
      const mockInteraction = {
        isCommand: () => false,
        isButton: () => true,
        isSelectMenu: () => false,
        isModalSubmit: () => false,
        isContextMenuCommand: () => false,
        isAutocomplete: () => false,
        customId: buttonId,
        deferUpdate: jest.fn().mockResolvedValue(undefined)
      } as unknown as ButtonInteraction;
      
      await manager['handleInteraction'](mockInteraction as Interaction);
      
      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler).toHaveBeenCalledWith(mockInteraction);
    });
    
    it('should handle select menu interactions', async () => {
      const menuId = 'test-menu';
      const handler = jest.fn();
      
      const menu = new SelectMenuBuilder()
        .setCustomId(menuId)
        .setPlaceholder('Select option')
        .addOption({ label: 'Option', value: 'value' })
        .setHandler(handler);
      manager.registerSelectMenu(menu.build());
      
      const mockInteraction = {
        isCommand: () => false,
        isButton: () => false,
        isSelectMenu: () => true,
        isModalSubmit: () => false,
        isContextMenuCommand: () => false,
        isAutocomplete: () => false,
        customId: menuId,
        deferUpdate: jest.fn().mockResolvedValue(undefined)
      } as unknown as SelectMenuInteraction;
      
      await manager['handleInteraction'](mockInteraction as Interaction);
      
      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler).toHaveBeenCalledWith(mockInteraction);
    });
    
    it('should handle modal interactions', async () => {
      const modalId = 'test-modal';
      const handler = jest.fn();
      
      const modal = new ModalBuilder()
        .setCustomId(modalId)
        .setTitle('Test Modal')
        .addShortTextInput('input-1', 'Test Input')
        .setHandler(handler);
      manager.registerModal(modal.build());
      
      const mockInteraction = {
        isCommand: () => false,
        isButton: () => false,
        isSelectMenu: () => false,
        isModalSubmit: () => true,
        isContextMenuCommand: () => false,
        isAutocomplete: () => false,
        customId: modalId,
        deferUpdate: jest.fn().mockResolvedValue(undefined)
      } as unknown as ModalSubmitInteraction;
      
      await manager['handleInteraction'](mockInteraction as Interaction);
      
      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler).toHaveBeenCalledWith(mockInteraction);
    });
    
    it('should handle unknown interactions gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      const mockInteraction = {
        isCommand: () => false,
        isButton: () => false,
        isSelectMenu: () => false,
        isModalSubmit: () => false,
        isContextMenuCommand: () => false,
        isAutocomplete: () => false,
        type: 'unknown'
      } as unknown as Interaction;
      
      await manager['handleInteraction'](mockInteraction);
      
      expect(consoleSpy).not.toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });
  });
});