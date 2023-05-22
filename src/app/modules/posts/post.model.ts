import { model, Schema } from "mongoose";
import { IPost } from "./post.types";

const postSchema = new Schema<IPost>({
  title: { type: String, required: true },
  text: { type: String, required: true },
  created_at: { type: Date, default: () => new Date() },
  created_by: { type: Schema.Types.ObjectId, ref: "user", required: true },
  updated_at: { type: Date, default: () => new Date() },
  updated_by: { type: Schema.Types.ObjectId, ref: "user", required: true },
  deleted_at: { type: Date, default: null },
  deleted_by: { type: Schema.Types.ObjectId, ref: "user", default: null },
});

export const PostModel = model<IPost>("post", postSchema);
