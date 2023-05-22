import { NextFunction, Request, Response } from "express";
import { ClientSession, startSession } from "mongoose";
import { RequestWithTransaction } from "../interfaces/Request";

export class MongooseTransaction {
  //Todo convert all methods to static method.

  static startTransactionNew = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    //@ts-expect-error
    req.mongoSessionNew = await startSession();
    next();
  };

  endTransactionNew = async (
    req: RequestWithTransaction,
    _res: Response,
    _next?: NextFunction
    //@ts-expect-error
  ): Promise<void> => await req?.mongoSessionNew?.endSession();

  startTransaction = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const mongoSession = await startSession();
    await mongoSession.startTransaction();
    //@ts-expect-error
    req.mongoSession = mongoSession;
    next();
  };

  commitTransaction = async (
    req: RequestWithTransaction,
    _res: Response,
    _next?: NextFunction
  ): Promise<void> => {
    if (req?.mongoSession) {
      await req.mongoSession.commitTransaction();
      await req.mongoSession.endSession();
      //@ts-expect-error
      req.mongoSession = undefined;
    }
  };

  abortTransaction = async (
    req: RequestWithTransaction,
    _res: Response,
    _next?: NextFunction
  ): Promise<void> => {
    if (req?.mongoSession) {
      await req.mongoSession.abortTransaction();
      await req.mongoSession.endSession();
      //@ts-expect-error
      req.mongoSession = undefined;
    }
  };

  startTransactionManually = async (): Promise<ClientSession> => {
    const mongoSession = await startSession();
    mongoSession.startTransaction();
    return mongoSession;
  };

  commitTransactionManually = async (
    mongoSession: ClientSession
  ): Promise<void> => {
    await mongoSession.commitTransaction();
    await mongoSession.endSession();
  };

  abortTransactionManually = async (
    mongoSession: ClientSession
  ): Promise<void> => {
    await mongoSession.abortTransaction();
    await mongoSession.endSession();
  };
}
