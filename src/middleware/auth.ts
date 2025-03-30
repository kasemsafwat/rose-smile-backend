import { NextFunction, Request, Response } from "express";
import { asyncHandler, CustomError } from "../utils/errorHandling";
import { TokenService } from "../utils/tokens";
import userModel from "../DB/models/user.model";
import { Types } from "mongoose";
import { Iuser, Roles } from "../DB/interfaces/user.interface";
import { TokenConfigration } from "../config/env";

declare global {
  namespace Express {
    interface Request {
      user?: Iuser;
    }
  }
  namespace Multer {
    interface File {
      folder?: string;
      folderKey?: string;
    }
  }
}

export const isAuth = (roles: Array<Roles>) => {
  return asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { accessToken: accessTokenPrefix } = req.cookies;

      const accessToken = accessTokenPrefix.split(
        TokenConfigration.ACCESS_TOKEN_START_WITH || "Bearer "
      )[1];

      let decodedToken;

      decodedToken = new TokenService(
        TokenConfigration.ACCESS_TOKEN_SECRET as string
      ).verifyToken(accessToken);

      const { userId } = decodedToken;

      const finduser = await userModel.findById(new Types.ObjectId(userId), {
        password: 0,
        __v: 0,
      });
      if (!finduser || !finduser.role) {
        return next(new CustomError("User not found", 404));
      }

      // chk authorized
      if (!roles.includes(finduser?.role))
        return next(new CustomError("Unauthorized user", 401));

      req.user = finduser as Iuser;

      return next();
    }
  );
};
