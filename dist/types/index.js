"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ButtonStyle = exports.InteractionType = void 0;
/**
 * Interaction types
 */
var InteractionType;
(function (InteractionType) {
    InteractionType["COMMAND"] = "command";
    InteractionType["BUTTON"] = "button";
    InteractionType["SELECT_MENU"] = "selectMenu";
    InteractionType["MODAL"] = "modal";
    InteractionType["CONTEXT_MENU"] = "contextMenu";
    InteractionType["AUTOCOMPLETE"] = "autocomplete";
})(InteractionType || (exports.InteractionType = InteractionType = {}));
/**
 * Type for possible button styles
 */
var ButtonStyle;
(function (ButtonStyle) {
    ButtonStyle[ButtonStyle["PRIMARY"] = 1] = "PRIMARY";
    ButtonStyle[ButtonStyle["SECONDARY"] = 2] = "SECONDARY";
    ButtonStyle[ButtonStyle["SUCCESS"] = 3] = "SUCCESS";
    ButtonStyle[ButtonStyle["DANGER"] = 4] = "DANGER";
    ButtonStyle[ButtonStyle["LINK"] = 5] = "LINK";
})(ButtonStyle || (exports.ButtonStyle = ButtonStyle = {}));
