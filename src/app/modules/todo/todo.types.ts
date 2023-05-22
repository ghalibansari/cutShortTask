import { Types } from "mongoose";
import { IUser } from "../user/user.types";



export enum TodoStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
}

export interface ITodo {
  _id: Types.ObjectId;
  title: string;
  description: string;
  status: TodoStatus;
  created_by: IUser["_id"];
  created_at: Date;
  updated_by: IUser["_id"];
  updated_at: Date;
  deleted_by?: IUser["_id"];
  deleted_at?: Date;
}
