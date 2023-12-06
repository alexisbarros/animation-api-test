export enum schemaAttributeTypeEnum {
  string = "string",
  number = "number",
  boolean = "boolean",
  object = "object",
  array = "array",
}

export interface ISchemaAttribute {
  type: schemaAttributeTypeEnum;
  required?: boolean;
  ref?: string; // mongoose model reference
  properties?: ISchema; // to array and object type use
  default?: any;
}

export interface ISchema {
  [x: string]: ISchemaAttribute;
}

export interface IEntity {
  schema: ISchema;
  name: string;
  route: string;
  persistentEntity?: boolean;
}
