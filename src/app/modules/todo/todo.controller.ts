import { Application, Request, Response } from "express";
import { Types } from "mongoose";
import { Messages } from "../../constants";
import {
  AuthGuard,
  JsonResponse,
  TryCatch,
  validateBody,
  validateParams,
  validateQuery,
} from "../../helper";
import { BaseController } from "../BaseController";
import { BaseValidation } from "../BaseValidation";
import { TodoModel } from "./todo.model";
import { TodoRepository } from "./todo.repository";
import { ITodo, TodoStatus } from "./todo.types";
import { TodoValidation } from "./todo.validation";

export class TodoController extends BaseController<
  ITodo,
  typeof TodoModel,
  TodoRepository
> {
  constructor() {
    super(
      "todo",
      new TodoRepository(),
      "_id title description status created_by updated_by",
      { updated_at: -1 }
    );

    this.init();
  }

  register = (express: Application) =>
    express.use(`/api/v1/${this.url}`, this.router);

  init() {
    this.router.get("/", AuthGuard, TryCatch.tryCatchGlobe(this.index));
    this.router.get("/:id", AuthGuard, TryCatch.tryCatchGlobe(this.findByIdBC));
    this.router.post(
      "/",
      AuthGuard,
      validateBody(TodoValidation.add),
      TryCatch.tryCatchGlobe(this.createOne)
    );
    this.router.put(
      "/:id",
      AuthGuard,
      validateBody(TodoValidation.add),
      TryCatch.tryCatchGlobe(this.updateByIdBC)
    );
    this.router.put(
      "/:id/status",
      AuthGuard,
      validateParams(BaseValidation.findById),
      validateQuery(TodoValidation.statusToggle),
      TryCatch.tryCatchGlobe(this.statusToggle)
    );
    this.router.delete(
      "/:id",
      AuthGuard,
      TryCatch.tryCatchGlobe(this.deleteByIdBC)
    );
  }

  index = async (req: Request, res: Response): Promise<void> => {
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

    const { page, data } = await this.repo.index({
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

  createOne = async (req: Request, res: Response): Promise<void> => {
    const {
      body,
      user: { _id },
    }: any = req;

    const data = await this.repo.createOneBR({
      newData: { ...body, status: TodoStatus.PENDING },
      created_by: _id,
    });

    res.locals = {
      status: true,
      message: Messages.CREATE_SUCCESSFUL,
      data,
    };

    return await JsonResponse.jsonSuccess(req, res, `createOneBC`);
  };

  statusToggle = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const {
      user: { _id: user_id },
    } = req as any;
    let { status } = req.query as any;
    const _id = id.split(",") as unknown as Types.ObjectId;

    const { modifiedCount } = await this.repo.updateBulkBR({
      where: { _id, created_by: user_id },
      newData: { status },
      updated_by: user_id,
    });

    res.locals = {
      code: !!modifiedCount ? 200 : 400,
      status: !!modifiedCount,
      message: modifiedCount
        ? Messages.UPDATE_SUCCESSFUL
        : Messages.UPDATE_FAILED,
      data: modifiedCount,
    };
    return await JsonResponse.jsonSuccess(req, res, `statusToggle`);
  };
}
