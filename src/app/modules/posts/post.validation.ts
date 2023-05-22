import Joi from "joi";
import { BaseValidation } from "../BaseValidation";
import { IPost } from "./post.types";

export abstract class PostValidation extends BaseValidation {
  static readonly add = Joi.object<IPost>({
    title: Joi.string().min(3).max(100).required(),
    text: Joi.string().min(3).max(500).required(),
  });
}

