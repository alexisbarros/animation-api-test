import {Storage} from '@google-cloud/storage';
import {/* inject, */ BindingScope, injectable} from '@loopback/core';

@injectable({scope: BindingScope.TRANSIENT})
export class CloudStorageService {
  constructor(/* Add @inject to inject parameters */) {}

  private bucket = 'kunlatek_fundamento_storage';

  /*
   * Add service methods here
   */
  public async uploadFile({
    path,
    file,
  }: {
    path: string;
    file: any;
  }): Promise<string> {
    const storage = new Storage({keyFilename: 'storage-key.json'});
    try {
      const bucket = storage.bucket(this.bucket);
      const fileName = file.originalname;

      await bucket.file(`rapida-x/${path}/${fileName}`).save(file.buffer);

      const publicUrl = bucket.file(`rapida-x/${path}/${fileName}`).publicUrl();

      return publicUrl;
    } catch (error) {
      throw new Error(`${file} --> Upload file error: ${error.message}`);
    }
  }
}
