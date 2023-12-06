import * as _interface from ".";

export interface ISwaggerResponseProps {
  schema?: _interface.ISchema;
  isArray?: boolean;
  deletedAttributes?: string[];
}

export interface ISwaggerRequestProps {
  schema: _interface.ISchema;
  deletedAttributes?: string[];
}
