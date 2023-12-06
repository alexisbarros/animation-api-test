
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
    