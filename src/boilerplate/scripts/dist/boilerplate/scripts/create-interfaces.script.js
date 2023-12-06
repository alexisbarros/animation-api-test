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
const _entity = __importStar(require("../../entities"));
const fs = __importStar(require("fs"));
const text_transformation_util_1 = require("../utils/text-transformation.util");
const getInterfaceCode = (entity) => {
    return `
import * as _model from '../models';

export interface I${entity.name} extends _model.${entity.name} {};

export interface I${entity.name}Repository {
  create(data: I${entity.name}): Promise<void>
  find(filters: any, limit?: number, page?: number): Promise<I${entity.name}[]>
  count(filters: any): Promise<number>
  findById(id: string): Promise<I${entity.name}>
  updateById(id: string, data: Partial<I${entity.name}>): Promise<I${entity.name}>
  replaceById(id: string, data: I${entity.name}): Promise<I${entity.name}>
  deleteById(id: string): Promise<void>
}
  `;
};
const createInterface = (entity, filename) => {
    const code = getInterfaceCode(entity);
    fs.writeFileSync(`${__dirname}/../../../../../interfaces/${filename}.interface.ts`, code, {
        flag: "w",
    });
};
(() => {
    fs.writeFileSync(`${__dirname}/../../../../../interfaces/index.ts`, "", {
        flag: "w",
    });
    const entityFiles = fs.readdirSync(`${__dirname}/../../entities`);
    for (const file of entityFiles) {
        const filename = file.split(".")[0];
        const entity = (0, text_transformation_util_1.kebabToCamel)(filename);
        if (entity === "index")
            continue;
        createInterface(_entity[entity], filename);
        const indexContent = fs
            .readFileSync(`${__dirname}/../../../../../interfaces/index.ts`)
            .toString();
        fs.writeFileSync(`${__dirname}/../../../../../interfaces/index.ts`, `${indexContent} export * from './${filename}.interface';`);
    }
})();
