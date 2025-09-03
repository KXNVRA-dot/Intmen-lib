import { Client, Interaction, CommandInteraction, ButtonInteraction, SelectMenuInteraction, ModalSubmitInteraction, ContextMenuCommandInteraction, AutocompleteInteraction, REST, Routes } from 'discord.js';
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
    // Mock the token for REST
    Object.defineProperty(client, 'token', { value: 'mock-token' });
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
  expect(handler).toHaveBeenCalledWith(expect.objectContaining({ interaction: mockInteraction }));
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
  expect(handler).toHaveBeenCalledWith(expect.objectContaining({ interaction: mockInteraction }));
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
  expect(handler).toHaveBeenCalledWith(expect.objectContaining({ interaction: mockInteraction }));
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
  expect(handler).toHaveBeenCalledWith(expect.objectContaining({ interaction: mockInteraction }));
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

  describe('Command cooldowns', () => {
    it('should prevent execution when on cooldown', async () => {
      const handler = jest.fn();
      const command = new SlashCommandBuilder()
        .setName('cool')
        .setDescription('cooldown test')
        .setCooldown(5000)
        .setHandler(handler);
      manager.registerCommand(command.build());

      const baseInteraction = {
        isCommand: () => true,
        isButton: () => false,
        isSelectMenu: () => false,
        isModalSubmit: () => false,
        isContextMenuCommand: () => false,
        isAutocomplete: () => false,
        commandName: 'cool',
        user: { id: 'user1' },
        replied: false,
        deferred: false,
        reply: jest.fn().mockResolvedValue(undefined),
        editReply: jest.fn().mockResolvedValue(undefined)
      } as unknown as CommandInteraction;

      await manager['handleInteraction'](baseInteraction as Interaction);
      expect(handler).toHaveBeenCalledTimes(1);

      const second = { ...baseInteraction, reply: jest.fn().mockResolvedValue(undefined) } as unknown as CommandInteraction;
      await manager['handleInteraction'](second as Interaction);
      expect(handler).toHaveBeenCalledTimes(1);
      expect(second.reply).toHaveBeenCalledWith(expect.objectContaining({ content: expect.stringContaining('wait'), ephemeral: true }));
    });
  });

  describe('Command Registration with API', () => {
    let mockRest: jest.Mocked<REST>;
    
    beforeEach(() => {
      // Mock the Routes object functions
      (Routes.applicationCommands as jest.Mock) = jest.fn().mockReturnValue('/app-commands-route');
      (Routes.applicationGuildCommands as jest.Mock) = jest.fn().mockReturnValue('/guild-commands-route');
      
      // Mock the REST API
      mockRest = {
        put: jest.fn().mockResolvedValue(undefined),
        setToken: jest.fn().mockReturnThis()
      } as unknown as jest.Mocked<REST>;
      
      // Assign the mocked REST to the manager
      (manager as any).rest = mockRest;
    });
    
    it('should register global commands to Discord API', async () => {
      // Register a command
      const commandBuilder = new SlashCommandBuilder()
        .setName('test-command')
        .setDescription('Test command for API registration')
        .setHandler(async () => {});
      manager.registerCommand(commandBuilder.build());
      
      // Test registerGlobalCommands
      const applicationId = '123456789012345678';
      await manager.registerGlobalCommands(applicationId);
      
      // Verify the REST API call
      expect(mockRest.put).toHaveBeenCalledTimes(1);
      expect(Routes.applicationCommands).toHaveBeenCalledWith(applicationId);
      expect(mockRest.put).toHaveBeenCalledWith(
        '/app-commands-route',
        expect.objectContaining({
          body: expect.arrayContaining([
            expect.objectContaining({
              name: 'test-command',
              description: 'Test command for API registration'
            })
          ])
        })
      );
    });
    
    it('should register guild commands to Discord API', async () => {
      // Register a command
      const commandBuilder = new SlashCommandBuilder()
        .setName('test-guild-command')
        .setDescription('Test guild command for API registration')
        .setHandler(async () => {});
      manager.registerCommand(commandBuilder.build());
      
      // Test registerGuildCommands
      const applicationId = '123456789012345678';
      const guildId = '876543210987654321';
      await manager.registerGuildCommands(applicationId, guildId);
      
      // Verify the REST API call
      expect(mockRest.put).toHaveBeenCalledTimes(1);
      expect(Routes.applicationGuildCommands).toHaveBeenCalledWith(applicationId, guildId);
      expect(mockRest.put).toHaveBeenCalledWith(
        '/guild-commands-route',
        expect.objectContaining({
          body: expect.arrayContaining([
            expect.objectContaining({
              name: 'test-guild-command',
              description: 'Test guild command for API registration'
            })
          ])
        })
      );
    });
    
    it('should register provided commands list to the API', async () => {
      const customCommands = [
        {
          name: 'custom-command-1',
          description: 'First custom command',
          type: 1
        },
        {
          name: 'custom-command-2',
          description: 'Second custom command',
          type: 1
        }
      ];
      
      const applicationId = '123456789012345678';
      await manager.registerGlobalCommands(applicationId, customCommands);
      
      // Verify the REST API call with custom commands
      expect(mockRest.put).toHaveBeenCalledTimes(1);
      expect(mockRest.put).toHaveBeenCalledWith(
        Routes.applicationCommands(applicationId),
        expect.objectContaining({
          body: customCommands
        })
      );
    });
    
    it('should handle API errors during command registration', async () => {
      // Mock an API error
      const errorMessage = 'Discord API Error';
      mockRest.put = jest.fn().mockRejectedValue(new Error(errorMessage));
      
      // Register a command
      const commandBuilder = new SlashCommandBuilder()
        .setName('test-command')
        .setDescription('Test command')
        .setHandler(async () => {});
      manager.registerCommand(commandBuilder.build());
      
      // Attempt to register and expect error
      const applicationId = '123456789012345678';
      await expect(manager.registerGlobalCommands(applicationId))
        .rejects.toThrow(errorMessage);
      
      // Verify the error was logged
      expect(mockRest.put).toHaveBeenCalledTimes(1);
    });

    it('should log errors during guild command registration', async () => {
      // Spy on the logger.error method
      const errorSpy = jest.spyOn(console, 'error').mockImplementation();
      
      // Setup a REST error simulation
      const errorMessage = 'Guild API Error';
      mockRest.put = jest.fn().mockRejectedValue(new Error(errorMessage));
      
      // Register a command
      const commandBuilder = new SlashCommandBuilder()
        .setName('test-guild-error-command')
        .setDescription('Test guild command that will fail')
        .setHandler(async () => {});
      manager.registerCommand(commandBuilder.build());
      
      // Test registerGuildCommands with error
      const applicationId = '123456789012345678';
      const guildId = '876543210987654321';
      
      try {
        await manager.registerGuildCommands(applicationId, guildId);
      } catch (error) {
        // Expected to throw, but we want to check the logging
      }
      
      // Verify error was logged
      let foundErrorLog = false;
      errorSpy.mock.calls.forEach(call => {
        if (typeof call[0] === 'string' && call[0].includes(`Error registering commands on guild ${guildId}`)) {
          foundErrorLog = true;
        }
      });
      expect(foundErrorLog).toBe(true);
      
      errorSpy.mockRestore();
    });
  });
  
  describe('Additional Interaction Types', () => {
    it('should register and handle context menu commands', async () => {
      const contextMenuId = 'test-context-menu';
      const handler = jest.fn();
      
      // Create a context menu command
      const contextMenu = {
        id: contextMenuId,
        type: InteractionType.CONTEXT_MENU,
        handler,
        data: {
          name: contextMenuId,
          type: 3 // USER type context menu
        }
      } as const;
      
      manager.registerContextMenu(contextMenu);
      
      // Mock a context menu interaction
      const mockInteraction = {
        isCommand: () => false,
        isButton: () => false,
        isSelectMenu: () => false,
        isModalSubmit: () => false,
        isContextMenuCommand: () => true,
        isAutocomplete: () => false,
        commandName: contextMenuId,
        replied: false,
        deferred: false,
        reply: jest.fn().mockResolvedValue(undefined)
      } as unknown as ContextMenuCommandInteraction;
      
      await manager['handleInteraction'](mockInteraction as Interaction);
      
  expect(handler).toHaveBeenCalledTimes(1);
  expect(handler).toHaveBeenCalledWith(expect.objectContaining({ interaction: mockInteraction }));
    });
    
    it('should register and handle autocomplete interactions', async () => {
      const autocompleteId = 'test-autocomplete';
      const handler = jest.fn();
      
      // Create an autocomplete handler
      const autocomplete = {
        id: autocompleteId,
        type: InteractionType.AUTOCOMPLETE,
        handler
      } as const;
      
      manager.registerAutocomplete(autocomplete);
      
      // Mock an autocomplete interaction
      const mockInteraction = {
        isCommand: () => false,
        isButton: () => false,
        isSelectMenu: () => false,
        isModalSubmit: () => false,
        isContextMenuCommand: () => false,
        isAutocomplete: () => true,
        commandName: autocompleteId,
      } as unknown as AutocompleteInteraction;
      
      await manager['handleInteraction'](mockInteraction as Interaction);
      
  expect(handler).toHaveBeenCalledTimes(1);
  expect(handler).toHaveBeenCalledWith(expect.objectContaining({ interaction: mockInteraction }));
    });
    
    it('should handle error during autocomplete interaction', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const autocompleteId = 'test-autocomplete';
      
      // Create a handler that throws an error
      const errorMessage = 'Autocomplete error';
      const handler = jest.fn().mockImplementation(() => {
        throw new Error(errorMessage);
      });
      
      // Create an autocomplete handler
      const autocomplete = {
        id: autocompleteId,
        type: InteractionType.AUTOCOMPLETE,
        handler
      } as const;
      
      manager.registerAutocomplete(autocomplete);
      
      // Mock an autocomplete interaction
      const mockInteraction = {
        isCommand: () => false,
        isButton: () => false,
        isSelectMenu: () => false,
        isModalSubmit: () => false,
        isContextMenuCommand: () => false,
        isAutocomplete: () => true,
        commandName: autocompleteId,
      } as unknown as AutocompleteInteraction;
      
      // The handler should throw but the error should be caught
      await manager['handleInteraction'](mockInteraction as Interaction);
      
      expect(handler).toHaveBeenCalledTimes(1);
      // Check that error was logged
      expect(consoleSpy).toHaveBeenCalled();
      
      // Verify that the log message includes autocomplete error info
      let foundErrorLog = false;
      consoleSpy.mock.calls.forEach(call => {
        // Check if first argument is a string containing our error text
        if (typeof call[0] === 'string' && call[0].includes('Error handling autocomplete')) {
          foundErrorLog = true;
        }
      });
      expect(foundErrorLog).toBe(true);
      
      consoleSpy.mockRestore();
    });
  });
  
  describe('Error Handling', () => {
    it('should handle missing interactions gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      // Mock interactions with non-existent handlers
      const mockCommandInteraction = {
        isCommand: () => true,
        isButton: () => false,
        isSelectMenu: () => false,
        isModalSubmit: () => false,
        isContextMenuCommand: () => false,
        isAutocomplete: () => false,
        commandName: 'non-existent-command'
      } as unknown as CommandInteraction;
      
      await manager['handleInteraction'](mockCommandInteraction as Interaction);
      
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Command not found')
      );
      
      // Test with a button
      const mockButtonInteraction = {
        isCommand: () => false,
        isButton: () => true,
        isSelectMenu: () => false,
        isModalSubmit: () => false,
        isContextMenuCommand: () => false,
        isAutocomplete: () => false,
        customId: 'non-existent-button'
      } as unknown as ButtonInteraction;
      
      await manager['handleInteraction'](mockButtonInteraction as Interaction);
      
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Button not found')
      );
      
      consoleSpy.mockRestore();
    });
    
    it('should handle command execution errors', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const commandId = 'error-command';
      
      // Create a command that throws an error
      const errorMessage = 'Command execution error';
      const handler = jest.fn().mockImplementation(() => {
        throw new Error(errorMessage);
      });
      
      const command = new SlashCommandBuilder()
        .setName(commandId)
        .setDescription('Command that errors')
        .setHandler(handler);
      
      manager.registerCommand(command.build());
      
      // Mock a command interaction
      const mockInteraction = {
        isCommand: () => true,
        isButton: () => false,
        isSelectMenu: () => false,
        isModalSubmit: () => false,
        isContextMenuCommand: () => false,
        isAutocomplete: () => false,
        commandName: commandId,
        replied: false,
        deferred: false,
        reply: jest.fn().mockResolvedValue(undefined)
      } as unknown as CommandInteraction;
      
      await manager['handleInteraction'](mockInteraction as Interaction);
      
      expect(handler).toHaveBeenCalledTimes(1);
      
      // Check that error was logged
      expect(consoleSpy).toHaveBeenCalled();
      
      // Verify that the log message includes command error info
      let foundErrorLog = false;
      consoleSpy.mock.calls.forEach(call => {
        // Check if first argument is a string containing our error text
        if (typeof call[0] === 'string' && call[0].includes(`Error executing command ${commandId}`)) {
          foundErrorLog = true;
        }
      });
      expect(foundErrorLog).toBe(true);
      
      expect(mockInteraction.reply).toHaveBeenCalledWith(
        expect.objectContaining({
          content: expect.stringContaining('error occurred'),
          ephemeral: true
        })
      );
      
      consoleSpy.mockRestore();
    });
  });
});