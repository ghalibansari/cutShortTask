import Joi from "joi";
import { BaseValidation } from "../BaseValidation";
import { IComment } from "./comment.types";

export abstract class CommentValidation extends BaseValidation {
	static readonly add = Joi.object<IComment>({
		title: Joi.string().min(3).max(100).required(),
		content: Joi.string().min(3).max(500),
	});
}
