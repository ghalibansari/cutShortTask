import { Constant } from "./../../constants";
import { BaseRepository } from "../BaseRepository";
import { TodoModel } from "./todo.model";
import { ITodo, TodoStatus } from "./todo.types";
import { Types } from "mongoose";

export class TodoRepository extends BaseRepository<ITodo, typeof TodoModel> {
  constructor() {
    super(TodoModel, "_id title description status ", { updated_at: -1 }, []);
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

  f = async () => {
    await this._model.updateOne(
      {},
      {
        $set: {
          title: "test",
          created_by: "new Types.ObjectId()",
        },
      }
    );
  };
}
