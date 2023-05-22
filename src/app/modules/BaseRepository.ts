import { Model, Types } from "mongoose";
import { Constant } from "../constants";
import {
  TCreateOneBR,
  TDeleteByIdBR,
  TFindByIdBR,
  TFindOneBR,
  TUpdateBulkBR,
} from "./baseTypes";

export class BaseRepository<
  T extends { _id: Types.ObjectId; updated_at: Date },
  U extends Model<T>
> {
  public readonly primary_key: string = "_id";

  protected readonly pageNumber = Constant.DEFAULT_PAGE_NUMBER;

  protected constructor(
    public readonly _model: U,
    public readonly attributes: string = "updated_at",
    public readonly sort: Record<keyof T, 1 | -1> | Record<"updated_at", -1> = {
      updated_at: -1,
    },
    public readonly include: object[] = []
  ) {}

  indexBR = async ({
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
      .limit(limit);

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

  findAllBR = async ({
    where = {},
    attributes = this.attributes,
    order = this.sort,
    offset = 0,
    limit = 10,
  }) => {
    //@ts-expect-error
    where["deleted_at"] === undefined &&
      //@ts-expect-error
      (where["deleted_at"] = null);

    return this._model.find(where, attributes, {
      sort: order,
      offset,
      limit,
    });
  };

  findOneBR = async ({
    where = {},
    attributes = this.attributes,
  }: TFindOneBR<T>) => {
    where["deleted_at"] === undefined && (where["deleted_at"] = null);
    return this._model.findOne(where, attributes);
  };

  findByIdBR = async ({
    id,
    attributes = this.attributes,
  }: // include = this.include,
  TFindByIdBR): Promise<U | null> => {
    return this._model.findOne(
      { _id: (id as unknown as string).split(",") },
      attributes
    );
  };

  //   createBulkBR = async ({
  //     newData,
  //     created_by,
  //     transaction,
  //   }: TCreateBulkBR<T>): Promise<U[]> => {
  //     for (let i = 0; i < newData.length; i++) {
  //       //@ts-expect-error
  //       newData[i].created_by = created_by;
  //       //@ts-expect-error
  //       newData[i].updated_by = created_by;
  //     }
  //     return await this._model.bulkCreate(
  //       newData as unknown as CreationAttributes<U>[],
  //       { transaction }
  //     );
  //   };

  createOneBR = async ({
    newData,
    created_by,
  }: TCreateOneBR<T>): Promise<T> => {
    return await this._model.create({
      ...newData,
      created_by,
      updated_by: created_by,
    });
  };

  updateBulkBR = async ({ where, newData, updated_by }: TUpdateBulkBR<T>) => {
    //@ts-expect-error
    newData.updated_by = updated_by;
    const data = await this._model.updateMany(where, newData);
    return data;
  };

  deleteByIdBR = async ({ _id, deleted_by }: TDeleteByIdBR) => {
    return this._model.updateOne(
      {
        _id: (_id as unknown as string).split(","),
        created_by: deleted_by,
      },
      {
        deleted_by: deleted_by,
        deleted_at: new Date(),
      } as any
    );
  };
}
