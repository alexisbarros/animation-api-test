export class Animation {
  _id?: String;
  name: String;
  description?: String;
  startDate?: Number | String;
  finishDate?: Number | String;
  _deletedAt?: Number;

  constructor(data: any) {
    this._id = data._id;
    this.name = data.name;
    this.description = data.description;
    this.startDate = data.startDate && new Date(data.startDate).toDateString();
    this.finishDate =
      data.startDate && new Date(data.finishDate).toDateString();
    this._deletedAt = data._deletedAt;
  }
}
