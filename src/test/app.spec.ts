"use strict";
import * as http from "http";

/**
* This test verifies, that the server can start.
 *
 * @author Justin Kuenzel
*/
declare global {
  const DO_NOT_START_SERVER = true;
}
// @ts-ignore
global.DO_NOT_START_SERVER = true;
process.env["TEST_MDE"] = "true";

console.log = jest.fn();
console.info = jest.fn();
console.error = jest.fn();

LogRocket.captureMessage = jest.fn();

import main, {startWebAPI} from "../web-api/app";
import supertest from "supertest";
import winston, {format, transports} from "winston";
import {Express} from "express";
import LogRocket from "logrocket";
let requestWithSupertest: supertest.SuperTest<supertest.Test>;

beforeAll(async ()=>{
  const httpServer: http.Server | Express = await startWebAPI();
  requestWithSupertest = supertest(httpServer);

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
});

describe("User Endpoints", () => {
  it("GET /api/version should get the current version", async () => {
    const res = await requestWithSupertest.get("/api/version");
    expect(res.status).toEqual(200);
    // expect(res.type).toEqual(expect.stringContaining("json"));
    // expect(res.body).toHaveProperty("version");
  });
});
