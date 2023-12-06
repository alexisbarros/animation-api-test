import {HttpErrors} from '@loopback/rest';
import mongoose from 'mongoose';
import {toMongooseSchema} from '../boilerplate/services/mongoose.service';
import databaseConnection from '../database-connection';

import * as _entity from '../entities';
import * as _interface from '../interfaces';
import * as _model from '../models';

const CharacterSchema = new mongoose.Schema(
  toMongooseSchema(_entity.character.schema),
  {
    timestamps: {
      createdAt: '_createdAt',
      updatedAt: '_updatedAt',
    },
  },
);
export const CharacterModel = databaseConnection.model(
  'Character',
  CharacterSchema,
  'Character',
);

export class CharacterRepository implements _interface.ICharacterRepository {
  async create(data: _interface.ICharacter): Promise<void> {
    await CharacterModel.create(data);
  }

  async find(
    filters: any,
    limit: number,
    page: number,
  ): Promise<_interface.ICharacter[]> {
    return (
      await CharacterModel.find({
        ...filters,
        _deletedAt: null,
      })
        .populate({path: 'animationId'})
        .skip(page * limit)
        .limit(limit)
    ).map((data: any) => new _model.Character(data));
  }

  async count(filters: any): Promise<number> {
    return await CharacterModel.countDocuments({
      ...filters,
      _deletedAt: null,
    });
  }

  async findById(id: string): Promise<_interface.ICharacter> {
    const data = await CharacterModel.findOne({_id: id, _deletedAt: null})
      .populate({path: 'animationId'})
      .orFail(new HttpErrors[404]('Character not found'));

    return new _model.Character(data);
  }

  async updateById(
    id: string,
    data: _interface.ICharacter,
  ): Promise<_interface.ICharacter> {
    const dataUpdated = await CharacterModel.findByIdAndUpdate(id, data)
      .populate({path: 'animationId'})
      .orFail(new HttpErrors[404]('Character not found'));

    return new _model.Character(dataUpdated);
  }

  async replaceById(
    id: string,
    data: _interface.ICharacter,
  ): Promise<_interface.ICharacter> {
    const dataUpdated = await CharacterModel.findOneAndReplace(
      {_id: id},
      data,
      {new: true},
    )
      .populate({path: 'animationId'})
      .orFail(new HttpErrors[404]('Character not found'));

    return new _model.Character(dataUpdated);
  }

  async deleteById(id: string): Promise<void> {
    await CharacterModel.findByIdAndUpdate(id, {_deletedAt: Date.now()}).orFail(
      new HttpErrors[404]('Character not found'),
    );
  }
}
