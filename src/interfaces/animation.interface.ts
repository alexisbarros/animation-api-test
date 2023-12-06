
import * as _model from '../models';

export interface IAnimation extends _model.Animation {};

export interface IAnimationRepository {
  create(data: IAnimation): Promise<void>
  find(filters: any, limit?: number, page?: number): Promise<IAnimation[]>
  count(filters: any): Promise<number>
  findById(id: string): Promise<IAnimation>
  updateById(id: string, data: Partial<IAnimation>): Promise<IAnimation>
  replaceById(id: string, data: IAnimation): Promise<IAnimation>
  deleteById(id: string): Promise<void>
}
  