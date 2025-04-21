import { Router, RequestHandler } from 'express';
import { valid } from '../../middleware/validation';
import { isAuth } from '../../middleware/auth';
import { Roles } from '../../DB/interfaces/user.interface';
import {
  addFormSchema,
  addCommentSchema,
  updateFormSchema,
} from './form.valid';
import Form from './service/form.service';
import { asyncHandler } from '../../utils/errorHandling';

const formRouter = Router();

formRouter.post(
  '/',
  valid(addFormSchema) as RequestHandler,
  asyncHandler(Form.addForm)
);

formRouter.patch(
  '/:id',
  isAuth([Roles.SuperAdmin, Roles.Admin]),
  valid(addCommentSchema) as RequestHandler,
  asyncHandler(Form.updateCommentAndStatus)
);

formRouter.put(
  '/:id',
  isAuth([Roles.SuperAdmin]),
  valid(updateFormSchema) as RequestHandler,
  asyncHandler(Form.updateForm)
);

formRouter.delete(
  '/:id',
  isAuth([Roles.SuperAdmin]),
  asyncHandler(Form.deleteForm)
);

formRouter.get(
  '/:id',
  isAuth([Roles.SuperAdmin, Roles.Admin]),
  asyncHandler(Form.getFormById)
);

formRouter.get(
  '/',
  isAuth([Roles.SuperAdmin, Roles.Admin]),
  asyncHandler(Form.getAllForms)
);

export default formRouter;
