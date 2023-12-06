
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {post, get, put, patch, del, param, Request, Response, response, RestBindings, requestBody} from '@loopback/rest';
import {
  IHttpResponse,
  createHttpResponse,
  okHttpResponse,
  badRequestErrorHttpResponse,
  notFoundErrorHttpResponse,
} from '../boilerplate/utils/lb4-http-response.util';
import {toSwaggerResponse, toSwaggerRequest} from '../boilerplate/services/swagger.service';

import * as _repository from '../repositories';
import * as _model from '../models';
import * as _interface from '../interfaces';
import * as _entity from '../entities';

export class CharacterController {

  constructor(
    @repository(_repository.CharacterRepository) 
    private characterRepository: _interface.ICharacterRepository,

    @inject(RestBindings.Http.REQUEST) private httpRequest?: Request,
    @inject(RestBindings.Http.RESPONSE) private httpResponse?: Response,
  ) {}

  @post('/characters')
  @response(201, toSwaggerResponse({}))
  async create(
    @requestBody(toSwaggerRequest({schema: _entity.character.schema, deletedAttributes: ['_deletedAt']}))
    data:_interface.ICharacter,
  ): Promise<IHttpResponse> {
    try {
      await this.characterRepository.create(data);

      return createHttpResponse({
        message: 'Character created successfully',
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

  @get('/characters')
  @response(200, toSwaggerResponse({schema: _entity.character.schema, isArray: true}))
  async find(
    @param.query.object('filters') filters?: any,
    @param.query.number('limit') limit?: number,
    @param.query.number('page') page?: number,
  ): Promise<IHttpResponse> {
    try {
      const [result, total] = await Promise.all([
        this.characterRepository.find( filters ?? {}, limit ?? 100, page ?? 0 ),
        this.characterRepository.count(filters ?? {})
      ]);

      return okHttpResponse({
        message: 'Character returned successfully',
        data: {
          result,
          total,
          page: page ?? 0,
        },
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

  @get('/characters/{id}')
  @response(200, toSwaggerResponse({schema: _entity.character.schema, isArray: false}))
  async findById(@param.path.string('id') id: string): Promise<IHttpResponse> {
    try {
      const data = await this.characterRepository.findById(id);

      return okHttpResponse({
        message: 'Character returned successfully',
        data,
        request: this.httpRequest,
        response: this.httpResponse,
      });
    } catch (err) {
      const errorData = {
        message: err.message,
        request: this.httpRequest,
        response: this.httpResponse,
      }
      if(err.statusCode === 404) return notFoundErrorHttpResponse(errorData);
      else return badRequestErrorHttpResponse(errorData);
    }
  }

  @put('/characters/{id}')
  @response(200, toSwaggerResponse({schema: _entity.character.schema, isArray: false}))
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody(toSwaggerRequest({schema: _entity.character.schema, deletedAttributes: ['_deletedAt']}))
    dataToUpdate:_interface.ICharacter,
  ): Promise<IHttpResponse> {
    try {
      const data = await this.characterRepository.replaceById(id, dataToUpdate);

      return okHttpResponse({
        message: 'Character updated successfully',
        data,
        request: this.httpRequest,
        response: this.httpResponse,
      });
    } catch (err) {
      const errorData = {
        message: err.message,
        request: this.httpRequest,
        response: this.httpResponse,
      }
      if(err.statusCode === 404) return notFoundErrorHttpResponse(errorData);
      else return badRequestErrorHttpResponse(errorData);
    }
  }

  @patch('/characters/{id}')
  @response(200, toSwaggerResponse({schema: _entity.character.schema, isArray: false}))
  async updateById(
    @param.path.string('id') id: string,
    @requestBody(toSwaggerRequest({schema: _entity.character.schema, deletedAttributes: ['_deletedAt']}))
    dataToUpdate:_interface.ICharacter,
  ): Promise<IHttpResponse> {
    try {
      const data = await this.characterRepository.updateById(id, dataToUpdate);

      return okHttpResponse({
        message: 'Character updated successfully',
        data,
        request: this.httpRequest,
        response: this.httpResponse,
      });
    } catch (err) {
      const errorData = {
        message: err.message,
        request: this.httpRequest,
        response: this.httpResponse,
      }
      if(err.statusCode === 404) return notFoundErrorHttpResponse(errorData);
      else return badRequestErrorHttpResponse(errorData);
    }
  }

  @del('/characters/{id}')
  @response(200, toSwaggerResponse({}))
  async deleteById(
    @param.path.string('id') id: string,
  ): Promise<IHttpResponse> {
    try {
      await this.characterRepository.deleteById(id);

      return okHttpResponse({
        message: 'Character deleted successfully',
        request: this.httpRequest,
        response: this.httpResponse,
      });
    } catch (err) {
      const errorData = {
        message: err.message,
        request: this.httpRequest,
        response: this.httpResponse,
      }
      if(err.statusCode === 404) return notFoundErrorHttpResponse(errorData);
      else return badRequestErrorHttpResponse(errorData);
    }
  }
}
  