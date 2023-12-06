import * as _interface from "../interfaces";
import * as _entity from "../../entities";
import * as fs from "fs";
import { kebabToCamel } from "../utils/text-transformation.util";

const getModelCode = (entity: _interface.IEntity): string => {
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

    if (
      entity.schema[key].type === _interface.schemaAttributeTypeEnum.boolean
    ) {
      attributesCode += `${key}${isRequired ? "" : "?"}: Boolean;`;
      constructorCode += `this.${key} = data.${key};`;
    }

    if (
      entity.schema[key].type === _interface.schemaAttributeTypeEnum.object &&
      entity.schema[key].ref
    ) {
      attributesCode += `${key}${isRequired ? "" : "?"}: _interface.I${
        entity.schema[key].ref
      } | String;`;
      constructorCode += `this.${key} = data.${key} && typeof data.${key} === 'object' ? 
        new _model.${entity.schema[key].ref}(data.${key}) : data.${key};`;
    }

    if (
      entity.schema[key].type === _interface.schemaAttributeTypeEnum.object &&
      !entity.schema[key].ref
    ) {
      attributesCode += `${key}${isRequired ? "" : "?"}: any;`;
      constructorCode += `this.${key} = data.${key};`;
    }

    if (
      entity.schema[key].type === _interface.schemaAttributeTypeEnum.array &&
      entity.schema[key].ref
    ) {
      attributesCode += `${key}${isRequired ? "" : "?"}: _interface.I${
        entity.schema[key].ref
      }[] | String[];`;
      constructorCode += `this.${key} = (data.${key} ?? [])
      .map((el: any) => 
        el && typeof el === 'object' ? 
          new _model.${entity.schema[key].ref}(el) : el
      );
      `;
    }

    if (
      entity.schema[key].type === _interface.schemaAttributeTypeEnum.array &&
      !entity.schema[key].ref
    ) {
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

const createModel = (entity: _interface.IEntity, filename: string): void => {
  const code = getModelCode(entity);

  fs.writeFileSync(
    `${__dirname}/../../../../../models/${filename}.model.ts`,
    code,
    {
      flag: "w",
    }
  );
};

(() => {
  fs.writeFileSync(`${__dirname}/../../../../../models/index.ts`, "", {
    flag: "w",
  });

  const entityFiles = fs.readdirSync(`${__dirname}/../../entities`);

  for (const file of entityFiles) {
    const filename: string = file.split(".")[0];
    const entity: string = kebabToCamel(filename);
    if (entity === "index") continue;

    createModel((_entity as any)[entity], filename);

    const indexContent = fs
      .readFileSync(`${__dirname}/../../../../../models/index.ts`)
      .toString();
    fs.writeFileSync(
      `${__dirname}/../../../../../models/index.ts`,
      `${indexContent} export * from './${filename}.model';`
    );
  }
})();
