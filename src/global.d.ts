import winston from "winston";
import { Express } from "express-serve-static-core";
import { Mongoose } from "mongoose";

declare global {
    // eslint-disable-next-line no-var
    var logger: winston.Logger;
    // eslint-disable-next-line no-var
    var app: Express;
    // eslint-disable-next-line no-var
    var mongoose: Mongoose;
    // eslint-disable-next-line no-var
    var ROOT_PATH: String;
}

export { };
