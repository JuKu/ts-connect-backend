import winston from "winston";
import { Express } from "express-serve-static-core";

declare global {
    // eslint-disable-next-line no-var
    var logger: winston.Logger;
    // eslint-disable-next-line no-var
  var app: Express;
}

export { };
