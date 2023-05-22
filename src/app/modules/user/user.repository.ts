import { compare, genSalt, hash } from "bcrypt";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import { Constant } from "../../constants";
import { BaseRepository } from "../BaseRepository";
import { UserModel } from "./user.model";
import { IUser } from "./user.types";

export class UserRepository extends BaseRepository<IUser, typeof UserModel> {
  constructor() {
    super(UserModel, "_id first_name last_name updated_at", { updated_at: -1 });
  }

  signUp = async (
    data: Pick<
      IUser,
      "email" | "password" | "first_name" | "last_name" | "gender"
    >
  ) => {
    const salt = await genSalt(8);
    data.password = await hash(data.password, salt);

    const user_id = new Types.ObjectId();

    return await this.createOneBR({
      newData: data as any,
      created_by: user_id,
    });
  };

  login = async (data: Pick<IUser, "email" | "password">) => {
    const user = await this.findOneBR({
      where: { email: data.email },
      attributes: "_id email password last_name first_name",
    });

    if (!user) {
      throw new Error("Invalid Email Id");
    }

    const comparePassword = await compare(data.password, user.password);
    if (!comparePassword) {
      throw new Error("Incorrect Password");
    }

    const { _id, email, last_name, first_name } = user;
    const token = jwt.sign({ _id, email }, Constant.jwt_key);

    return { token, user: { _id, email, last_name, first_name } };
  };
}
