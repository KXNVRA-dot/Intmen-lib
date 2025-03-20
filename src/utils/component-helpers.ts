import { APIActionRowComponent, APIMessageActionRowComponent } from 'discord.js';

/**
 * Create an action row containing message components for Discord interactions
 * @param components One or more components to include in the row
 * @returns An action row containing the given components
 */
export function createActionRow(
  ...components: APIMessageActionRowComponent[]
): APIActionRowComponent<APIMessageActionRowComponent> {
  return {
    type: 1, // ActionRow type
    components,
  };
}

/**
 * Create multiple action rows, each containing the specified components
 * @param componentRows Arrays of components, where each array becomes one row
 * @returns Array of action rows
 */
export function createActionRows(
  ...componentRows: APIMessageActionRowComponent[][]
): APIActionRowComponent<APIMessageActionRowComponent>[] {
  return componentRows.map(components => createActionRow(...components));
}
