import joi from "joi";
import { generalFields } from "../../middleware/validation";

export const addsectionSchema = {
  body: joi
    .object({
      title: generalFields.title.required(),
      desc: generalFields.desc.required(),
    })
    .required(),
};

export const updatesectionSchema = {
  body: joi
    .object({
      title: generalFields.title.optional(),
      desc: generalFields.desc.optional(),
    })
    .required(),

  query: joi
    .object({
      sectionId: generalFields._id.required(),
    })
    .required(),
};

export const sectionIdSchema = {
  params: joi
    .object({
      id: generalFields._id.required(),
    })
    .required(),
};

export const searchSchema = {
  query: joi
    .object({
      page: generalFields.page,
      size: generalFields.size,
      select: generalFields.select,
      search: generalFields.search,
      sort: generalFields.sort,
    })
    .required(),
};
