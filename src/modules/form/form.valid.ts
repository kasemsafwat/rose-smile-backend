import joi from 'joi';

export const addFormSchema = {
  body: joi.object({
    name: joi.string().required(),
    phone: joi.string().required(),
    service: joi.string().required(),
    city: joi.string().required(),
  }),
};

export const addCommentSchema = {
  body: joi.object({
    comment: joi.string().required(),
  }),

  params: joi.object({
    id: joi.string().required(),
  }),
};

export const updateFormSchema = {
  body: joi.object({
    name: joi.string().optional(),
    phone: joi.string().optional(),
    service: joi.string().optional(),
    city: joi.string().optional(),
    comment: joi.string().optional(),
  }),
  params: joi.object({
    id: joi.string().required(),
  }),
};
