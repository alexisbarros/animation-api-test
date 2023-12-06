"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pascalToCamel = exports.kebabToCamel = void 0;
const kebabToCamel = (inputString) => {
    return inputString.replace(/-([a-z])/g, function (match, letter) {
        return letter.toUpperCase();
    });
};
exports.kebabToCamel = kebabToCamel;
const pascalToCamel = (inputString) => {
    return inputString[0].toLowerCase() + inputString.slice(1);
};
exports.pascalToCamel = pascalToCamel;
