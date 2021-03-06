"use strict";

import "../shared/system/logger/logrocket";

import express, {NextFunction, Request, Response} from "express";
import helmet from "helmet";
import fs from "fs";
import winston from "winston";
import {Express} from "express-serve-static-core";
import {Mongoose} from "mongoose";
import User from "../shared/system/model/user";
import {randomUUID} from "crypto";
import {hasRole} from "../shared/system/middleware/check-role";
import {hasPermission} from "../shared/system/middleware/check-permission";
import {RedisClientType} from "@node-redis/client";
import LogRocket from "logrocket";
import * as http from "http";

const bcrypt = require("bcryptjs");
const compression = require("compression");

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

const REDIS_HOST = process.env.REDIS_HOST || "127.0.0.1";
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const REDIS_PASSWORD = process.env.REDIS_PASSWORD || "";

declare global {
  // eslint-disable-next-line no-var
  var logger: winston.Logger;
  // eslint-disable-next-line no-var
  var app: Express;
  // eslint-disable-next-line no-var
  var mongoose: Mongoose;
  // eslint-disable-next-line no-var
  var ROOT_PATH: string;
  // eslint-disable-next-line no-var
  var authCheck: (req: Request, res: Response, next: () => any) => any;
  // eslint-disable-next-line no-var
  var redisClient: RedisClientType;
  // eslint-disable-next-line no-var
  var CONFIG_DIR: string;
}

const CONFIG_DIR = process.env.CONFIG_DIR || __dirname + "/../../config/";

LogRocket.captureMessage("system startup");

const ROOT_PATH = __dirname;
// console.info(`ROOT_PATH: ${ROOT_PATH}`);

const SERVER_VERSION = JSON.parse(fs.readFileSync(
    ROOT_PATH + "/../../package.json", "utf8"),
).version;

// require("../shared/system/logger/logger");

// initialize logger
// console.info("initialize winston logger...");
const {createLogger, loggers, format, transports} = require("winston");

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
global.CONFIG_DIR = CONFIG_DIR;

logger.info("ROOT_PATH: " + ROOT_PATH);
logger.info("CONFIG_DIR: " + CONFIG_DIR);

/*
* the main method for the web-api.
*/
// eslint-disable-next-line require-jsdoc
export default async function main() {
  const appType = process.env.APP_TYPE || "web-api";

  try {
    if (appType == "web-api") {
      logger.info("start web-api");
      return await startWebAPI();
    } else if (appType == "worker") {
      logger.info("start worker-node");
      await startWorkerNode();
    } else {
      logger.error("unknown application type: " + appType);
      console.error("unknown application type: " + appType);
      process.exit(1);
    }
  } catch (e) {
    logger.error("Error catched on top-level: " + e.message, {
      "error": e,
      "errorMessage": e.message || "",
      "stacktrace": e.stacktrace || "",
    });
    // eslint-disable-next-line max-len
    console.error("error catched on top-level: " + e.message + ", stacktrace:\n" + e.stacktrace);

    // @ts-ignore
    if (process.env["TEST_MODE"] !== "true" &&
      process.env["NODE_ENV"] !== "test") {
      process.exit(1);
    }
  }
};

// eslint-disable-next-line require-jsdoc
async function connectToServices() {
  // connect to MongoDB database
  logger.info("connect to MongoDB...", {"type": "startup"});
  // eslint-disable-next-line max-len
  global.mongoose = await require("../shared/system/database/mongodb-client").connect();

  // register schemas (not models!)
  await require("../shared/system/model/import-models");

  // connect to redis server
  logger.info("connect to redis server", {"type": "startup"});

  // TODO: add code here
}

let appServer: http.Server;

// eslint-disable-next-line require-jsdoc
export async function startWebAPI(): Promise<http.Server | Express> {
  await connectToServices();

  // TODO: extract this code into other class
  // create user admin, if no other user exists
  await (async () => {
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
          // eslint-disable-next-line max-len
          logger.info("created user 'admin' with password 'admin' successfully");
        });
      }
    } catch (e) {
      logger.warn("Error occurred while creating admin user: " + e,
          {"type": "startup", "error": e});
    }
  })();

  logger.info("initialize express...", {"type": "startup"});

  // create a new express application
  global.app = express();

  // register express nmiddleware
  app.use(helmet());
  app.use(express.static("public"));
  app.use(express.json());
  app.use(express.urlencoded({extended: true}));
  // app.use(compression);

  const auth = require(ROOT_PATH + "/../shared/system/middleware/auth");
  global.authCheck = auth;

  // initialize firebase admin sdk
  // eslint-disable-next-line max-len
  const firebaseAdminConfig = require("./../shared/system/firebase/admin-config");

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
  app.get("/api/secured-endpoint", authCheck, hasRole(["super-admin"]),
      hasPermission("super-admin"), (req: Request, res: Response) => {
        return res.status(200)
            .json({
              "success": true,
            });
      });

  // register handlers
  // require("./handlers/login")();

  // register all handlers from "handlers"
  const normalizedPath = require("path").join(__dirname, "handlers");

  const glob = require("glob");
  const path = require("path");

  glob.sync(__dirname + "/handlers/**/*.*")
      .forEach(function(file: string) {
        if (file.endsWith(".ts") || file.endsWith(".js")) {
          logger.info("load handler: " + file, {"type": "startup"});
          require(path.resolve(file))();
        } else {
          logger.info("skip handler: " + file, {"type": "startup"});
        }
      });

  /* require("fs").readdirSync(normalizedPath).forEach(function(file: string) {
    logger.debug("load handler: " + file, {"type": "startup"});
    require("./handlers/" + file);
  });*/

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

  /**
   * This is the error handler for the routes.
   * @param {any} err error
   * @param {Request} req request
   * @param {Response} res response
   * @param {NextFunction} next next middleware
   */
  function logErrors(err: { stack: any; }, req: Request, res: Response,
      next: NextFunction) {
    // generate an unique request ID, so that the user can give the ID to the
    // support and they can say, whats going wrong.
    const reqUUID = randomUUID();

    logger.error("Internal server error! " + err.stack,
        {
          "type": "crash", "crash-prevented": true, "error": err,
          "request-path": req.path,
          "reqUUID": reqUUID,
        });
    console.error(err.stack);

    // get error 500
    res.status(500).json({
      success: "false",
      message: "Internal server error",
      errorCode: 500,
      errorMessage: "Internal Server Error",
      error: {
        statusCode: 500,
        message: "Internal Server Error. Please contact the developer to " +
          "fix this issue. Request ID: " + reqUUID,
        reqUUID: reqUUID,
      },
    });
  }

  app.use(logErrors);

  // @ts-ignore
  if (global.DO_NOT_START_SERVER !== undefined) {
    return app;
  }

  // start the Express server
  logger.info("start server now...", {"type": "startup"});
  return app.listen(PORT, () => {
    // console.log( `server started at http://${ HOST }:${ PORT }` );
    logger.info(`server started at http://${HOST}:${PORT}`, {"type": "startup"});
  });
}

// eslint-disable-next-line require-jsdoc
async function startWorkerNode() {
  await connectToServices();

  // TODO: add code here to start the notifier service and worker node
}

// @ts-ignore
if (typeof DO_NOT_START_SERVER === "undefined") {
  main().then((r: any) => console.log("server started"));
}
