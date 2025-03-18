import { ModalBuilder } from '../../../src/core/builders/ModalBuilder';
import { InteractionType } from '../../../src/types';
import { TextInputStyle } from 'discord.js';

let ModalInputStyle: { PARAGRAPH: number; SHORT: number } | undefined;
try {
  ModalInputStyle = (ModalBuilder as any).ModalInputStyle;
} catch (e) {
}

describe('ModalBuilder', () => {
  it('should create a modal with basic properties', () => {
    const customId = 'test-modal';
    const title = 'Test Modal';
    const handler = async () => {};
    
    const modal = new ModalBuilder()
      .setCustomId(customId)
      .setTitle(title)
      .addShortTextInput('input-1', 'Test Input')
      .setHandler(handler);
    
    expect((modal as any)._customId).toBe(customId);
    expect((modal as any)._title).toBe(title);
    expect((modal as any)._handler).toBe(handler);
    expect((modal as any)._components.length).toBe(1);
    
    const built = modal.build();
    expect(built.type).toBe(InteractionType.MODAL);
    expect(built.id).toBe(customId);
    expect(built.handler).toBe(handler);
  });
  
  it('should add short text input components', () => {
    const modal = new ModalBuilder()
      .setCustomId('test-short-input')
      .setTitle('Short Input Test')
      .addShortTextInput('short-input', 'Short input field', { 
        placeholder: 'Enter text here',
        minLength: 3,
        maxLength: 50 
      })
      .setHandler(async () => {});
    
    const components = (modal as any)._components;
    expect(components.length).toBe(1);
    
    const input = components[0];
    expect(input.customId).toBe('short-input');
    expect(input.label).toBe('Short input field');
    expect(input.style).toBe(TextInputStyle.Short);
    expect(input.placeholder).toBe('Enter text here');
    expect(input.minLength).toBe(3);
    expect(input.maxLength).toBe(50);
    expect(input.required).toBe(true);
    
    const json = modal.toJSON();
    expect(json.custom_id).toBe('test-short-input');
    expect(json.title).toBe('Short Input Test');
    expect(json.components.length).toBe(1);
    
    const jsonComponent = json.components[0];
    expect(jsonComponent.type).toBe(1);
    expect(jsonComponent.components.length).toBe(1);
    
    const jsonInput = jsonComponent.components[0];
    expect(jsonInput.type).toBe(4);
    expect(jsonInput.custom_id).toBe('short-input');
    expect(jsonInput.label).toBe('Short input field');
    expect(jsonInput.style).toBe(TextInputStyle.Short);
    expect(jsonInput.min_length).toBe(3);
    expect(jsonInput.max_length).toBe(50);
  });
  
  it('should add paragraph text input components', () => {
    const modal = new ModalBuilder()
      .setCustomId('test-paragraph-input')
      .setTitle('Paragraph Input Test')
      .addParagraphTextInput('paragraph-input', 'Paragraph input field', { 
        placeholder: 'Enter longer text here',
        value: 'Default value',
        required: false
      })
      .setHandler(async () => {});
    
    const components = (modal as any)._components;
    expect(components.length).toBe(1);
    
    const input = components[0];
    expect(input.customId).toBe('paragraph-input');
    expect(input.label).toBe('Paragraph input field');
    expect(input.style).toBe(TextInputStyle.Paragraph);
    expect(input.placeholder).toBe('Enter longer text here');
    expect(input.value).toBe('Default value');
    expect(input.required).toBe(false);
    
    const json = modal.toJSON();
    
    const jsonInput = json.components[0].components[0];
    expect(jsonInput.style).toBe(TextInputStyle.Paragraph);
    expect(jsonInput.value).toBe('Default value');
    expect(jsonInput.required).toBe(false);
  });
  
  it('should support adding multiple components', () => {
    const modal = new ModalBuilder()
      .setCustomId('test-multiple-inputs')
      .setTitle('Multiple Inputs')
      .addShortTextInput('input1', 'First field')
      .addParagraphTextInput('input2', 'Second field')
      .addShortTextInput('input3', 'Third field')
      .setHandler(async () => {});
    
    const components = (modal as any)._components;
    expect(components.length).toBe(3);
    
    const json = modal.toJSON();
    expect(json.components.length).toBe(3);
  });
  
  it('should throw if required fields are missing', () => {
    const noCustomIdModal = new ModalBuilder()
      .setTitle('Test Modal')
      .addShortTextInput('input', 'Input field')
      .setHandler(async () => {});
    
    expect(() => noCustomIdModal.build()).toThrow('Custom ID is required for modals');
    
    const noTitleModal = new ModalBuilder()
      .setCustomId('test-modal')
      .addShortTextInput('input', 'Input field')
      .setHandler(async () => {});
    
    expect(() => noTitleModal.build()).toThrow('Title is required for modals');
    
    const noComponentsModal = new ModalBuilder()
      .setCustomId('test-modal')
      .setTitle('Test Modal')
      .setHandler(async () => {});
    
    expect(() => noComponentsModal.build()).toThrow('Modal must have at least one component');
    
    const tooManyComponentsModal = new ModalBuilder()
      .setCustomId('test-modal')
      .setTitle('Test Modal')
      .addShortTextInput('input1', 'First field')
      .addShortTextInput('input2', 'Second field')
      .addShortTextInput('input3', 'Third field')
      .addShortTextInput('input4', 'Fourth field')
      .addShortTextInput('input5', 'Fifth field')
      .addShortTextInput('input6', 'Sixth field')
      .setHandler(async () => {});
    
    expect(() => tooManyComponentsModal.build()).toThrow('Modal cannot have more than 5 components');
    
    const noHandlerModal = new ModalBuilder()
      .setCustomId('test-modal')
      .setTitle('Test Modal')
      .addShortTextInput('input', 'Input field');
    
    expect(() => noHandlerModal.build()).toThrow('Handler is required for modals');
  });
  
  (ModalInputStyle ? it : it.skip)('should correctly use deprecated ModalInputStyle', () => {
    if (ModalInputStyle) {
      expect(ModalInputStyle.PARAGRAPH).toBe(TextInputStyle.Paragraph);
      expect(ModalInputStyle.SHORT).toBe(TextInputStyle.Short);
    }
  });
});