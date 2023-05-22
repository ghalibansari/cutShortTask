import Joi from "joi";
import mongoose from "mongoose";
import { Errors } from "../constants";

export const idValidate = (value: string, helper: any) => {
  if (!mongoose.Types.ObjectId.isValid(value))
    return helper.message("Invalid query id.");
  return true;
};

export abstract class BaseValidation {
  static readonly password_regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;

  protected static JOI_PASSWORD_VALIDATION = function (
    message: string = Errors.PASSWORD
  ) {
    return Joi.string()
      .min(8)
      .max(50)
      .regex(BaseValidation.password_regex)
      .required()
      .error(new Error(message));
  };

  static readonly index = Joi.object({
    where: Joi.object(),
    attributes: Joi.array().items(Joi.string().required()),
    pageNumber: Joi.number()
      .min(1)
      .max(999)
      .error(new Error("Invalid pageNumber")),
    pageSize: Joi.number()
      .min(1)
      .max(1000)
      .error(new Error("Invalid pageSize")),
    rangeFilters: Joi.string().error(new Error("Invalid Query rangeFilters")),
    order: Joi.array().items(Joi.string()).error(new Error("Invalid sort")),
    search: Joi.string().min(3).max(55).error(new Error("Invalid search")),
  });

  static readonly attributes = Joi.object({
    attributes: Joi.array().items(Joi.string().required()),
  });

  static readonly findById = Joi.object({
    id: Joi.string().custom(idValidate),
  });

  static readonly delete_reason = Joi.object({
    delete_reason: Joi.string().required().max(250),
  });
}
