import joi from "joi";
import { generalFields } from "../../middleware/validation";

export const createOfferSchema = {
  body: joi
    .object({
      title: joi.string().trim().min(3).max(1000).required(),
      desc: joi.string().trim().min(3).max(7000).required(),
      type: joi.string().valid("section", "service").required(),
      reference: generalFields._id.required(),
      display: joi.boolean().required(),
    })
    .required(),
};

export const updateOfferSchema = {
  body: joi.object({
    title: joi.string().trim().min(3).max(1000).optional(),
    desc: joi.string().trim().min(3).max(7000).optional(),
    type: joi.string().valid("section", "service").optional(),
    reference: generalFields._id.optional(),
    display: joi.boolean().optional(),
  }),
  params: joi.object({
    id: generalFields._id.required(),
  }),
};

export const updateOfferImageSchema = {
  params: joi.object({
    id: generalFields._id.required(),
  }),
};

export const deleteOfferSchema = {
  params: joi.object({
    id: generalFields._id.required(),
  }),
};

export const getOfferByIdSchema = {
  params: joi.object({
    id: generalFields._id.required(),
  }),
};

export const getOffersSchema = {
  query: joi.object({
    page: generalFields.page,
    size: generalFields.size,
    search: generalFields.search,
    sort: generalFields.sort,
    select: generalFields.select,
  }),
};
