import * as _interface from "../interfaces";
import * as _entity from "../../entities";
import * as fs from "fs";
import { kebabToCamel } from "../utils/text-transformation.util";

const getInterfaceCode = (entity: _interface.IEntity): string => {
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

const createInterface = (
  entity: _interface.IEntity,
  filename: string
): void => {
  const code = getInterfaceCode(entity);

  fs.writeFileSync(
    `${__dirname}/../../../../../interfaces/${filename}.interface.ts`,
    code,
    {
      flag: "w",
    }
  );
};

(() => {
  fs.writeFileSync(`${__dirname}/../../../../../interfaces/index.ts`, "", {
    flag: "w",
  });

  const entityFiles = fs.readdirSync(`${__dirname}/../../entities`);

  for (const file of entityFiles) {
    const filename: string = file.split(".")[0];
    const entity: string = kebabToCamel(filename);
    if (entity === "index") continue;

    createInterface((_entity as any)[entity], filename);

    const indexContent = fs
      .readFileSync(`${__dirname}/../../../../../interfaces/index.ts`)
      .toString();
    fs.writeFileSync(
      `${__dirname}/../../../../../interfaces/index.ts`,
      `${indexContent} export * from './${filename}.interface';`
    );
  }
})();
