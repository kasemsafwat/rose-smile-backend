import { Request, Response } from "express";
import serviceModel from "../../../DB/models/service.model";

export const createService = async (req: Request, res: Response) => {
  const { name, description, price } = req.body;
  const service = await serviceModel.create({ name, description, price });
  res.status(201).json(service);
};

export const getServiceById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const service = await serviceModel.findById(id);
  res.status(200).json(service);
};


export const updateService = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, price } = req.body;
  const service = await serviceModel.findByIdAndUpdate(id, { name, description, price });
  res.status(200).json(service);
};

export const deleteService = async (req: Request, res: Response) => {
  const { id } = req.params;
  await serviceModel.findByIdAndDelete(id);
  res.status(200).json({ message: "Service deleted successfully" });
};


export const getServices = async (req: Request, res: Response) => {
  const services = await serviceModel.find();
  res.status(200).json(services);
};




