import { ITodo } from "./todo.types";

import { model, Schema } from "mongoose";

const todoSchema = new Schema<ITodo>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, required: true },

  created_at: { type: Date, default: () => new Date() },
  created_by: { type: Schema.Types.ObjectId, ref: "user", required: true },
  updated_at: { type: Date, default: () => new Date() },
  updated_by: { type: Schema.Types.ObjectId, ref: "user", required: true },
  deleted_at: { type: Date, default: null },
  deleted_by: { type: Schema.Types.ObjectId, ref: "user", default: null },
});

export const TodoModel = model<ITodo>("todos", todoSchema);
export default TodoModel;
