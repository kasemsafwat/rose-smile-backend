import { Iuser } from "../src/DB/interfaces/user.interface";

declare global {
  namespace Express {
    export interface Request {
      user?: Iuser;
    }
  }
}

import "multer";
declare module "multer" {
  export interface File {
    folder?: string;
    folderKey?: string; 
  }
}
