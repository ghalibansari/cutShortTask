import { model, Schema } from "mongoose";
import { IComment } from "./comment.types";

const commentSchema = new Schema<IComment>({
	post_id: { type: Schema.Types.ObjectId, ref: "post", required: true },
	title: { type: String, required: true },
	content: { type: String, required: true },
	created_at: { type: Date, default: () => new Date() },
	created_by: { type: Schema.Types.ObjectId, ref: "user", required: true },
	updated_at: { type: Date, default: () => new Date() },
	updated_by: { type: Schema.Types.ObjectId, ref: "user", required: true },
});

export const CommentModel = model<IComment>("comment", commentSchema);
