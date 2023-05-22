import mongoose, { Types } from "mongoose";
import { Constant } from "../../constants";
import { BaseRepository } from "../BaseRepository";
import { PostModel } from "./post.model";
import { IPost } from "./post.types";

export class PostRepository extends BaseRepository<IPost, typeof PostModel> {
  constructor() {
    super(PostModel, "updated_at", { updated_at: -1 });
  }

  createPost = async (data: Pick<IPost, "title" | "text">) => {
    const post = await this._model.create(data);
    return post;
  };

  getPost =async (id: any) => {
    const data = await this._model.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id)
        }
      },
      {
        $lookup: {
          from: 'comments',
          localField: '_id',
          foreignField: 'post_id',
          as: 'comments'
        }
      }
    ])

    return data;
  }

  index = async ({
    where = {},
    attributes = this.attributes,

    sort = this.sort,
    pageNumber = Constant.DEFAULT_PAGE_NUMBER,
    pageSize = Constant.DEFAULT_PAGE_SIZE,
  }): Promise<any> => {
    let offset,
      limit,
      totalPage = 0,
      hasNextPage = false;

    const count = await this._model.find(where).countDocuments();

    //calculate pagination.
    totalPage =
      count % pageSize === 0 ? count / pageSize : Math.ceil(count / pageSize);
    offset = (pageNumber - 1) * pageSize;
    limit = pageNumber * pageSize;
    if (limit < count) hasNextPage = true;

    // todo use aggregation and $facet query to execute all calculation in single query.
    const data = await this._model
      .find(where)
      .select(attributes)
      .sort(sort)
      .skip(offset)
      .limit(limit)
      .populate("created_by", "_id first_name last_name");

    return {
      data,
      page: {
        hasNextPage,
        count,
        currentPage: pageNumber,
        totalPage,
      },
    };
  };
}
