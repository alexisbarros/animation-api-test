import mongoose from 'mongoose';
import * as _interface from '../interfaces';

export const toMongooseSchema = (schema: _interface.ISchema) => {
  let mongooseSchema: any = {};

  for (const key in schema) {
    if (key === '_id') continue;

    if (
      schema[key].ref &&
      schema[key].type === _interface.schemaAttributeTypeEnum.array
    ) {
      mongooseSchema[key] = [
        {
          type: mongoose.Types.ObjectId,
          ref: schema[key].ref,
        },
      ];
      continue;
    }

    if (schema[key].ref) {
      mongooseSchema[key] = {
        type: mongoose.Types.ObjectId,
        ref: schema[key].ref,
      };
      continue;
    }

    if (schema[key].type === _interface.schemaAttributeTypeEnum.object) {
      mongooseSchema[key] = toMongooseSchema(schema[key].properties!);
      continue;
    }

    if (schema[key].type === _interface.schemaAttributeTypeEnum.array) {
      mongooseSchema[key] = [
        schema[key].properties
          ? toMongooseSchema(schema[key].properties!)
          : String,
      ];
      continue;
    }

    mongooseSchema[key] = schema[key];
  }

  return mongooseSchema;
};
