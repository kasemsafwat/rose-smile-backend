import joi from "joi";
import { generalFields } from "../../middleware/validation";

export const updateSchema = {
  body: joi
    .object({
      firstName: joi.string().trim().min(3).max(33).optional(),
      lastName: joi.string().trim().min(3).max(33).optional(),
      phone: generalFields.phoneNumber.optional(),
    })
    .required(),
};

export const changePassSchema = {
  body: joi
    .object({
      currentPassword: generalFields.password.required(),
      newPassword: generalFields.password.required(),
      confirmPassword: joi.string().valid(joi.ref("newPassword")).required(),
    })
    .required(),
};
