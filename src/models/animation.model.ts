
import * as _model from '.';
import * as _interface from '../interfaces';

export class Animation {
  name: String;description?: String;startDate?: Number;finishDate?: Number;_deletedAt?: Number;
  
  constructor(data: any) {
    this.name = data.name;this.description = data.description;this.startDate = data.startDate;this.finishDate = data.finishDate;this._deletedAt = data._deletedAt;
  }
}
  