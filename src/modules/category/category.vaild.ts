import joi from "joi";

export const addcategorySchema = {
  body: joi
    .object({
      title: joi.string().trim().lowercase().required(),
      desc: joi.string().trim().lowercase().required(),
    })
    .required(),
};
