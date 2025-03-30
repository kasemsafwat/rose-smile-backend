import joi from "joi";
import { generalFields } from "../../middleware/validation";


export const changePassSchema = {
  body: joi
    .object({
      currentPassword: generalFields.password.required(),
      newPassword: generalFields.password.required(),
    })
    .required(),
};
