import {inject, service} from '@loopback/core';
import {requestBody} from '@loopback/openapi-v3';
import {Request, Response, RestBindings, post, response} from '@loopback/rest';
import {toSwaggerResponse} from '../boilerplate/services';
import {
  IHttpResponse,
  badRequestErrorHttpResponse,
  okHttpResponse,
} from '../boilerplate/utils';
import {CloudStorageService} from '../services';
import {GetBodyAndFilesFromRequest} from '../usecases';

export class UploadFileController {
  constructor(
    @service(CloudStorageService) private storagesService: CloudStorageService,
    @inject(RestBindings.Http.REQUEST) private httpRequest?: Request,
    @inject(RestBindings.Http.RESPONSE) private httpResponse?: Response,
  ) {}

  @post('/upload-file')
  @response(200, toSwaggerResponse({}))
  async create(
    @requestBody({
      content: {
        'multipart/form-data': {'x-parser': 'stream'},
      },
    })
    data: any,
  ): Promise<IHttpResponse> {
    const bodyAndFile = await new GetBodyAndFilesFromRequest().execute(
      data,
      this.httpResponse!,
    );

    const path = bodyAndFile.body?.path;
    const file = bodyAndFile.files?.length && bodyAndFile.files[0];

    const url = await this.storagesService.uploadFile({path, file});

    try {
      return okHttpResponse({
        message: 'Upload successfuly',
        data: {url},
        request: this.httpRequest,
        response: this.httpResponse,
      });
    } catch (err) {
      return badRequestErrorHttpResponse({
        message: err.message,
        request: this.httpRequest,
        response: this.httpResponse,
      });
    }
  }
}
