export class Animation {
  _id?: String;
  name: String;
  folderPicture?: String;
  description?: String;
  startDate?: Number | String;
  finishDate?: Number | String;
  _deletedAt?: Number;

  constructor(data: any) {
    this._id = data._id;
    this.name = data.name;
    this.folderPicture = data.folderPicture;
    this.description = data.description;
    this.startDate =
      data.startDate && new Date(data.startDate).toISOString().split('T')[0];
    this.finishDate =
      data.startDate && new Date(data.finishDate).toISOString().split('T')[0];
    this._deletedAt = data._deletedAt;
  }
}
