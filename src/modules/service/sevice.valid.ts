import joi from "joi";
import { generalFields } from "../../middleware/validation";

export const addServiceSchema = {
  body: joi.object({
    title: joi.string().required(),
    desc: joi.string().required(),
    sectionId: generalFields._id.required(),
  }),
};

export const updateServiceSchema = {
  body: joi.object({
    title: joi.string().trim().min(1).max(2000).optional(),
    desc: joi.string().trim().min(1).max(2000).optional(),
    sectionId: generalFields._id,
  }),
  params: joi.object({
    id: joi.string().required(),
  }),
};

export const deleteServiceSchema = {
  params: joi.object({
    id: joi.string().required(),
  }),
};

export const getServiceByIdSchema = {
  params: joi.object({
    id: joi.string().required(),
  }),
};

export const getServicesSchema = {
  query: joi.object({
    page: generalFields.page,
    size: generalFields.size,
    sort: generalFields.sort,
    search: generalFields.search,
    select: generalFields.select,
    id: generalFields._id,
    sectionIds: joi
      .alternatives()
      .try(generalFields._id, joi.array().items(generalFields._id))
      .optional()
      .custom((value) => [].concat(value), "Convert single value to array"),
  }),
};

export const addServiceImagesSchema = {
  params: joi.object({
    id: joi.string().required(),
  }),
};

export const updateServiceImageSchema = {
  params: joi.object({
    id: generalFields._id.required(),
  }),
};

export const deleteServiceImageSchema = {
  params: joi.object({
    id: joi.string().required(),
  }),
  body: joi.object({
    imageIds: joi.array().items(joi.string()).required(),
  }),
};
