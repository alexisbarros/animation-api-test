import * as _interface from '../boilerplate/interfaces';

export const animation: _interface.IEntity = {
  name: 'Animation',
  schema: {
    name: {type: _interface.schemaAttributeTypeEnum.string, required: true},
    description: {type: _interface.schemaAttributeTypeEnum.string},
    startDate: {type: _interface.schemaAttributeTypeEnum.number},
    finishDate: {type: _interface.schemaAttributeTypeEnum.number},
    _deletedAt: {type: _interface.schemaAttributeTypeEnum.number},
  },
  route: 'animations',
};
