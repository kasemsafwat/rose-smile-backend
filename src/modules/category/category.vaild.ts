import joi from "joi";
import { generalFields } from "../../middleware/validation";

export const addcategorySchema = {
  body: joi
    .object({
      title: generalFields.title.required(),
      desc: generalFields.desc.required(),
    })
    .required(),
};

export const updatecategorySchema = {
  body: joi
    .object({
      title: generalFields.title.optional(),
      desc: generalFields.desc.optional(),
    })
    .required(),

  query: joi
    .object({
      categoryId: generalFields._id.required(),
    })
    .required(),
};

export const categoryIdSchema = {
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
