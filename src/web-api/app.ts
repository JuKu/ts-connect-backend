'use strict'

import express from "express";
import {Logger} from "../shared/system/logger/logger";
var fs = require('fs');

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
console.info(`ROOT_PATH: ${ROOT_PATH}`);

const SERVER_VERSION = JSON.parse(fs.readFileSync(ROOT_PATH + '/../../package.json', 'utf8')).version;

//initialize the logger
Logger.init();

// create a new express application
const app = express();

//register express nmiddleware
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded());

// define a route handler for the default home page
app.get( "/", ( req, res ) => {
  res.send( "This is the public API of the ts-connect-app." );
} );

// TODO: add api endpoints here
app.get("/api/version", (req, res) => {
  // get the current version from package.json
  //import {version} from "../../package.json";
  //const pjson = require("./package.json");

  const version = {
    "backend-version": SERVER_VERSION,//pjson.version,
  };
  res.json(version);
});

// start the Express server
app.listen( PORT, () => {
  console.log( `server started at http://${ HOST }:${ PORT }` );
} );
