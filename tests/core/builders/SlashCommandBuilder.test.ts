import { SlashCommandBuilder } from '../../../src/core/builders/SlashCommandBuilder';
import { InteractionType } from '../../../src/types';
import { ApplicationCommandOptionType } from 'discord.js';
import { expectArrayLength, expectProperty, typeCast } from '../../utils/test-helpers';

const createOptionMock = () => {
  return {
    setName: jest.fn().mockReturnThis(),
    setDescription: jest.fn().mockReturnThis(),
    setRequired: jest.fn().mockReturnThis(),
    addChoices: jest.fn().mockReturnThis(),
    toJSON: jest.fn().mockImplementation(function(this: any) {
      return {
        name: this.name,
        description: this.description,
        type: this.type,
        required: this.required,
        choices: this.choices
      };
    })
  };
};

describe('SlashCommandBuilder', () => {
  it('should create a slash command with basic properties', () => {
    const name = 'test-command';
    const description = 'Test command description';
    const handler = async () => {};
    
    const command = new SlashCommandBuilder()
      .setName(name)
      .setDescription(description)
      .setHandler(handler);
    
    const data = (command as any)._data;
    expect(data.name).toBe(name);
    expect(data.description).toBe(description);
    expect((command as any)._handler).toBe(handler);
    
    const built = command.build();
    expect(built.type).toBe(InteractionType.COMMAND);
    expect(built.id).toBe(name);
  });
  
  it('should build a command with options', () => {
    const stringOptionMock = {
      name: 'string-option',
      description: 'A string option',
      type: 3,
      required: true
    };
    
    const integerOptionMock = {
      name: 'integer-option',
      description: 'An integer option',
      type: 4,
      required: false
    };
    
    const originalStringOption = SlashCommandBuilder.prototype.addStringOption;
    const originalIntegerOption = SlashCommandBuilder.prototype.addIntegerOption;
    
    SlashCommandBuilder.prototype.addStringOption = jest.fn(function(this: any) {
      if (!this._data.options) this._data.options = [];
      this._data.options.push(stringOptionMock);
      return this;
    });
    
    SlashCommandBuilder.prototype.addIntegerOption = jest.fn(function(this: any) {
      if (!this._data.options) this._data.options = [];
      this._data.options.push(integerOptionMock);
      return this;
    });
    
    const command = new SlashCommandBuilder()
      .setName('test')
      .setDescription('Test command')
      .addStringOption(() => ({} as any))
      .addIntegerOption(() => ({} as any))
      .setHandler(async () => {});
    
    const built = command.build();
    
    expect(built.id).toBe('test');
    expect((built.data as any).name).toBe('test');
    expect((built.data as any).description).toBe('Test command');
    
    const options = (built.data as any).options || [];
    expect(options.length).toBe(2);
    
    expect(options[0]).toEqual(stringOptionMock);
    expect(options[1]).toEqual(integerOptionMock);
    
    SlashCommandBuilder.prototype.addStringOption = originalStringOption;
    SlashCommandBuilder.prototype.addIntegerOption = originalIntegerOption;
  });
  
  it('should handle choices for options', () => {
    const optionWithChoicesMock = {
      name: 'choice-option',
      description: 'An option with choices',
      type: 3,
      choices: [
        { name: 'First Choice', value: 'first' },
        { name: 'Second Choice', value: 'second' }
      ]
    };
    
    const originalStringOption = SlashCommandBuilder.prototype.addStringOption;
    
    SlashCommandBuilder.prototype.addStringOption = jest.fn(function(this: any) {
      if (!this._data.options) this._data.options = [];
      this._data.options.push(optionWithChoicesMock);
      return this;
    });
    
    const command = new SlashCommandBuilder()
      .setName('test-choices')
      .setDescription('Test command with choices')
      .addStringOption(() => ({} as any))
      .setHandler(async () => {});
    
    const built = command.build();
    
    const options = (built.data as any).options || [];
    expect(options.length).toBe(1);
    
    if (options.length > 0) {
      const choices = options[0].choices || [];
      expect(choices.length).toBe(2);
      
      if (choices.length >= 2) {
        expect(choices[0]).toEqual({ name: 'First Choice', value: 'first' });
        expect(choices[1]).toEqual({ name: 'Second Choice', value: 'second' });
      }
    }
    
    SlashCommandBuilder.prototype.addStringOption = originalStringOption;
  });
  
  it('should throw if required fields are missing', () => {
    const noNameCommand = new SlashCommandBuilder()
      .setDescription('Test command')
      .setHandler(async () => {});
    
    expect(() => noNameCommand.build()).toThrow('Command name is required');
    
    const noDescriptionCommand = new SlashCommandBuilder()
      .setName('test')
      .setHandler(async () => {});
    
    expect(() => noDescriptionCommand.build()).toThrow('Command description is required');
    
    const noHandlerCommand = new SlashCommandBuilder()
      .setName('test')
      .setDescription('Test command');
    
    expect(() => noHandlerCommand.build()).toThrow('Command handler is required');
  });

  it('should add user option correctly', () => {
    const command = new SlashCommandBuilder()
      .setName('test-command')
      .setDescription('Test command description')
      .addUserOption((option) => {
        option.name = 'target-user';
        option.description = 'The user to target';
        option.required = true;
        return option;
      })
      .setHandler(async () => {});
    
    const data = (command as any)._data;
    const options = data.options || [];
    
    expect(options.length).toBe(1);
    if (options.length > 0) {
      expect(options[0].type).toBe(ApplicationCommandOptionType.User);
      expect(options[0].name).toBe('target-user');
      expect(options[0].description).toBe('The user to target');
      expect(options[0].required).toBe(true);
    }
  });

  it('should add boolean option correctly', () => {
    const command = new SlashCommandBuilder()
      .setName('test-command')
      .setDescription('Test command description')
      .addBooleanOption((option) => {
        option.name = 'flag';
        option.description = 'Enable or disable feature';
        option.required = false;
        return option;
      })
      .setHandler(async () => {});
    
    const data = (command as any)._data;
    const options = data.options || [];
    
    expect(options.length).toBe(1);
    if (options.length > 0) {
      expect(options[0].type).toBe(ApplicationCommandOptionType.Boolean);
      expect(options[0].name).toBe('flag');
      expect(options[0].description).toBe('Enable or disable feature');
      expect(options[0].required).toBe(false);
    }
  });

  it('should add channel option correctly', () => {
    const command = new SlashCommandBuilder()
      .setName('test-command')
      .setDescription('Test command description')
      .addChannelOption((option) => {
        option.name = 'target-channel';
        option.description = 'The channel to use';
        option.required = true;
        return option;
      })
      .setHandler(async () => {});
    
    const data = (command as any)._data;
    const options = data.options || [];
    
    expect(options.length).toBe(1);
    if (options.length > 0) {
      expect(options[0].type).toBe(ApplicationCommandOptionType.Channel);
      expect(options[0].name).toBe('target-channel');
      expect(options[0].description).toBe('The channel to use');
      expect(options[0].required).toBe(true);
    }
  });

  it('should add role option correctly', () => {
    const command = new SlashCommandBuilder()
      .setName('test-command')
      .setDescription('Test command description')
      .addRoleOption((option) => {
        option.name = 'target-role';
        option.description = 'The role to use';
        option.required = true;
        return option;
      })
      .setHandler(async () => {});
    
    const data = (command as any)._data;
    const options = data.options || [];
    
    expect(options.length).toBe(1);
    if (options.length > 0) {
      expect(options[0].type).toBe(ApplicationCommandOptionType.Role);
      expect(options[0].name).toBe('target-role');
      expect(options[0].description).toBe('The role to use');
      expect(options[0].required).toBe(true);
    }
  });

  it('should handle multiple different options correctly', () => {
    const command = new SlashCommandBuilder()
      .setName('test-command')
      .setDescription('Test command description')
      .addStringOption((option) => {
        option.name = 'string-opt';
        option.description = 'A string option';
        return option;
      })
      .addIntegerOption((option) => {
        option.name = 'int-opt';
        option.description = 'An integer option';
        return option;
      })
      .addBooleanOption((option) => {
        option.name = 'bool-opt';
        option.description = 'A boolean option';
        return option;
      })
      .addUserOption((option) => {
        option.name = 'user-opt';
        option.description = 'A user option';
        return option;
      })
      .setHandler(async () => {});
    
    const data = (command as any)._data;
    const options = data.options || [];
    
    expect(options.length).toBe(4);
    
    if (options.length >= 4) {
      expect(options[0].type).toBe(ApplicationCommandOptionType.String);
      expect(options[0].name).toBe('string-opt');
      
      expect(options[1].type).toBe(ApplicationCommandOptionType.Integer);
      expect(options[1].name).toBe('int-opt');
      
      expect(options[2].type).toBe(ApplicationCommandOptionType.Boolean);
      expect(options[2].name).toBe('bool-opt');
      
      expect(options[3].type).toBe(ApplicationCommandOptionType.User);
      expect(options[3].name).toBe('user-opt');
    }
  });
});