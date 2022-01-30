import winston from "winston";
import { Express } from "express-serve-static-core";
import { Mongoose } from "mongoose";
import {Request, Response} from "express";

declare global {
    // eslint-disable-next-line no-var
    var logger: winston.Logger;
    // eslint-disable-next-line no-var
    var app: Express;
    // eslint-disable-next-line no-var
    var mongoose: Mongoose;
    // eslint-disable-next-line no-var
    var ROOT_PATH: String;
    // eslint-disable-next-line no-var
    var authCheck: (req: Request, res: Response, next: () => any) => any;
}

export { };
