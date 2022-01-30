"use strict";

import express, {Request, Response} from "express";
import fs from "fs";
import winston from "winston";
import {Express} from "express-serve-static-core";
import {Mongoose} from "mongoose";
import User, {IUser} from "../shared/system/model/user";
import {randomUUID} from "crypto";
import {hasRole} from "../shared/system/middleware/check-role";
import {hasPermission} from "../shared/system/middleware/check-permission";
const bcrypt = require("bcryptjs");

/**
 * this is the main file for the web-api application.
 *
 * @author Justin Kuenzel
 *
 * @copyright 2022, Justin Kuenzel, JuKuSoft
 */

// get the server host and port
const HOST = process.env.HOST || "127.0.0.1";
const PORT = process.env.PORT || 3000;

const ROOT_PATH = __dirname;
// console.info(`ROOT_PATH: ${ROOT_PATH}`);

const SERVER_VERSION = JSON.parse(fs.readFileSync(
    ROOT_PATH + "/../../package.json", "utf8"),
).version;

// require("../shared/system/logger/logger");

// initialize logger
// console.info("initialize winston logger...");
const {createLogger, loggers, format, transports} = require("winston");

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

global.logger = winston.createLogger({
  level: "info",
  levels: winston.config.npm.levels,
  format: format.combine(
      winston.format.timestamp({
      // format: "YYYY-MM-DD'T'HH:mm:ss.SSSZ",
      }),
      format.errors({stack: true}),
      winston.format.json(),
  ),
  defaultMeta: {service: "web-api"},
  transports: [
    new transports.Console(),
    new transports.File({
      filename: "logs/error.log",
      level: "warn",
    }),
    new transports.File({filename: "logs/all.log"}),
    // new winston.transports.Console({ format: winston.format.simple() })
  ],
  exitOnError: false,
});

logger.info(`ROOT_PATH: ${ROOT_PATH}`, {
  "root-path": ROOT_PATH,
  "type": "startup",
});

global.ROOT_PATH = ROOT_PATH;

// connect to MongoDB database
logger.info("connect to MongoDB...", {"type": "startup"});
// eslint-disable-next-line max-len
global.mongoose = require("../shared/system/database/mongodb-client").connect();

// register schemas (not models!)
require("../shared/system/model/import-models");

// TODO: extract this code into other class
// create user admin, if no other user exists
(async () => {
  try {
    if (await User.count() == 0) {
      // generate random salt
      const salt = await bcrypt.hash(randomUUID(), 10);

      const doc = new User({
        username: "admin",
        password: await bcrypt.hash("admin" + salt, 10),
        salt: salt,
        email: "admin@example.com",
        preName: "Admin",
        lastName: "Admin",
        tokenSecret: randomUUID(),
        country: "germany",
        gender: 0,
        globalRoles: ["super-admin", "developer"],
        globalPermissions: ["super-admin"],
      });
      doc.save().then(() => {
        logger.info("created user 'admin' with password 'admin' successfully");
      });
    }
  } catch (e) {
    logger.warn("Error occurred while creating admin user: " + e,
        {"type": "startup", "error": e});
  }
})();

logger.info("initialize express...", {"type": "startup"});

// TODO: create admin user, if not exists or call startup handlers

// create a new express application
global.app = express();

// register express nmiddleware
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const auth = require(ROOT_PATH + "/../shared/system/middleware/auth");
global.authCheck = auth;

// const apiServer: HttpApiServer = new HttpApiServer(app);

// define a route handler for the default home page
app.get("/", (req: Request, res: Response) => {
  res.send("This is the public API of the ts-connect-app.");
});

// TODO: add api endpoints here
app.get("/api/version", (req, res) => {
  // get the current version from package.json
  // import {version} from "../../package.json";
  // const pjson = require("./package.json");

  const version = {
    "backend-version": SERVER_VERSION, // pjson.version,
  };
  res.json(version);
});

// authCheck middleware forces authentication of user
app.get("/api/secured-endpoint", authCheck, hasRole("super-admin"), hasPermission("super-admin"), (req: Request, res: Response) => {
  return res.status(200)
      .json({
        "success": true,
      });
});

// register handlers
require("./handlers/login")();

// This should be the last route else any after it won't work
app.use("*", (req, res) => {
  res.status(404).json({
    success: "false",
    message: "Page not found",
    errorCode: 404,
    errorMessage: "Not Found",
    error: {
      statusCode: 404,
      message: "You reached a route that is not defined on this server",
    },
  });
});

// start the Express server
app.listen(PORT, () => {
  // console.log( `server started at http://${ HOST }:${ PORT }` );
  logger.info(`server started at http://${HOST}:${PORT}`, {"type": "startup"});
});
