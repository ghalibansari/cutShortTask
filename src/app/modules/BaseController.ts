import { Application, Request, Response, Router } from "express";
import mongoose, { Model, Types } from "mongoose";
import { Constant, Messages } from "../constants";
import { JsonResponse } from "../helper";
import { BaseRepository } from "./BaseRepository";
import { BaseValidation } from "./BaseValidation";

export abstract class BaseController<
  T extends { _id: Types.ObjectId; updated_at: Date },
  U extends Model<T>,
  R extends BaseRepository<T, U> = BaseRepository<T, U>
> {
  protected router: Router;
  protected readonly pageNumber = Constant.DEFAULT_PAGE_NUMBER;

  abstract register(express: Application): Application;
  abstract init(): void;

  public constructor(
    protected readonly url: any,
    protected readonly repo: R,
    public readonly attributes = repo.attributes,
    public readonly sort = repo.sort,
    protected readonly pageSize = Constant.DEFAULT_PAGE_SIZE
  ) {
    this.router = Router();
  }

  findAllBC = async (req: Request, res: Response): Promise<void> => {
    const {
      query: { attributes = this.attributes },
    }: any = req;
    const data = await this.repo.findAllBR({
      attributes,
    });
    res.locals = { status: true, data, message: Messages.FETCH_SUCCESSFUL };
    return await JsonResponse.jsonSuccess(req, res, `{this.url}.findByIdBC`);
  };

  indexBC = async (req: Request, res: Response): Promise<void> => {
    await BaseValidation.index.validateAsync(req.query);

    let {
      where,
      attributes,
      order: sort,
      pageSize,
      pageNumber,
    }: any = req.query;

    where ||= {};
    sort ||= this.sort;
    attributes ||= this.attributes;
    pageNumber ||= this.pageNumber;
    pageSize ||= this.pageSize;

    const { page, data } = await this.repo.indexBR({
      where,
      attributes,
      sort,
      pageNumber,
      pageSize,
    });
    res.locals = {
      status: true,
      page,
      data,
      message: Messages.FETCH_SUCCESSFUL,
    };
    return await JsonResponse.jsonSuccess(req, res, `{this.url}.indexBC`);
  };

  findByIdBC = async (req: Request, res: Response): Promise<void> => {
    await BaseValidation.findById.validateAsync(req.params);
    const {
      params: { id },
      query: { attributes = this.attributes },
    }: any = req;
    const data = await this.repo.findByIdBR({
      id,
      attributes,
    });
    res.locals = { status: !!data, data, message: Messages.FETCH_SUCCESSFUL };
    return await JsonResponse.jsonSuccess(req, res, `{this.url}.findByIdBC`);
  };

  createOneBC = async (req: Request, res: Response): Promise<void> => {
    const {
      body,
      user: { _id: user_id },
    }: any = req;
    const data = await this.repo.createOneBR({
      newData: body,
      created_by: user_id,
    });
    res.locals = { status: true, data, message: Messages.CREATE_SUCCESSFUL };
    return await JsonResponse.jsonSuccess(req, res, `{this.url}.createOneBC`);
  };

  updateByIdBC = async (req: Request, res: Response): Promise<void> => {
    await BaseValidation.findById.validateAsync(req.params);
    const {
      body,
      params: { id },
      user: { _id: user_id },
    }: any = req;
    const { modifiedCount } = await this.repo.updateBulkBR({
      where: { _id: new mongoose.Types.ObjectId(id) } as any,
      newData: body,
      updated_by: user_id,
    });

    res.locals = {
      code: !!modifiedCount ? 200 : 400,
      status: !!modifiedCount,
      data: modifiedCount,
      message: !!modifiedCount
        ? Messages.UPDATE_SUCCESSFUL
        : Messages.UPDATE_FAILED,
    };
    return await JsonResponse.jsonSuccess(req, res, `{this.url}.updateByIdkBC`);
  };

  deleteByIdBC = async (req: Request, res: Response): Promise<void> => {
    await BaseValidation.findById.validateAsync(req.params);

    const {
      params: { id },
      user: { _id: user_id },
    }: any = req;

    const { modifiedCount: data } = await this.repo.deleteByIdBR({
      _id: id,
      deleted_by: user_id,
    });
    res.locals = {
      code: !!data ? 200 : 400,
      data,
      status: !!data,
      message: !!data ? Messages.DELETE_SUCCESSFUL : Messages.DELETE_FAILED,
    };
    return await JsonResponse.jsonSuccess(req, res, `{this.url}.deleteByIdBC`);
  };
}
