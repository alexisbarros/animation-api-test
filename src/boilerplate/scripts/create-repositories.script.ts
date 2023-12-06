import * as _interface from "../interfaces";
import * as _entity from "../../entities";
import * as fs from "fs";
import { kebabToCamel, pascalToCamel } from "../utils/text-transformation.util";

const getPopulateCode = (schema: _interface.ISchema) => {
  const getPopulatePathCode = (
    fieldname: string,
    attribute: _interface.ISchemaAttribute
  ): string => {
    if (attribute.ref) {
      return `path: '${fieldname}'`;
    }

    return ``;
  };

  let populateCode = ``;
  for (const key in schema) {
    const populatePath = getPopulatePathCode(key, schema[key]);
    if (populatePath) populateCode += `.populate({ ${populatePath} })`;
  }

  return populateCode;
};

const getRepositoryCode = (entity: _interface.IEntity): string => {
  return `
import {HttpErrors} from '@loopback/rest';
import mongoose from 'mongoose';
import databaseConnection from '../database-connection';
import {toMongooseSchema} from '../boilerplate/services/mongoose.service';

import * as _model from '../models';
import * as _interface from '../interfaces';
import * as _entity from '../entities';

const ${entity.name}Schema = new mongoose.Schema(
  toMongooseSchema(_entity.${pascalToCamel(entity.name)}.schema),
  {
    timestamps: {
      createdAt: '_createdAt',
      updatedAt: '_updatedAt',
    }
  }
);
export const ${entity.name}Model = databaseConnection.model(
  '${entity.name}', 
  ${entity.name}Schema, 
  '${entity.name}'
);

export class ${entity.name}Repository implements _interface.I${
    entity.name
  }Repository {

  async create(data:_interface.I${entity.name}): Promise<void> {
    await ${entity.name}Model.create(data);
  }

  async find(
    filters: any, 
    limit: number, 
    page: number
  ): Promise<_interface.I${entity.name}[]> {
    return (await ${entity.name}Model
      .find({
        ...filters,
        _deletedAt: null,
      })
      ${getPopulateCode(entity.schema)}
      .skip(page * limit)
      .limit(limit))
      .map((data: any) => new _model.${entity.name}(data));
  }

  async count(filters: any): Promise<number> {
    return await ${entity.name}Model.find({
      ...filters,
      _deletedAt: null,
    })
      .count({
        ...filters,
        _deletedAt: null,
      });
  }

  async findById(id: string): Promise<_interface.I${entity.name}> {
    const data = await ${entity.name}Model
      .findOne({_id: id, _deletedAt: null})
      ${getPopulateCode(entity.schema)}
      .orFail(new HttpErrors[404]('${entity.name} not found'));

    return new _model.${entity.name}(data);
  }

  async updateById(
    id: string, 
    data:_interface.I${entity.name}
  ): Promise<_interface.I${entity.name}> {
    const dataUpdated = await ${entity.name}Model
      .findByIdAndUpdate(id, data)
      ${getPopulateCode(entity.schema)}
      .orFail(new HttpErrors[404]('${entity.name} not found'));

    return new _model.${entity.name}(dataUpdated);
  }

  async replaceById(
    id: string, 
    data:_interface.I${entity.name},
  ): Promise<_interface.I${entity.name}> {
    const dataUpdated = await ${entity.name}Model
      .findOneAndReplace({_id: id}, data, {new: true})
      ${getPopulateCode(entity.schema)}
      .orFail(new HttpErrors[404]('${entity.name} not found'));

    return new _model.${entity.name}(dataUpdated);
  }

  async deleteById(id: string): Promise<void> {
    await ${entity.name}Model
      .findByIdAndUpdate(id, {_deletedAt: Date.now()})
      .orFail(new HttpErrors[404]('${entity.name} not found'));
  }

}
  `;
};

const createRepository = (
  entity: _interface.IEntity,
  filename: string
): void => {
  const code = getRepositoryCode(entity);

  fs.writeFileSync(
    `${__dirname}/../../../../../repositories/${filename}.repository.ts`,
    code,
    {
      flag: "w",
    }
  );
};

const createDatabaseConnectionFile = () => {
  fs.writeFileSync(
    `${__dirname}/../../../../../database-connection.ts`,
    `
import mongoose from 'mongoose';

require('dotenv').config();
const databaseConnection = mongoose.createConnection(process.env.MONGO_URL!);

export default databaseConnection;
    `,
    {
      flag: "w",
    }
  );
};

(() => {
  createDatabaseConnectionFile();

  fs.writeFileSync(`${__dirname}/../../../../../repositories/index.ts`, "", {
    flag: "w",
  });

  const entityFiles = fs.readdirSync(`${__dirname}/../../entities`);

  for (const file of entityFiles) {
    const filename: string = file.split(".")[0];
    const entity: string = kebabToCamel(filename);
    if (entity === "index") continue;

    createRepository((_entity as any)[entity], filename);

    const indexContent = fs
      .readFileSync(`${__dirname}/../../../../../repositories/index.ts`)
      .toString();
    fs.writeFileSync(
      `${__dirname}/../../../../../repositories/index.ts`,
      `${indexContent} export * from './${filename}.repository';`
    );
  }
})();
