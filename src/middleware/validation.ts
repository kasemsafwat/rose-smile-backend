import joi, { Schema } from "joi";
import { Request, Response, NextFunction } from "express";
import { Types, isValidObjectId } from "mongoose";
import { PhoneNumberUtil } from "google-libphonenumber";

type ReqKey = "body" | "params" | "query" | "headers" | "cookies";
const req_FE: ReqKey[] = ["body", "params", "query", "headers", "cookies"];

export const valid = (schema: Partial<Record<ReqKey, Schema>>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const validationErrors: any[] = [];

    req_FE.forEach((key) => {
      if (schema[key]) {
        const { error, value } = schema[key].validate(req[key], {
          abortEarly: false,
        });

        if (error) {
          error.details.forEach((errorDetail) => {
            validationErrors.push({
              message: errorDetail.message.replace(/\"/g, ""),
              path: errorDetail.path?.[0] || key,
              label: errorDetail.context?.label,
              type: errorDetail.type,
            });
          });
        } else {
          req[key] = value;
        }
      }
    });

    if (validationErrors.length > 0) {
      return res.status(400).json({
        message: "Validation Error",
        errors: validationErrors,
      });
    }

    next();
  };
};

//============================= validateObjectId =====================
const validateObjectId = (value: string, helper: any) => {
  return isValidObjectId(value) ? value : helper.message("Invalid {#label}");
};

//=============================== Validation for phone number =====================

export const validatePhoneNumber = (value: string, helper: any) => {
  try {
    const phoneUtil = PhoneNumberUtil.getInstance();

    const number = phoneUtil.parse(value);
    const isValid = phoneUtil.isValidNumber(number);

    return isValid ? value : helper.message("Invalid phone number format");
  } catch (error) {
    return helper.message("Invalid phone number format");
  }
};

//============================= Custom Transform Functions =====================
export const toLowerCase = (value: string) => value.toLowerCase();

//============================= Custom Error Messages =====================
export const customMessages = {
  "string.base": "{#label} must be a string",
  "string.min": "{#label} must be at least {#limit} characters",
  "string.max": "{#label} must be at most {#limit} characters",
  "number.base": "{#label} must be a number",
  "number.valid": "{#label} must be one of {#valids}",
  "boolean.base": "{#label} must be true or false",
  "array.base": "{#label} must be an array",
  "array.items": "Invalid item in {#label}",
  "_id.required": "{#label} is required",
  "_id.optional": "{#label} is optional",
  "any.only": "{#label} must be {#valids}",
  "any.required": "{#label} is required",
};

//====================== General Validation Fields =========================
export const generalFields = {
  email: joi
    .string()
    .email({ tlds: { allow: ["com", "net", "org", "pro", "eg", "sa"] } })
    .trim()
    .messages(customMessages),

  password: joi
    .string()
    .pattern(/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/)
    .trim()
    .min(8)
    .max(44)
    .messages({
      "string.pattern.base":
        "Password must be at least 8 characters, contain numbers, uppercase letters, and symbols.",
      ...customMessages,
    }),

  _id: joi.string().trim().custom(validateObjectId).messages(customMessages),

  phoneNumber: joi
    .string()
    .trim()
    .custom(validatePhoneNumber)
    .messages(customMessages),

  gender: joi
    .string()
    .valid("male", "female")
    .lowercase()
    .trim()
    .messages(customMessages),

  date: joi.date().iso().messages(customMessages),

  sort: joi.string().trim().optional().messages(customMessages),
  select: joi
    .string()
    .trim()
    .min(3)
    .max(100)
    .optional()
    .messages(customMessages),
  page: joi.number().min(0).max(33).optional().messages(customMessages),
  size: joi.number().min(0).max(23).optional().messages(customMessages),
  search: joi.string().trim().min(0).max(100).messages(customMessages),

  file: joi.object({
    size: joi.number(),
  }),

  token: joi
    .string()
    .pattern(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/)
    .messages(customMessages),

  title: joi
    .string()
    .trim()
    .lowercase()
    .min(3)
    .max(100)
    .messages(customMessages),

  desc: joi
    .string()
    .trim()
    .lowercase()
    .min(3)
    .max(700)
    .messages(customMessages),
};
