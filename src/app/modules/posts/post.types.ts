import { Types } from "mongoose";
import { IUser } from "../user/user.types";

export interface IPost {
  _id: Types.ObjectId;
  title: string;
  text: string;
  image: string;
  created_by: IUser["_id"];
  created_at: Date;
  updated_by: IUser["_id"];
  updated_at: Date;
  deleted_by?: IUser["_id"];
  deleted_at?: Date;
}
