import { /* inject, */ BindingScope, injectable } from "@loopback/core";
import jwt from "jsonwebtoken";
import { ITokenPayload } from "../interfaces";
import "dotenv/config";

@injectable({ scope: BindingScope.TRANSIENT })
export class JwtService {
  constructor(/* Add @inject to inject parameters */) {}

  /*
   * Add service methods here
   */
  generateToken(data: ITokenPayload): string {
    const token = jwt.sign(data, process.env.JWT_SECRET!);
    return `Bearer ${token}`;
  }

  verifyToken(token: string): ITokenPayload {
    return jwt.verify(
      token.split(" ")[1],
      process.env.JWT_SECRET!
    ) as ITokenPayload;
  }

  decodeToken(token: string): ITokenPayload {
    return jwt.decode(token.split(" ")[1]) as ITokenPayload;
  }
}
