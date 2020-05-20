// the response is given back by using the res object or the next() function
// we are using next function to pass the credintials between request processing

import {Request, Response, NextFunction} from "express";

// we 'll start by writing custom logging middleware.

export function loggingMiddleware(req:Request, res:Response, next:NextFunction){
    console.log(`request received to url: ${req.url} with method: ${req.method}`);
    next();
}