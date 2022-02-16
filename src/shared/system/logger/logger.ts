import winston from "winston";
import {IniConfig} from "../config/iniconfig";

console.error("do not use loggers.ts anymore!");
process.exit(1);

const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "white",
};

winston.addColors(colors);

/**
 * get the instance of winston logger.
 * @return {winston.Logger} instance of winston logger
 */
function getLogger() {
  const {loggers} = require("winston");
  return loggers.get("default-logger");
}

/**
 * the logger class.
 *
 * @author Justin Kuenzel
 */
export class Logger {
  // TODO: fix type
  protected LOGGER: any;
  protected static isInitialized: boolean = false;
  protected static singletonInstance: Logger;

  /**
   * private constructor, so noone can create an instance of this object.
   * @constructor
   */
  public Logger() {
    // this.init();
  }

  /**
   * get the global instance of winston logger.
   * @return {winston.Logger} the global instance of logger
   */
  public static getLogger(): winston.Logger {
    return global.logger;
  }

  /**
  * initialize the logger with the ELK format.
  * @return {Logger} the logger instance
  */
  public init(): Logger {
    console.info("initialize logger...");

    const {createLogger, loggers, format, transports} = require("winston");
    const logConfig = this.getConfig();

    this.LOGGER = createLogger(logConfig);

    // this.LOGGER.info("test");

    Logger.isInitialized = true;

    loggers.add("default-logger", logConfig);

    return this;
  }

  /**
   * get the logger configuration.
   * @return {any} winston logger configuration
   */
  public getConfig() {
    const {format, transports} = require("winston");
    const logConfig = {
      level: this.level(), // 'info',
      levels: winston.config.npm.levels,
      format: format.combine(
          format.timestamp({
            format: "YYYY-MM-DD'T'HH:mm:ss.SSSZ",
          }),
          // format.errors({stack: true}),
          format.json(),
      ),
      defaultMeta: {service: "web-api"},
      transports: [
        new transports.Console(),
        new transports.File({
          filename: "logs/error.log",
          level: "warn",
        }),
        new transports.File({filename: "logs/all.log"}),
      ],
      // handleExceptions: true,
      exitOnError: false,
    };
    return logConfig;
  }

  /**
   * get the current logger level from configuration of environmental
   * variable.
   * @return {String} log level
   */
  public level = () => {
    const config = IniConfig.parseFile("./config/logger.cfg");

    const loggerLevel = process.env.LOGGER_LEVEL || config.level;
    return loggerLevel;
  };

  /**
   * write a debug log.
   * @param {String} msg log message
   * @param {Map<String, String>} metaData additional meta to be used by ELK
   */
  public debug(msg: string, metaData?: Map<String, any>) {
    this.checkInitialized();
    getLogger().debug(msg, metaData);
  }

  /**
   * write a info log.
   * @param {String} msg log message
   * @param {Map<String, String>} metaData additional meta to be used by ELK
   */
  public info(msg: string, metaData?: Map<String, any>) {
    this.checkInitialized();
    if (getLogger() == null) {
      console.error("logger is null");
      process.exit(1);
    }
    getLogger().info(msg, metaData);
  }

  /**
   * write a http log.
   * @param {String} msg log message
   * @param {Map<String, String>} metaData additional meta to be used by ELK
   */
  public http(msg: string, metaData?: Map<String, any>) {
    this.checkInitialized();
    getLogger().http(msg, metaData);
  }

  /**
   * write a warn log.
   * @param {String} msg log message
   * @param {Map<String, String>} metaData additional meta to be used by ELK
   */
  public warn(msg: string, metaData?: Map<String, any>) {
    this.checkInitialized();
    getLogger().warn(msg, metaData);
  }

  /**
   * write an error log.
   * @param {String} msg log message
   * @param {Map<String, String>} metaData additional meta to be used by ELK
   */
  public error(msg: string, metaData?: Map<String, any>) {
    this.checkInitialized();
    getLogger().error(msg, metaData);
  }

  /**
   * check if the logger was initialized before.
   */
  protected checkInitialized() {
    if (getLogger() == null) {
      console.error("The logger is not initialized yet");
      process.exit(1);
    }
  }
}

import "setimmediate";

// initialize the logger, see also:
// https://javascript.plainenglish.io/typescript-and-global-variables-in-node-js-59c4bf40cb31
// global.logger = new Logger();
// global.logger.init();
const {loggers} = require("winston");
loggers.add("default-logger", new Logger().getConfig());
// console.log(new Logger().getConfig());

const logger1 = winston.createLogger(new Logger().getConfig());
winston.add(logger1);

/* const files = new winston.transports.File({ filename: 'logfile.log' });
const myconsole = new winston.transports.Console();

winston.add(myconsole);
winston.add(files);*/

declare global {
  // eslint-disable-next-line no-var
  var logger: winston.Logger;
}

global.logger = logger1;
