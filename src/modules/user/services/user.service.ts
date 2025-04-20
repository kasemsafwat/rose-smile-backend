import { CustomError } from "./../../../utils/errorHandling";
import { NextFunction, Request, Response } from "express";
import { sanatizeUser } from "../../../utils/sanatize.data";
import userModel from "../../../DB/models/user.model";
import bcrypt, { compare } from "bcryptjs";
import { encrypt } from "../../../utils/crpto";
import { CloudinaryService } from "../../../utils/cloudinary";
import { Iuser } from "../../../DB/interfaces/user.interface";

export const profile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | any> => {
  const user = req.user;

  if (!user) {
    return next(new CustomError("user not found ERROR", 500));
  }

  return res.status(200).json({
    message: "user data fetched successfully",
    statusCode: 200,
    success: true,
    user: sanatizeUser(user),
  });
};

export const uploadImage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  const user = req?.user;
  if (!req.file) {
    return next(new CustomError("No file uploaded", 400));
  }

  const userId = req.user?._id;
  if (!userId) {
    return next(new CustomError("Unauthorized", 401));
  }

  let publicId, secure_url;

  if (user?.image && user?.image?.id && user?.image?.url) {
    publicId = user?.image?.id;
    const { secure_url: newSecureUrl, public_id: newPublicId } =
      await new CloudinaryService().updateFile(publicId, req.file.path);
    secure_url = newSecureUrl;
    publicId = newPublicId;
  } else {
    const { secure_url: newSecureUrl, public_id: newPublicId } =
      await new CloudinaryService().uploadFile(req.file.path);

    secure_url = newSecureUrl;
    publicId = newPublicId;
  }

  const updateUser = await userModel.findByIdAndUpdate(
    userId,
    { image: { id: publicId, url: secure_url } },
    { new: true }
  );

  if (!user) {
    return next(new CustomError("User not found", 404));
  }

  return res.status(200).json({
    message: "Image uploaded successfully",
    statusCode: 200,
    success: true,
    user: sanatizeUser(updateUser as Iuser),
  });
};

export const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response | any> => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user?._id;

  const user = await userModel.findById(userId);
  if (!user) {
    return next(new CustomError("User not found", 404));
  }

  const isMatch = await bcrypt.compare(currentPassword, String(user.password));
  if (!isMatch) {
    return next(new CustomError("Current password is incorrect", 400));
  }

  const hashedPassword = await bcrypt.hash(newPassword, 8);

  user.password = hashedPassword;
  await user.save();

  res.status(200).json({
    message: "Password changed successfully",
    statusCode: 200,
    success: true,
  });
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response | any> => {
  const { firstName, lastName, phone } = req.body;
  const user = req.user;

  const encryptedPhone = phone
    ? encrypt(phone, String(process.env.SECRETKEY_CRYPTO))
    : undefined;

  const updateData: any = { firstName, lastName };
  if (encryptedPhone) updateData.phone = encryptedPhone;

  const updateUser = await userModel.findByIdAndUpdate(user?._id, updateData, {
    new: true,
  });

  if (!updateUser) {
    return next(new CustomError("User not found during update", 404));
  }

  return res.status(200).json({
    message: "User data updated successfully",
    statusCode: 200,
    success: true,
    user: sanatizeUser(updateUser),
  });
};

export const deleteAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response | any> => {
  const userId = req.user?._id;

  if (!userId) {
    return next(new CustomError("Unauthorized", 401));
  }

  await userModel.findByIdAndDelete(userId);

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  return res.status(200).json({
    message: "Account deleted successfully",
    statusCode: 200,
    success: true,
  });
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | any> => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  return res.status(200).json({
    message: "Logout successful",
    success: true,
    statusCode: 200,
  });
};
