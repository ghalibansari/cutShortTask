import Joi from "joi";
import { BaseValidation } from "../BaseValidation";
import { ITodo, TodoStatus } from "./todo.types";

export abstract class TodoValidation extends BaseValidation {
  static readonly add = Joi.object<ITodo>({
    title: Joi.string().min(3).max(100).required(),
    description: Joi.string().min(3).max(100),
  });

  static readonly statusToggle = Joi.object<ITodo>({
    status: Joi.string()
      .valid(TodoStatus.PENDING, TodoStatus.COMPLETED)
      .required(),
  });
}
