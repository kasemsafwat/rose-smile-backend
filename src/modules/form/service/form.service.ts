import { NextFunction, Request, Response } from 'express';
import formModel from '../../../DB/models/form.model';
import { CustomError } from '../../../utils/errorHandling';
import ApiPipeline from '../../../utils/apiFeacture';

export default class Form {
  static async addForm(req: Request, res: Response, next: NextFunction) {
    const { name, phone, service, city } = req.body;

    const form = new formModel({
      name,
      phone,
      service,
      city,
    });

    const savedForm = await form.save();
    if (!savedForm) {
      return next(new CustomError('Failed to create form', 500));
    }
    return res.status(201).json({
      message: 'Form created successfully',
      success: true,
      statusCode: 201,
      form: savedForm,
    });
  }

  static async updateCommentAndStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { id } = req.params;
    const userId = req?.user?._id;
    const { comment, status } = req.body;

    const form = await formModel.findById(id);
    if (!form) {
      return next(new CustomError('Form not found', 404));
    }

    form.comment = comment;
    form.status = status;
    form.editedBy = userId;

    const updatedForm = await form.save();
    if (!updatedForm) {
      return next(new CustomError('Failed to update form', 500));
    }

    return res.status(200).json({
      message: 'Form updated successfully',
      success: true,
      statusCode: 200,
      form: updatedForm,
    });
  }

  static async updateForm(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const userId = req?.user?._id;
    const { name, phone, service, city, comment, status } = req.body;

    // Check if the request body is empty
    if (!Object.keys(req.body).length) {
      return next(new CustomError('No update data provided', 400));
    }

    const form = await formModel.findById(id);
    if (!form) {
      return next(new CustomError('Form not found', 404));
    }

    const updateForm: any = {};
    if (name) updateForm.name = name;
    if (phone) updateForm.phone = phone;
    if (service) updateForm.service = service;
    if (city) updateForm.city = city;
    if (comment) updateForm.comment = comment;
    if (status) updateForm.status = status;
    if (userId) updateForm.editedBy = userId;

    const updatedForm = await formModel.findByIdAndUpdate(
      id,
      { $set: updateForm },
      { new: true, runValidators: true, lean: true }
    );

    if (!updatedForm) {
      return next(new CustomError('Failed to update form', 500));
    }

    return res.status(200).json({
      message: 'Form updated successfully',
      success: true,
      statusCode: 200,
      form: updatedForm,
    });
  }

  static async deleteForm(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    const form = await formModel.findByIdAndDelete(id);
    if (!form) {
      return next(new CustomError('Form not found', 404));
    }

    return res.status(200).json({
      message: 'Form deleted successfully',
      success: true,
      statusCode: 200,
    });
  }

  static async getFormById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    const form = await formModel
      .findById(id)
      .populate('service', 'title')
      .populate('editedBy', 'firstName lastName');

    if (!form) {
      return next(new CustomError('Form not found', 404));
    }

    return res.status(200).json({
      message: 'Form retrieved successfully',
      success: true,
      statusCode: 200,
      form,
    });
  }

  static allowSearchFields = ['name', 'phone', 'service', 'city'];
  static defaultFields = [
    'name',
    'phone',
    'service',
    'city',
    'comment',
    'status',
    'editedBy',
  ];
  static async getAllForms(req: Request, res: Response, next: NextFunction) {
    const { page, size, search, sort, select } = req.query;

    const pipeline = new ApiPipeline()
      .match({
        fields: Form.allowSearchFields,
        search: search?.toString() || '',
        op: '$or',
      })
      .sort(sort?.toString() || '')
      .paginate(Number(page) || 1, Number(size) || 100)
      .lookUp(
        {
          from: 'services',
          localField: 'service',
          foreignField: '_id',
          as: 'service',
          isArray: false,
        },
        {
          title: 1,
        }
      )
      .lookUp(
        {
          from: 'users',
          localField: 'editedBy',
          foreignField: '_id',
          as: 'editedBy',
          isArray: false,
        },
        {
          firstName: 1,
          lastName: 1,
        }
      )
      .projection({
        allowFields: Form.defaultFields,
        defaultFields: Form.defaultFields,
        select: select?.toString() || '',
      })
      .build();

    const [total, forms] = await Promise.all([
      formModel.countDocuments({}).lean(),
      formModel.aggregate(pipeline).exec(),
    ]);

    return res.status(200).json({
      message: 'Forms retrieved successfully',
      success: true,
      statusCode: 200,
      totalDoctors: total,
      totalPages: Math.ceil(total / Number(size || 21)),
      forms,
    });
  }
}
