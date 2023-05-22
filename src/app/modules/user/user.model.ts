import { model, Schema } from "mongoose";
import { IUser } from "./user.types";

const userSchema = new Schema<IUser>({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  gender: { type: String, required: true },
  password: { type: String, required: true },

  created_at: { type: Date, default: () => new Date() },
  created_by: { type: Schema.Types.ObjectId, ref: "user", required: true },
  updated_at: { type: Date, default: () => new Date() },
  updated_by: { type: Schema.Types.ObjectId, ref: "user", required: true },
  deleted_at: { type: Date, default: null },
  deleted_by: { type: Schema.Types.ObjectId, ref: "user", default: null },
});

export const UserModel = model<IUser>("user", userSchema);
