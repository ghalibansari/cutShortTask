import { Request, Response } from "express";
import { v4 } from "uuid";
import { JsonResponse } from "./JsonResponse";

export class TryCatch {
  /**
   * The tryCatchGlobe
   */
  static tryCatchGlobe(handler: Function) {
    return async (req: Request, res: Response, next: Function) => {
      try {
        await handler(req, res);
      } catch (err: any) {
        const { body, originalUrl, method, query, params }: any = req;
        const userId = (req as any).user?.user_id || v4();
        const updated_by = userId;
        const created_by = userId;
        const [, , , module] = originalUrl.split("/");
        // console.log(err);

        res.locals.message = err?.message ?? err;

        await JsonResponse.jsonError(req, res);
      }
    };
  }
}
