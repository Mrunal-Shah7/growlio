import { NextFunction, Request, Response } from "express";
import errorHandler from "../utils/utils.js";
import { controllerType } from "../types/type.js";

export const errorMiddleware = (
    error:errorHandler,
    req:Request,
    res:Response,
    next:NextFunction
)=>{
    error.message = error.message || "There is Some Error";
    error.statusCode = error.statusCode||  500;
    if(error.name === "CastError")  error.message = "Invalid ID"

    if (res.headersSent) {
        return next(error); // Pass the error to the next error-handling middleware
    }
      res.status(error.statusCode).json({
        success:false,
        message : error.message
    })
}

// export const TryCatch =  (func :controllerType )=>(req:Request,res:Response,next:NextFunction)=>{
//     return Promise.resolve(func(req,res,next)).catch(next)
// }
export const TryCatch =
  (func: controllerType) =>
  (req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(func(req, res, next)).catch(next);
  };