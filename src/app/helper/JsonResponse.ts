import { Request, Response } from "express";
import { ISuccessResponse } from "./IApiResponse";

export class JsonResponse {
  static async jsonSuccess(
    req: Request,
    res: Response,
    method_name?: string
  ): Promise<void> {
    const obj: ISuccessResponse = {
      status: res.locals.status ?? false, //Todo make default false...
      message: res.locals.message,
      errorCode: res.locals.errorCode,
      page: res.locals.page,
      header: res.locals.header,
      data: res.locals.data ?? null,
    };

    // await DBTransaction.commitTransaction(req, res);

    res.status(res.locals.code ?? 200).send(obj); //Todo add constraint here before sending in typescript
  }

  /**
   * jsonError
   */
  static async jsonError(
    req: Request,
    res: Response,
    method_name?: string
  ): Promise<void> {
    const obj: ISuccessResponse = {
      status: false,
      message:
        res.locals.message || "Something went wrong, please contact to admin.",
      data: res.locals.data ?? null,
    };

    // await DBTransaction.abortTransaction(req, res)

    if (!res.locals.code) res.status(400);
    else res.status(res.locals.code);
    res.send(obj);
  }
}
