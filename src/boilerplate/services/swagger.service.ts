import {RequestBodyObject, SchemaObject} from '@loopback/rest';
import * as _interface from '../interfaces';

const getSwaggerData = (
  schema: _interface.ISchema,
  isRequestSchema?: boolean,
) => {
  let swaggerResponse: any = {};
  for (const key in schema) {
    if (isRequestSchema && schema[key].ref) {
      schema[key].type = _interface.schemaAttributeTypeEnum.string;
    }

    if (schema[key].type === _interface.schemaAttributeTypeEnum.object) {
      swaggerResponse[key] = {
        type: 'object',
        properties: getSwaggerData(schema[key].properties!),
      };
      continue;
    }

    if (schema[key].type === _interface.schemaAttributeTypeEnum.array) {
      swaggerResponse[key] = {
        type: 'array',
        items: {
          type: !schema[key].properties
            ? _interface.schemaAttributeTypeEnum.string
            : _interface.schemaAttributeTypeEnum.object,
          ...(schema[key].properties
            ? {
                properties: getSwaggerData(
                  schema[key].properties!,
                  isRequestSchema,
                ),
              }
            : {}),
        },
      };
      continue;
    }

    swaggerResponse[key] = {type: schema[key].type};
  }

  return swaggerResponse;
};

export const toSwaggerResponse = (
  props: _interface.ISwaggerResponseProps,
): SchemaObject => {
  const schemaToTreat = props.schema ?? {};
  for (const attribute of props.deletedAttributes ?? []) {
    delete schemaToTreat[attribute];
  }

  const data = props.schema
    ? getSwaggerData({
        _id: {type: _interface.schemaAttributeTypeEnum.string},
        ...schemaToTreat,
      })
    : null;

  const schema = props.isArray
    ? {
        type: 'object',
        properties: {
          result: {
            type: 'array',
            items: {
              type: 'object',
              properties: data,
            },
          },
          total: {type: 'number'},
          page: {type: 'number'},
        },
      }
    : {
        type: 'object',
        properties: {
          statusCode: {type: 'number'},
          data: {
            type: 'object',
            properties: data,
          },
          message: {type: 'string'},
        },
      };

  return {content: {'application/json': {schema}}};
};

export const toSwaggerRequest = (
  props: _interface.ISwaggerRequestProps,
): Partial<RequestBodyObject> => {
  const schemaToTreat = props.schema ?? {};
  for (const attribute of props.deletedAttributes ?? []) {
    delete schemaToTreat[attribute];
  }

  const data = getSwaggerData(schemaToTreat, true);

  return {
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: data,
        },
      },
    },
  };
};
