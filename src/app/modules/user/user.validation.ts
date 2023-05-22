import Joi from "joi";
import { Errors } from "../../constants";
import { BaseValidation } from "../BaseValidation";
import { UserGenderEnum } from "./user.types";

export abstract class UserValidation extends BaseValidation {
  static readonly login = Joi.object({
    email: Joi.string()
      .email()
      .max(50)
      .required()
      .error(new Error(Errors.EMAIL_ID)),
    password: this.JOI_PASSWORD_VALIDATION(),
  });

  static readonly register = Joi.object({
    first_name: Joi.string().min(3).max(20).required(),
    last_name: Joi.string().min(3).max(20).required(),
    gender: Joi.string()
      .required()
      .valid(...Object.values(UserGenderEnum)),
    email: Joi.string().email().required(),
    password: this.JOI_PASSWORD_VALIDATION(),
  });
}
