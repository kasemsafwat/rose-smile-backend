import joi from 'joi';

export const addDoctorSchema = {
  body: joi.object({
    name: joi.string().required(),
    phone_whatsapp: joi.string().required(),
    specialization: joi.string().required(),
    description: joi.string().required(),
  }),
};

export const updateDoctorSchema = {
  body: joi.object({
    name: joi.string().optional(),
    email: joi.string().optional(),
    password: joi.string().optional(),
    phone: joi.string().optional(),
    specialization: joi.string().optional(),
  }),

  params: joi.object({
    doctorId: joi.string().required(),
  }),
};
