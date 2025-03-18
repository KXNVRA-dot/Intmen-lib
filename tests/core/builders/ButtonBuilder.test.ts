import { ButtonBuilder } from '../../../src/core/builders/ButtonBuilder';
import { ButtonStyle, InteractionType } from '../../../src/types';

describe('ButtonBuilder', () => {
  it('should create a primary button with label', () => {
    const customId = 'test-button';
    const label = 'Click Me';
    const handler = async () => {};
    
    const button = new ButtonBuilder()
      .setCustomId(customId)
      .setLabel(label)
      .setStyle(ButtonStyle.PRIMARY)
      .setHandler(handler);
    
    expect((button as any)._customId).toBe(customId);
    expect((button as any)._label).toBe(label);
    expect((button as any)._style).toBe(ButtonStyle.PRIMARY);
    expect((button as any)._handler).toBe(handler);
    
    const built = button.build();
    expect(built.type).toBe(InteractionType.BUTTON);
    expect(built.id).toBe(customId);
    expect(built.handler).toBe(handler);
  });
  
  it('should create a button with emoji', () => {
    const button = new ButtonBuilder()
      .setCustomId('emoji-button')
      .setStyle(ButtonStyle.SUCCESS)
      .setEmoji('🚀')
      .setHandler(async () => {});
    
    expect((button as any)._emoji).toBe('🚀');
    
    const json = button.toJSON();
    expect(json.emoji).toEqual({ name: '🚀' });
  });
  
  it('should create a disabled button', () => {
    const button = new ButtonBuilder()
      .setCustomId('disabled-button')
      .setLabel('Cannot Click')
      .setStyle(ButtonStyle.SECONDARY)
      .setDisabled(true)
      .setHandler(async () => {});
    
    expect((button as any)._disabled).toBe(true);
    
    const json = button.toJSON();
    expect(json.disabled).toBe(true);
  });
  
  it('should create a link button without handler', () => {
    const url = 'https://example.com';
    const button = new ButtonBuilder()
      .setURL(url)
      .setLabel('Visit Website')
      .setStyle(ButtonStyle.LINK);
    
    expect((button as any)._url).toBe(url);
    expect((button as any)._style).toBe(ButtonStyle.LINK);
    
    expect(() => button.build()).not.toThrow();
    
    const json = button.toJSON();
    expect(json.type).toBe(2);
    expect(json.style).toBe(ButtonStyle.LINK);
    expect(json.url).toBe(url);
  });
  
  it('should throw if required fields are missing', () => {
    const noCustomIdButton = new ButtonBuilder()
      .setLabel('Missing ID')
      .setStyle(ButtonStyle.PRIMARY)
      .setHandler(async () => {});
    
    expect(() => noCustomIdButton.build()).toThrow('Custom ID is required for non-LINK buttons');
    
    const noHandlerButton = new ButtonBuilder()
      .setCustomId('test-button')
      .setLabel('No Handler')
      .setStyle(ButtonStyle.PRIMARY);
    
    expect(() => noHandlerButton.build()).toThrow('Handler is required for non-LINK buttons');
  });
}); 