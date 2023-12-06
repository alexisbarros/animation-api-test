import * as _interface from '../boilerplate/interfaces';

export const character: _interface.IEntity = {
  schema: {
    name: {type: _interface.schemaAttributeTypeEnum.string},
    sex: {type: _interface.schemaAttributeTypeEnum.string},
    characterType: {type: _interface.schemaAttributeTypeEnum.string},
    animationId: {
      type: _interface.schemaAttributeTypeEnum.object,
      ref: 'Animation',
      properties: {
        name: {type: _interface.schemaAttributeTypeEnum.string, required: true},
        description: {type: _interface.schemaAttributeTypeEnum.string},
        startDate: {type: _interface.schemaAttributeTypeEnum.number},
        finishDate: {type: _interface.schemaAttributeTypeEnum.number},
      },
    },
    _deletedAt: {
      type: _interface.schemaAttributeTypeEnum.number,
    },
  },
  name: 'Character',
  route: 'characters',
};
