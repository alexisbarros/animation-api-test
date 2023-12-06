
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

export class AnimationController {

  constructor(
    @repository(_repository.AnimationRepository) 
    private animationRepository: _interface.IAnimationRepository,

    @inject(RestBindings.Http.REQUEST) private httpRequest?: Request,
    @inject(RestBindings.Http.RESPONSE) private httpResponse?: Response,
  ) {}

  @post('/animations')
  @response(201, toSwaggerResponse({}))
  async create(
    @requestBody(toSwaggerRequest({schema: _entity.animation.schema, deletedAttributes: ['_deletedAt']}))
    data:_interface.IAnimation,
  ): Promise<IHttpResponse> {
    try {
      await this.animationRepository.create(data);

      return createHttpResponse({
        message: 'Animation created successfully',
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

  @get('/animations')
  @response(200, toSwaggerResponse({schema: _entity.animation.schema, isArray: true}))
  async find(
    @param.query.object('filters') filters?: any,
    @param.query.number('limit') limit?: number,
    @param.query.number('page') page?: number,
  ): Promise<IHttpResponse> {
    try {
      const [result, total] = await Promise.all([
        this.animationRepository.find( filters ?? {}, limit ?? 100, page ?? 0 ),
        this.animationRepository.count(filters ?? {})
      ]);

      return okHttpResponse({
        message: 'Animation returned successfully',
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

  @get('/animations/{id}')
  @response(200, toSwaggerResponse({schema: _entity.animation.schema, isArray: false}))
  async findById(@param.path.string('id') id: string): Promise<IHttpResponse> {
    try {
      const data = await this.animationRepository.findById(id);

      return okHttpResponse({
        message: 'Animation returned successfully',
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

  @put('/animations/{id}')
  @response(200, toSwaggerResponse({schema: _entity.animation.schema, isArray: false}))
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody(toSwaggerRequest({schema: _entity.animation.schema, deletedAttributes: ['_deletedAt']}))
    dataToUpdate:_interface.IAnimation,
  ): Promise<IHttpResponse> {
    try {
      const data = await this.animationRepository.replaceById(id, dataToUpdate);

      return okHttpResponse({
        message: 'Animation updated successfully',
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

  @patch('/animations/{id}')
  @response(200, toSwaggerResponse({schema: _entity.animation.schema, isArray: false}))
  async updateById(
    @param.path.string('id') id: string,
    @requestBody(toSwaggerRequest({schema: _entity.animation.schema, deletedAttributes: ['_deletedAt']}))
    dataToUpdate:_interface.IAnimation,
  ): Promise<IHttpResponse> {
    try {
      const data = await this.animationRepository.updateById(id, dataToUpdate);

      return okHttpResponse({
        message: 'Animation updated successfully',
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

  @del('/animations/{id}')
  @response(200, toSwaggerResponse({}))
  async deleteById(
    @param.path.string('id') id: string,
  ): Promise<IHttpResponse> {
    try {
      await this.animationRepository.deleteById(id);

      return okHttpResponse({
        message: 'Animation deleted successfully',
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
  