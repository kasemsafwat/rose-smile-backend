import { Document } from "mongoose";
import { decrypt } from "./crpto";
import _ from "lodash";
import { Iuser } from "../DB/interfaces/user.interface";

export const sanatizeUser = (user: Iuser) => {
  const sanitized = {
    _id: user?._id,
    firstName: user?.firstName,
    lastName: user?.lastName,
    email: user?.email,
    age: user?.age,
    phone: user?.phone
      ? decrypt(String(user?.phone), String(process.env.SECRETKEY_CRYPTO))
      : undefined,
    role: user?.role,
    avatar: user?.avatar,
    isConfirmed: user?.isConfirmed,
    jobTitle: user.jobTitle,
    socialLinks: user?.socialLinks,
    verificationStatus: user?.verificationStatus
  };

  return _.omitBy(sanitized, _.isNil);
};
