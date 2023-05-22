import { Application, Request, Response } from "express";
import { Types } from "mongoose";
import { Messages } from "../../constants";
import { AuthGuard, JsonResponse, TryCatch, validateBody } from "../../helper";
import { BaseController } from "../BaseController";
import { CommentRepository } from "../comments/comment.repository";
import { CommentValidation } from "../comments/comment.validation";
import { PostModel } from "./post.model";
import { PostRepository } from "./post.repository";
import { IPost } from "./post.types";
import { PostValidation } from "./post.validation";

export class PostController extends BaseController<
  IPost,
  typeof PostModel,
  PostRepository
> {
  constructor(private commentRepo = new CommentRepository()) {
    super("post", new PostRepository(), "_id", { updated_at: -1 });

    this.init();
  }

  register = (express: Application) =>
    express.use(`/api/v1/${this.url}`, this.router);

  init() {
    this.router.get("/", AuthGuard, TryCatch.tryCatchGlobe(this.index));

    this.router.post(
      "/",
      AuthGuard,
      validateBody(PostValidation.add),
      TryCatch.tryCatchGlobe(this.createPost)
    );

    this.router.put(
      "/:id",
      AuthGuard,
      validateBody(PostValidation.add),
      TryCatch.tryCatchGlobe(this.updateByIdBC)
    );

    this.router.delete(
      "/:id",
      AuthGuard,
      TryCatch.tryCatchGlobe(this.deleteByIdBC)
    );

    this.router.get("/:id", AuthGuard, TryCatch.tryCatchGlobe(this.getPost));
    this.router.post(
      "/:id/comment",
      AuthGuard,
      validateBody(CommentValidation.add),
      TryCatch.tryCatchGlobe(this.createComment)
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

  createPost = async (req: Request, res: Response) => {
    const {
      body,
      user: { _id },
    }: any = req;
    const data = await this.repo.createOneBR({
      newData: body,
      created_by: _id,
    });
    res.locals = {
      status: true,
      message: Messages.CREATE_SUCCESSFUL,
      data,
    };
    return await JsonResponse.jsonSuccess(req, res, `createOneBC`);
  };

  updatePost = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const {
      body,
      user: { _id },
    }: any = req;

    const { modifiedCount: data } = await this.repo.updateBulkBR({
      where: { _id: id as unknown as Types.ObjectId, created_by: _id },
      newData: { ...body },
      updated_by: _id,
    });

    res.locals = {
      status: !!data,
      message: !!data ? Messages.UPDATE_SUCCESSFUL : Messages.UPDATE_FAILED,
    };
    return await JsonResponse.jsonSuccess(req, res, `updateOneBC`);
  };

  getPost = async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = await this.repo.getPost(id);

    res.locals = {
      status: true,
      data,
      message: Messages.FETCH_SUCCESSFUL,
    };
    return await JsonResponse.jsonSuccess(req, res, `{this.url}.indexBC`);
  };

  createComment = async (req: Request, res: Response) => {
    const {
      body,
      user: { _id },
    }: any = req;

    const { id } = req.params;
    const data = await this.commentRepo.createOneBR({
      newData: { ...body, post_id: id },
      created_by: _id,
    });
    res.locals = {
      status: true,
      message: Messages.CREATE_SUCCESSFUL,
      data,
    };
    return await JsonResponse.jsonSuccess(req, res, `createOneBC`);
  };
}
