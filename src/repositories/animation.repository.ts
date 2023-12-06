import {HttpErrors} from '@loopback/rest';
import mongoose from 'mongoose';
import {toMongooseSchema} from '../boilerplate/services/mongoose.service';
import databaseConnection from '../database-connection';

import * as _entity from '../entities';
import * as _interface from '../interfaces';
import * as _model from '../models';

const AnimationSchema = new mongoose.Schema(
  toMongooseSchema(_entity.animation.schema),
  {
    timestamps: {
      createdAt: '_createdAt',
      updatedAt: '_updatedAt',
    },
  },
);
export const AnimationModel = databaseConnection.model(
  'Animation',
  AnimationSchema,
  'Animation',
);

export class AnimationRepository implements _interface.IAnimationRepository {
  async create(data: _interface.IAnimation): Promise<void> {
    await AnimationModel.create(data);
  }

  async find(
    filters: any,
    limit: number,
    page: number,
  ): Promise<_interface.IAnimation[]> {
    return (
      await AnimationModel.find({
        ...filters,
        _deletedAt: null,
      })

        .skip(page * limit)
        .limit(limit)
    ).map((data: any) => new _model.Animation(data));
  }

  async count(filters: any): Promise<number> {
    return await AnimationModel.countDocuments({
      ...filters,
      _deletedAt: null,
    });
  }

  async findById(id: string): Promise<_interface.IAnimation> {
    const data = await AnimationModel.findOne({
      _id: id,
      _deletedAt: null,
    }).orFail(new HttpErrors[404]('Animation not found'));

    return new _model.Animation(data);
  }

  async updateById(
    id: string,
    data: _interface.IAnimation,
  ): Promise<_interface.IAnimation> {
    const dataUpdated = await AnimationModel.findByIdAndUpdate(id, data).orFail(
      new HttpErrors[404]('Animation not found'),
    );

    return new _model.Animation(dataUpdated);
  }

  async replaceById(
    id: string,
    data: _interface.IAnimation,
  ): Promise<_interface.IAnimation> {
    const dataUpdated = await AnimationModel.findOneAndReplace(
      {_id: id},
      data,
      {new: true},
    ).orFail(new HttpErrors[404]('Animation not found'));

    return new _model.Animation(dataUpdated);
  }

  async deleteById(id: string): Promise<void> {
    await AnimationModel.findByIdAndUpdate(id, {_deletedAt: Date.now()}).orFail(
      new HttpErrors[404]('Animation not found'),
    );
  }
}
