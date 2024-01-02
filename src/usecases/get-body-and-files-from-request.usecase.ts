import {Request, Response} from '@loopback/rest';
import multer from 'multer';

export interface IRequestBodyAndFile {
  body: any;
  files: any;
}

export class GetBodyAndFilesFromRequest {
  public async execute(
    request: Request,
    response: Response,
  ): Promise<IRequestBodyAndFile> {
    const storage = multer.memoryStorage();
    const upload = multer({storage});

    return new Promise((resolve, reject) => {
      return upload.any()(request, response, async (err: unknown) => {
        if (err) reject(err);
        else {
          resolve({
            body: request.body,
            files: request.files,
          });
        }
      });
    });
  }
}
