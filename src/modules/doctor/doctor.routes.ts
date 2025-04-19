import { Router, RequestHandler } from 'express';
import { valid } from '../../middleware/validation';
import { isAuth } from '../../middleware/auth';
import { Roles } from '../../DB/interfaces/user.interface';
import {
  addDoctorSchema,
  updateDoctorSchema,
  DoctorIdSchema,
} from './doctor.valid';
import Doctor from './service/doctor.service';
import { configureMulter } from '../../utils/multer';
import { asyncHandler } from '../../utils/errorHandling';
import { getServicesSchema } from '../service/sevice.valid';

const doctorRouter = Router();

// Add a new doctor
doctorRouter.post(
  '/',
  configureMulter(1024 * 1024 * 5).single('image'),
  valid(addDoctorSchema) as RequestHandler,
  isAuth([Roles.SuperAdmin]),
  asyncHandler(Doctor.addDoctor)
);

// Update an existing doctor
doctorRouter.put(
  '/:doctorId',
  valid(updateDoctorSchema) as RequestHandler,
  isAuth([Roles.SuperAdmin]),
  asyncHandler(Doctor.updateDoctor)
);

// Update a doctor's image
doctorRouter.put(
  '/image/:doctorId',
  configureMulter(1024 * 1024 * 5).single('image'),
  isAuth([Roles.SuperAdmin]),
  asyncHandler(Doctor.updateDoctorImage)
);

// Delete a doctor
doctorRouter.delete(
  '/:doctorId',
  valid(DoctorIdSchema) as RequestHandler,
  isAuth([Roles.SuperAdmin]),
  asyncHandler(Doctor.deleteDoctor)
);

// Get all doctors
doctorRouter.get(
  '/',
  valid(getServicesSchema) as RequestHandler,
  asyncHandler(Doctor.getAllDoctors)
);

// Get a doctor by ID
doctorRouter.get(
  '/:doctorId',
  valid(DoctorIdSchema) as RequestHandler,
  asyncHandler(Doctor.getDoctorById)
);

export default doctorRouter;
