import joi from "joi";
import { generalFields } from "../../middleware/validation";

export const addServiceSchema = {
  body: joi.object({
    title: joi.string().required(),
    desc: joi.string().required(),
  }),
};

export const updateServiceSchema = {
  body: joi.object({
    title: joi.string().required(),
    desc: joi.string().required(),
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
  }),
};
