import { Router, RequestHandler } from 'express';
import { valid } from '../../middleware/validation';
import { isAuth } from '../../middleware/auth';
import { Roles } from '../../DB/interfaces/user.interface';
import { addDoctorSchema, updateDoctorSchema } from './doctor.valid';
import Doctor from './service/doctor.service';
import { configureMulter } from '../../utils/multer';
import { asyncHandler } from '../../utils/errorHandling';

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

export default doctorRouter;
