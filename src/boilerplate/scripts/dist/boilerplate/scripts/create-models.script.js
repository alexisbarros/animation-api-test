"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const _interface = __importStar(require("../interfaces"));
const _entity = __importStar(require("../../entities"));
const fs = __importStar(require("fs"));
const text_transformation_util_1 = require("../utils/text-transformation.util");
const getModelCode = (entity) => {
    let attributesCode = ``;
    let constructorCode = ``;
    for (const key in entity.schema) {
        const isRequired = entity.schema[key].required ? true : false;
        if (entity.schema[key].type === _interface.schemaAttributeTypeEnum.string) {
            attributesCode += `${key}${isRequired ? "" : "?"}: String;`;
            constructorCode += `this.${key} = data.${key};`;
        }
        if (entity.schema[key].type === _interface.schemaAttributeTypeEnum.number) {
            attributesCode += `${key}${isRequired ? "" : "?"}: Number;`;
            constructorCode += `this.${key} = data.${key};`;
        }
        if (entity.schema[key].type === _interface.schemaAttributeTypeEnum.boolean) {
            attributesCode += `${key}${isRequired ? "" : "?"}: Boolean;`;
            constructorCode += `this.${key} = data.${key};`;
        }
        if (entity.schema[key].type === _interface.schemaAttributeTypeEnum.object &&
            entity.schema[key].ref) {
            attributesCode += `${key}${isRequired ? "" : "?"}: _interface.I${entity.schema[key].ref} | String;`;
            constructorCode += `this.${key} = data.${key} && typeof data.${key} === 'object' ? 
        new _model.${entity.schema[key].ref}(data.${key}) : data.${key};`;
        }
        if (entity.schema[key].type === _interface.schemaAttributeTypeEnum.object &&
            !entity.schema[key].ref) {
            attributesCode += `${key}${isRequired ? "" : "?"}: any;`;
            constructorCode += `this.${key} = data.${key};`;
        }
        if (entity.schema[key].type === _interface.schemaAttributeTypeEnum.array &&
            entity.schema[key].ref) {
            attributesCode += `${key}${isRequired ? "" : "?"}: _interface.I${entity.schema[key].ref}[] | String[];`;
            constructorCode += `this.${key} = (data.${key} ?? [])
      .map((el: any) => 
        el && typeof el === 'object' ? 
          new _model.${entity.schema[key].ref}(el) : el
      );
      `;
        }
        if (entity.schema[key].type === _interface.schemaAttributeTypeEnum.array &&
            !entity.schema[key].ref) {
            attributesCode += `${key}${isRequired ? "" : "?"}: any[];`;
            constructorCode += `this.${key} = data.${key};`;
        }
    }
    return `
import * as _model from '.';
import * as _interface from '../interfaces';

export class ${entity.name} {
  ${attributesCode}
  
  constructor(data: any) {
    ${constructorCode}
  }
}
  `;
};
const createModel = (entity, filename) => {
    const code = getModelCode(entity);
    fs.writeFileSync(`${__dirname}/../../../../../models/${filename}.model.ts`, code, {
        flag: "w",
    });
};
(() => {
    fs.writeFileSync(`${__dirname}/../../../../../models/index.ts`, "", {
        flag: "w",
    });
    const entityFiles = fs.readdirSync(`${__dirname}/../../entities`);
    for (const file of entityFiles) {
        const filename = file.split(".")[0];
        const entity = (0, text_transformation_util_1.kebabToCamel)(filename);
        if (entity === "index")
            continue;
        createModel(_entity[entity], filename);
        const indexContent = fs
            .readFileSync(`${__dirname}/../../../../../models/index.ts`)
            .toString();
        fs.writeFileSync(`${__dirname}/../../../../../models/index.ts`, `${indexContent} export * from './${filename}.model';`);
    }
})();
