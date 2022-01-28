"use strict";

import express from "express";
import fs from "fs";
import {HttpApiServer} from "../shared/system/server/apiserver";
import {Request, Response} from "express";

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
//console.info(`ROOT_PATH: ${ROOT_PATH}`);

const SERVER_VERSION = JSON.parse(fs.readFileSync(
    ROOT_PATH + "/../../package.json", "utf8"),
).version;

// require("../shared/system/logger/logger");

// initialize logger
//console.info("initialize winston logger...");
const {createLogger, loggers, format, transports} = require("winston");
import winston, {exitOnError} from "winston";
import { Express } from "express-serve-static-core";

declare global {
  // eslint-disable-next-line no-var
  var logger: winston.Logger;
  // eslint-disable-next-line no-var
  var app: Express;
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

logger.info(`ROOT_PATH: ${ROOT_PATH}`, {"root-path": ROOT_PATH, "type": "startup"});

logger.info("initialize express...", {"type": "startup"});

// create a new express application
global.app = express();

// register express nmiddleware
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// const apiServer: HttpApiServer = new HttpApiServer(app);

// define a route handler for the default home page
app.get( "/", ( req: Request, res: Response ) => {
  res.send( "This is the public API of the ts-connect-app." );
} );

// TODO: add api endpoints here
app.get("/api/version",  (req, res) => {
  // get the current version from package.json
  // import {version} from "../../package.json";
  // const pjson = require("./package.json");

  const version = {
    "backend-version": SERVER_VERSION, // pjson.version,
  };
  res.json(version);
});

//register handlers
require("./handlers/login")();

// start the Express server
app.listen( PORT, () => {
  // console.log( `server started at http://${ HOST }:${ PORT }` );
  logger.info( `server started at http://${ HOST }:${ PORT }`, {"type": "startup"} );
} );
