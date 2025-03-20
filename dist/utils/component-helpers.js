"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createActionRow = createActionRow;
exports.createActionRows = createActionRows;
/**
 * Create an action row containing message components for Discord interactions
 * @param components One or more components to include in the row
 * @returns An action row containing the given components
 */
function createActionRow(...components) {
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
function createActionRows(...componentRows) {
    return componentRows.map(components => createActionRow(...components));
}
