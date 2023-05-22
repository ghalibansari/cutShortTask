import { ClientSession, Types } from "mongoose";

import { IUser } from "./user/user.types";

export type NonEmptyArray<T> = [T, ...T[]];

export type TFindByIdBR = {
  id: Types.ObjectId;
  attributes?: string;
};

export type TFindOneBR<T> = {
  where: Partial<T> | any;
  attributes?: string;
  include?: object[];
};

export type TCreateOneBR<T> = {
  newData: Omit<T, "created_by" | "updated_by" | "deleted_by">;
  created_by: IUser["_id"];
  transaction?: ClientSession;
};

export type TCreateBulkBR<T> = {
  newData: Omit<T, "created_by" | "updated_by" | "deleted_by">[];
  created_by: IUser["_id"];
};

export type TUpdateByIdBR<T> = {
  id: string;
  newData: Partial<T>;
  updated_by: IUser["_id"];
};

export type TUpdateOneBR<T> = {
  where: object;
  newData: Partial<T>;
  updated_by: IUser["_id"];
};

export type TUpdateBulkBR<T> = {
  where: Partial<T>;
  newData: Omit<Partial<T>, "created_by" | "updated_by" | "deleted_by">;
  updated_by: IUser["_id"];
};

export type TDeleteByIdBR = {
  _id: any;
  deleted_by: any;
};

export type TDeleteOneBR = {
  where: Object;
  deleted_by: IUser["_id"];
  delete_reason: string;
};

export type TDeleteBulkBR<T> = {
  where: Partial<T>;
  deleted_by: IUser["_id"];
  delete_reason: string;
};

export type TRestoreByIdBR = {
  id: string;
};

export type TRestoreBulkBR<T> = {
  where: Partial<T>;
};

export interface ICounter {
  key: string;
  value: string;
}

export interface IBCommon {
  is_active?: boolean;
  delete_reason?: string;
  created_by: IUser["_id"];
  updated_by: IUser["_id"];
  deleted_by?: IUser["_id"];
}

export interface IMCommon {
  created_at: IUser["_id"];
  updated_at: IUser["_id"];
  deleted_at?: IUser["_id"];
}
