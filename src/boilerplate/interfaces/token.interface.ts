export interface ITokenPayload {
  [key: string]: any;
}

export interface ITokenService {
  generateToken(data: ITokenPayload): string;
  verifyToken(token: string): ITokenPayload;
  decodeToken(token: string): ITokenPayload;
}
