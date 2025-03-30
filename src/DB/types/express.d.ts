import { Iuser } from "../interfaces/user.interface";

declare global {
  declare namespace Express {
    export interface Request {
      user?: Iuser;
    }
  }
}
