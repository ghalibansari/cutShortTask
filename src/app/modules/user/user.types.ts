import { Types } from "mongoose";

export enum UserGenderEnum {
  male = "male",
  female = "female",
  others = "others",
}

export interface IUser {
  _id: Types.ObjectId;
  first_name: string;
  last_name: string;
  email: string;
  gender: UserGenderEnum;
  password: string;

  created_by: IUser["_id"];
  created_at: Date;
  updated_by: IUser["_id"];
  updated_at: Date;
  deleted_by?: IUser["_id"];
  deleted_at?: Date;
}
