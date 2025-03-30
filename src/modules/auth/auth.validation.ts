import joi from "joi";
import { generalFields } from "../../middleware/validation";

// name, email, password, age, phone

export const registerSchema = {
  body: joi
    .object({
      firstName: joi.string().trim().min(3).max(33).required(),
      lastName: joi.string().trim().min(3).max(33).required(),
      email: generalFields.email.required(),
      password: generalFields.password.required(),
      confirmPassword: joi.valid(joi.ref("password")).required(),
      role: joi.string().valid("user", "instructor").required(),
    })
    .required(),
};

export const loginSchema = {
  body: joi
    .object({
      email: generalFields.email.required(),
      password: generalFields.password.required(),
    })
    .required(),
};

export const confirmEmailSchema = {
  params: joi
    .object({
      token: generalFields.token.required(),
    })
    .required(),
};

export const cokkiesSchema = {
  cookies: joi
    .object({
      accessToken: joi
        .string()
        .pattern(/^(Bearer )[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/)
        .required(),
      refreshToken: joi
        .string()
        .pattern(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/)
        .required(),
      mp_d7f79c10b89f9fa3026f2fb08d3cf36d_mixpanel: joi
        .string()
    }).required(),
};

export const sendForgetPasswordSchema = {
  body: joi
    .object({
      email: generalFields.email.required(),
    })
    .required(),
};

export const resetPasswordSchema = {
  body: joi
    .object({
      email: generalFields.email.required(),
      code: joi.string().required(),
      password: generalFields.password.required(),
      confirmPassword: joi.string().valid(joi.ref("password")).required(),
    })
    .required(),
};
