"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const _entity = __importStar(require("../../entities"));
const fs = __importStar(require("fs"));
const text_transformation_util_1 = require("../utils/text-transformation.util");
const getControllerCode = (entity) => {
    const camelName = (0, text_transformation_util_1.pascalToCamel)(entity.name);
    return `
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

export class ${entity.name}Controller {

  constructor(
    @repository(_repository.${entity.name}Repository) 
    private ${camelName}Repository: _interface.I${entity.name}Repository,

    @inject(RestBindings.Http.REQUEST) private httpRequest?: Request,
    @inject(RestBindings.Http.RESPONSE) private httpResponse?: Response,
  ) {}

  @post('/${entity.route}')
  @response(201, toSwaggerResponse({}))
  async create(
    @requestBody(toSwaggerRequest({schema: _entity.${camelName}.schema, deletedAttributes: ['_deletedAt']}))
    data:_interface.I${entity.name},
  ): Promise<IHttpResponse> {
    try {
      await this.${camelName}Repository.create(data);

      return createHttpResponse({
        message: '${entity.name} created successfully',
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

  @get('/${entity.route}')
  @response(200, toSwaggerResponse({schema: _entity.${camelName}.schema, isArray: true}))
  async find(
    @param.query.object('filters') filters?: any,
    @param.query.number('limit') limit?: number,
    @param.query.number('page') page?: number,
  ): Promise<IHttpResponse> {
    try {
      const [result, total] = await Promise.all([
        this.${camelName}Repository.find( filters ?? {}, limit ?? 100, page ?? 0 ),
        this.${camelName}Repository.count(filters ?? {})
      ]);

      return okHttpResponse({
        message: '${entity.name} returned successfully',
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

  @get('/${entity.route}/{id}')
  @response(200, toSwaggerResponse({schema: _entity.${camelName}.schema, isArray: false}))
  async findById(@param.path.string('id') id: string): Promise<IHttpResponse> {
    try {
      const data = await this.${camelName}Repository.findById(id);

      return okHttpResponse({
        message: '${entity.name} returned successfully',
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

  @put('/${entity.route}/{id}')
  @response(200, toSwaggerResponse({schema: _entity.${camelName}.schema, isArray: false}))
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody(toSwaggerRequest({schema: _entity.${camelName}.schema, deletedAttributes: ['_deletedAt']}))
    dataToUpdate:_interface.I${entity.name},
  ): Promise<IHttpResponse> {
    try {
      const data = await this.${camelName}Repository.replaceById(id, dataToUpdate);

      return okHttpResponse({
        message: '${entity.name} updated successfully',
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

  @patch('/${entity.route}/{id}')
  @response(200, toSwaggerResponse({schema: _entity.${camelName}.schema, isArray: false}))
  async updateById(
    @param.path.string('id') id: string,
    @requestBody(toSwaggerRequest({schema: _entity.${camelName}.schema, deletedAttributes: ['_deletedAt']}))
    dataToUpdate:_interface.I${entity.name},
  ): Promise<IHttpResponse> {
    try {
      const data = await this.${camelName}Repository.updateById(id, dataToUpdate);

      return okHttpResponse({
        message: '${entity.name} updated successfully',
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

  @del('/${entity.route}/{id}')
  @response(200, toSwaggerResponse({}))
  async deleteById(
    @param.path.string('id') id: string,
  ): Promise<IHttpResponse> {
    try {
      await this.${camelName}Repository.deleteById(id);

      return okHttpResponse({
        message: '${entity.name} deleted successfully',
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
  `;
};
const createController = (entity, filename) => {
    const code = getControllerCode(entity);
    fs.writeFileSync(`${__dirname}/../../../../../controllers/${filename}.controller.ts`, code, {
        flag: "w",
    });
};
(() => {
    fs.writeFileSync(`${__dirname}/../../../../../controllers/index.ts`, "", {
        flag: "w",
    });
    const entityFiles = fs.readdirSync(`${__dirname}/../../entities`);
    for (const file of entityFiles) {
        const filename = file.split(".")[0];
        const entity = (0, text_transformation_util_1.kebabToCamel)(filename);
        if (entity === "index")
            continue;
        createController(_entity[entity], filename);
        const indexContent = fs
            .readFileSync(`${__dirname}/../../../../../controllers/index.ts`)
            .toString();
        fs.writeFileSync(`${__dirname}/../../../../../controllers/index.ts`, `${indexContent} export * from './${filename}.controller';`);
    }
})();
