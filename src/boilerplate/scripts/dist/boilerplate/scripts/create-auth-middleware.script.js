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
const fs = __importStar(require("fs"));
(() => {
    try {
        fs.mkdirSync(`${__dirname}/../../../../../strategies`);
    }
    catch (err) { }
    fs.writeFileSync(`${__dirname}/../../../../../strategies/jwt-auth.strategy.ts`, `
  import {AuthenticationStrategy} from '@loopback/authentication';
  import {inject, service} from '@loopback/core';
  import {model} from '@loopback/repository';
  import {Request, Response, RestBindings} from '@loopback/rest';
  import {UserProfile, securityId} from '@loopback/security';
  import {ITokenService} from '../boilerplate/interfaces';
  import {JwtService} from '../boilerplate/services';
  import {unauthorizedErrorHttpResponse} from '../boilerplate/utils/lb4-http-response.util';
  
  @model()
  export class User implements UserProfile {
  [securityId]: string;
  
  id: number;
  ownerId: string;
  
  constructor(data?: Partial<User>) {
    Object.assign(this, data);
  }
  }
  
  export class JwtAuthStrategy implements AuthenticationStrategy {
  name = 'jwt-auth';
  
  constructor(
    @inject(RestBindings.Http.RESPONSE) private response: Response,
  ) {}
  
  async authenticate(request: Request): Promise<UserProfile | undefined> {
    try {
      const token = request.headers?.authorization;
  
      if (!token) throw new Error('Authentication token must be provided.');
  
      const payload = new JwtService().verifyToken(token);
  
      return new User({
        [securityId]: payload.id.toString(),
        id: payload.id,
      });
    } catch (err) {
      this.response.status(401);
      this.response.send(
        unauthorizedErrorHttpResponse({
          request,
          message: err.message,
        }),
      );
  
      return;
    }
  }
  }    
    `, {
        flag: "w",
    });
})();
