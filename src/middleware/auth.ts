import { NextFunction, Request, Response } from "express";
import { asyncHandler, CustomError } from "../utils/errorHandling";
import { TokenService } from "../utils/tokens";
import userModel from "../DB/models/user.model";
import { Types } from "mongoose";
import { Iuser, Roles } from "../DB/interfaces/user.interface";
import { TokenConfigration } from "../config/env";
import { cokkiesOptions } from "../utils/cookies";
import { TokenExpiredError } from "jsonwebtoken";

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
      console.time("⏱️ isAuth");
      try {
        const { accessToken: accessTokenPrefix, refreshToken } = req.cookies;

        if (!accessTokenPrefix || !refreshToken) {
          return next(new CustomError("Plz login first", 401));
        }

        const accessToken = accessTokenPrefix.startsWith(
          TokenConfigration.ACCESS_TOKEN_START_WITH || "Bearer "
        )
          ? accessTokenPrefix.split(
              TokenConfigration.ACCESS_TOKEN_START_WITH || "Bearer "
            )[1]
          : accessTokenPrefix;

        let decodedToken;
        try {
          decodedToken = new TokenService(
            TokenConfigration.ACCESS_TOKEN_SECRET as string
          ).verifyToken(accessToken);
        } catch (error) {
          if (!(error instanceof TokenExpiredError)) {
            return next(error);
          }
        }

        if (decodedToken) {
          const { userId } = decodedToken;
          const user = await userModel.findById(new Types.ObjectId(userId), {
            __v: 0,
          });

          if (!user || !user.role) {
            return next(new CustomError("User not found", 404));
          }

          if (!roles.includes(user.role)) {
            return next(new CustomError("Unauthorized user", 403));
          }

          req.user = user as Iuser;
          console.timeEnd("⏱️ isAuth");
          return next();
        }

        // Handle expired access token: Use refresh token
        if (!refreshToken) {
          return next(new CustomError("Refresh token is required", 401));
        }

        let decodedRefresh;
        try {
          decodedRefresh = new TokenService(
            String(TokenConfigration.REFRESH_TOKEN_SECRET)
          ).verifyToken(refreshToken);
        } catch (error) {
          return next(new CustomError("Invalid refresh token", 400));
        }

        if (!decodedRefresh || !decodedRefresh.userId) {
          return next(new CustomError("Invalid refresh token", 400));
        }

        const user = await userModel.findById(decodedRefresh.userId).lean();
        if (!user) {
          return next(
            new CustomError("User not found, please login again", 400)
          );
        }

        // Generate new tokens
        const newAccessToken = new TokenService(
          String(TokenConfigration.ACCESS_TOKEN_SECRET),
          String(TokenConfigration.ACCESS_EXPIRE)
        ).generateToken({ userId: user._id, role: user.role });

        const newRefreshToken = new TokenService(
          String(TokenConfigration.REFRESH_TOKEN_SECRET),
          String(TokenConfigration.REFRESH_EXPIRE)
        ).generateToken({ userId: user._id, role: user.role });

        // Set new tokens in cookies
        res.cookie(
          "accessToken",
          `${
            TokenConfigration.ACCESS_TOKEN_START_WITH || "Bearer "
          }${newAccessToken}`,
          cokkiesOptions(10 * 24 * 3600000) // 10 days
        );
        res.cookie(
          "refreshToken",
          newRefreshToken,
          cokkiesOptions(10 * 24 * 3600000)
        );

        req.user = user as Iuser;
        return next();
      } catch (error) {
        return next(error);
      }
    }
  );
};
