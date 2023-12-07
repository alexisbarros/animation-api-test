import * as _model from '.';
import * as _interface from '../interfaces';

export class Character {
  _id?: String;
  name?: String;
  personGender?: String;
  characterType?: String;
  animationId?: _interface.IAnimation | String;
  _deletedAt?: Number;

  constructor(data: any) {
    this._id = data._id;
    this.name = data.name;
    this.personGender = data.personGender;
    this.characterType = data.characterType;
    this.animationId =
      data.animationId && typeof data.animationId === 'object'
        ? new _model.Animation(data.animationId)
        : data.animationId;
    this._deletedAt = data._deletedAt;
  }
}
