import { SelectMenuBuilder } from '../../../src/core/builders/SelectMenuBuilder';
import { InteractionType } from '../../../src/types';
import { ComponentType } from 'discord.js';

describe('SelectMenuBuilder', () => {
  it('should create a select menu with basic properties', () => {
    const builder = new SelectMenuBuilder()
      .setCustomId('test-menu')
      .setPlaceholder('Select an option')
      .addOption({
        label: 'Option 1',
        value: 'option1',
        description: 'This is the first option'
      })
      .setHandler(async () => {});

    expect((builder as any)._customId).toBe('test-menu');
    expect((builder as any)._placeholder).toBe('Select an option');
    expect(typeof (builder as any)._handler).toBe('function');

    const built = builder.build();
    expect(built.id).toBe('test-menu');
    expect(built.type).toBe(InteractionType.SELECT_MENU);
    expect(typeof built.handler).toBe('function');
  });

  it('should set min and max values', () => {
    const builder = new SelectMenuBuilder()
      .setCustomId('test-menu')
      .setPlaceholder('Select options')
      .addOption({ label: 'Option 1', value: 'option1' })
      .addOption({ label: 'Option 2', value: 'option2' })
      .setMinValues(1)
      .setMaxValues(2)
      .setHandler(async () => {});
    
    expect((builder as any)._minValues).toBe(1);
    expect((builder as any)._maxValues).toBe(2);
    
    const json = builder.toJSON();
    expect(json.min_values).toBe(1);
    expect(json.max_values).toBe(2);
  });
  
  it('should set disabled state', () => {
    const builder = new SelectMenuBuilder()
      .setCustomId('test-menu')
      .setPlaceholder('Select an option')
      .addOption({ label: 'Option', value: 'option' })
      .setDisabled(true)
      .setHandler(async () => {});
    
    expect((builder as any)._disabled).toBe(true);
    
    const json = builder.toJSON();
    expect(json.disabled).toBe(true);
  });
  
  it('should add multiple options', () => {
    const options = [
      { label: 'Option 1', value: 'value1', description: 'Description 1' },
      { label: 'Option 2', value: 'value2', description: 'Description 2' },
      { label: 'Option 3', value: 'value3', description: 'Description 3' }
    ];
    
    const builder = new SelectMenuBuilder()
      .setCustomId('test-menu')
      .setPlaceholder('Select an option')
      .addOptions(options)
      .setHandler(async () => {});
    
    expect((builder as any)._options.length).toBe(3);
    
    const json = builder.toJSON();
    expect(json.options.length).toBe(3);
    
    for (let i = 0; i < options.length; i++) {
      expect(json.options[i].label).toBe(options[i].label);
      expect(json.options[i].value).toBe(options[i].value);
      expect(json.options[i].description).toBe(options[i].description);
    }
  });
  
  it('should add a single option with emoji and default state', () => {
    const builder = new SelectMenuBuilder()
      .setCustomId('test-menu')
      .setPlaceholder('Select an option')
      .addOption({
        label: 'Option with emoji',
        value: 'option-emoji',
        description: 'This option has an emoji',
        emoji: '👍',
        default: true
      })
      .setHandler(async () => {});
    
    expect((builder as any)._options.length).toBe(1);
    
    const option = (builder as any)._options[0];
    expect(option.label).toBe('Option with emoji');
    expect(option.value).toBe('option-emoji');
    expect(option.emoji).toBe('👍');
    expect(option.default).toBe(true);
    
    const json = builder.toJSON();
    const jsonOption = json.options[0];
    expect(jsonOption.label).toBe('Option with emoji');
    expect(jsonOption.emoji).toEqual({ name: '👍' });
    expect(jsonOption.default).toBe(true);
  });
  
  it('should throw if required fields are missing', () => {
    const noCustomIdMenu = new SelectMenuBuilder()
      .setPlaceholder('Select an option')
      .addOption({ label: 'Option', value: 'option' })
      .setHandler(async () => {});
    
    expect(() => noCustomIdMenu.build()).toThrow('Custom ID is required for select menus');
    
    const noOptionsMenu = new SelectMenuBuilder()
      .setCustomId('test-menu')
      .setPlaceholder('Select an option')
      .setHandler(async () => {});
    
    expect(() => noOptionsMenu.build()).toThrow('Select menu must have at least one option');
    
    const noHandlerMenu = new SelectMenuBuilder()
      .setCustomId('test-menu')
      .setPlaceholder('Select an option')
      .addOption({ label: 'Option', value: 'option' });
    
    expect(() => noHandlerMenu.build()).toThrow('Handler is required for select menus');
  });
  
  it('should properly format for the Discord API', () => {
    const builder = new SelectMenuBuilder()
      .setCustomId('test-menu')
      .setPlaceholder('Select an option')
      .addOption({
        label: 'Option 1',
        value: 'option1',
        description: 'First option'
      })
      .addOption({
        label: 'Option 2',
        value: 'option2',
        description: 'Second option',
        emoji: '🔥'
      })
      .setMinValues(1)
      .setMaxValues(2)
      .setDisabled(false)
      .setHandler(async () => {});
    
    const json = builder.toJSON();
    
    expect(json.type).toBe(3);
    expect(json.custom_id).toBe('test-menu');
    expect(json.placeholder).toBe('Select an option');
    expect(json.min_values).toBe(1);
    expect(json.max_values).toBe(2);
    expect(json.disabled).toBe(false);
    expect(json.options.length).toBe(2);
    
    expect(json.options[0].label).toBe('Option 1');
    expect(json.options[0].value).toBe('option1');
    expect(json.options[0].description).toBe('First option');
    
    expect(json.options[1].label).toBe('Option 2');
    expect(json.options[1].value).toBe('option2');
    expect(json.options[1].description).toBe('Second option');
    expect(json.options[1].emoji).toEqual({ name: '🔥' });
  });
}); 