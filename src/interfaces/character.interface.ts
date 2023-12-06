
import * as _model from '../models';

export interface ICharacter extends _model.Character {};

export interface ICharacterRepository {
  create(data: ICharacter): Promise<void>
  find(filters: any, limit?: number, page?: number): Promise<ICharacter[]>
  count(filters: any): Promise<number>
  findById(id: string): Promise<ICharacter>
  updateById(id: string, data: Partial<ICharacter>): Promise<ICharacter>
  replaceById(id: string, data: ICharacter): Promise<ICharacter>
  deleteById(id: string): Promise<void>
}
  