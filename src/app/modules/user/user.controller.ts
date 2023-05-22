import { Application, Request, Response } from "express";
import { Messages } from "../../constants";
import { AuthGuard, JsonResponse, TryCatch, validateBody } from "../../helper";
import { BaseController } from "../BaseController";
import { UserModel } from "./user.model";
import { UserRepository } from "./user.repository";
import { IUser } from "./user.types";
import { UserValidation } from "./user.validation";

export class UserController extends BaseController<
  IUser,
  typeof UserModel,
  UserRepository
> {
  constructor() {
    super("user", new UserRepository(), "_id first_name last_name email", {
      updated_at: -1,
    });

    this.init();
  }

  register = (express: Application) =>
    express.use(`/api/v1/${this.url}`, this.router);

  init() {
    this.router.post(
      "/login",
      validateBody(UserValidation.login),
      TryCatch.tryCatchGlobe(this.login)
    );

    this.router.post(
      "/sign-up",
      validateBody(UserValidation.register),
      TryCatch.tryCatchGlobe(this.signUp)
    );

    this.router.get("/:id", AuthGuard, TryCatch.tryCatchGlobe(this.findByIdBC));
  }

  signUp = async (req: Request, res: Response): Promise<void> => {
    const { body } = req as any;
    const data = await this.repo.signUp(body);
    res.locals = {
      data,
      status: true,
      message: Messages.CREATE_SUCCESSFUL,
    };

    return await JsonResponse.jsonSuccess(req, res, `test`);
  };

  login = async (req: Request, res: Response): Promise<void> => {
    const { body } = req as any;

    const data = await this.repo.login(body);
    res.locals = {
      data,
      status: true,
      message: Messages.CREATE_SUCCESSFUL,
    };

    return await JsonResponse.jsonSuccess(req, res, `test`);
  };
}
