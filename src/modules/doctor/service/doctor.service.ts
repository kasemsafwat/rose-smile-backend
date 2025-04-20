import { NextFunction, Request, Response } from "express";
import { CustomError } from "../../../utils/errorHandling";
import { doctorModel } from "../../../DB/models/doctor.model";
import { cloudinaryInstance } from "../../../utils/cloudinary";
import ApiPipeline from "../../../utils/apiFeacture";

export default class Doctor {
  static async addDoctor(req: Request, res: Response, next: NextFunction) {
    const { name, phone_whatsapp, specialization, description } = req.body;

    if (!req?.file) {
      return next(new CustomError("No files uploaded", 400));
    }

    const doctor = new doctorModel({
      name,
      phone_whatsapp,
      specialization,
      description,
    });

    const { secure_url, public_id } = await cloudinaryInstance.uploadFile(
      req.file.path,
      `doctor/${doctor._id}`
    );

    doctor.image = { url: secure_url, id: public_id };
    const savedDoctor = await doctor.save();
    if (!savedDoctor) {
      await cloudinaryInstance.deleteFile(public_id);
      return next(new CustomError("Failed to create doctor", 500));
    }
    return res.status(201).json({
      message: "Doctor created successfully",
      success: true,
      statusCode: 201,
      doctor: savedDoctor,
    });
  }

  static async updateDoctor(req: Request, res: Response, next: NextFunction) {
    const { doctorId } = req.params;
    const { name, phone_whatsapp, specialization, description } = req.body;

    // Check if the request body is empty
    if (!Object.keys(req.body).length) {
      return next(new CustomError("No update data provided", 400));
    }

    const findDoctor = await doctorModel.findById(doctorId);
    if (!findDoctor) {
      return next(new CustomError("Doctor not found", 404));
    }

    const updateDoctor: any = {};
    if (name) updateDoctor.name = name;
    if (phone_whatsapp) updateDoctor.phone_whatsapp = phone_whatsapp;
    if (specialization) updateDoctor.specialization = specialization;
    if (description) updateDoctor.description = description;

    const doctor = await doctorModel.findByIdAndUpdate(
      doctorId,
      { $set: updateDoctor },
      { new: true, runValidators: true, lean: true }
    );

    return res.status(200).json({
      message: "Doctor updated successfully",
      success: true,
      statusCode: 200,
      doctor,
    });
  }

  static async updateDoctorImage(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { doctorId } = req.params;

    const doctor = await doctorModel.findById(doctorId);

    if (!doctor) {
      return next(new CustomError("Doctor not found", 404));
    }

    if (!req?.file) {
      return next(new CustomError("No files uploaded", 400));
    }

    const { secure_url, public_id } = await cloudinaryInstance.uploadFile(
      req.file.path,
      `doctor/${doctorId}`
    );

    doctor.image = { url: secure_url, id: public_id };

    await doctor.save();

    return res.status(200).json({
      message: "Doctor image updated successfully",
      success: true,
      statusCode: 200,
      doctor,
    });
  }

  static async deleteDoctor(req: Request, res: Response, next: NextFunction) {
    const { doctorId } = req.params;

    const doctor = await doctorModel.findByIdAndDelete(doctorId);
    if (!doctor) {
      return next(new CustomError("Doctor not found", 404));
    }

    await cloudinaryInstance.deleteFile(doctor.image.id);

    return res.status(200).json({
      message: "Doctor deleted successfully",
      success: true,
      statusCode: 200,
    });
  }

  static allowSearchFields = ["name", "specialization"];
  static defaultFields = [
    "name",
    "phone_whatsapp",
    "image",
    "specialization",
    "description",
  ];
  static async getAllDoctors(req: Request, res: Response, next: NextFunction) {
    const { page, size, search, sort, select } = req.query;

    const pipeline = new ApiPipeline()
      .match({
        fields: Doctor.allowSearchFields,
        search: search?.toString() || "",
        op: "$or",
      })
      .sort(sort?.toString() || "")
      .paginate(Number(page) || 1, Number(size) || 100)
      .projection({
        allowFields: Doctor.defaultFields,
        defaultFields: Doctor.defaultFields,
        select: select?.toString() || "",
      })
      .build();

    const [total, doctors] = await Promise.all([
      doctorModel.countDocuments({}).lean(),
      doctorModel.aggregate(pipeline).exec(),
    ]);

    return res.status(200).json({
      message: "Doctors retrieved successfully",
      success: true,
      statusCode: 200,
      totalDoctors: total,
      totalPages: Math.ceil(total / Number(size || 21)),
      doctors,
    });
  }

  static async getDoctorById(req: Request, res: Response, next: NextFunction) {
    const { doctorId } = req.params;

    const doctor = await doctorModel.findById(doctorId);
    if (!doctor) {
      return next(new CustomError("Doctor not found", 404));
    }

    return res.status(200).json({
      message: "Doctor retrieved successfully",
      success: true,
      statusCode: 200,
      doctor,
    });
  }
}
