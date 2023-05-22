import { Types } from "mongoose";
import { IUser } from "../user/user.types";
import { IPost } from "../posts/post.types";

export interface IComment {
	_id: Types.ObjectId;
	post_id: IPost["_id"];
	title: string;
	content: string;
	created_by: IUser["_id"];
	created_at: Date;
	updated_by: IUser["_id"];
	updated_at: Date;
}
