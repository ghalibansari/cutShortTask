import { Types } from "mongoose";
import { Constant } from "../../constants";
import { BaseRepository } from "../BaseRepository";
import { CommentModel } from "./comment.model";
import { IComment } from "./comment.types";

export class CommentRepository extends BaseRepository<
	IComment,
	typeof CommentModel
> {
	constructor() {
		super(CommentModel, "updated_at", { updated_at: -1 });
	}

	createComment = async (data: Pick<IComment, "title" | "content">) => {
		const post = await this._model.create(data);
		return post;
	};
}
