import fs from "fs";

/**
 * This class is responsible for parsing ini-like configuration files.
 *
 * @author Justin Kuenzel
 */
export class IniConfig {
  /**
  * default constructor.
  * @constructor
  */
  public IniConfig() {
    "use strict";
  }

  /**
   * parse a ini-like configuration file.
   * @param {String} configFilePath path to configuration file to parse
   * @return {any} configuration values as json object
   */
  public static parseFile(configFilePath: String): any {
    // logger.info("parse config file: " + configFilePath);
    const fs = require("fs");
    const ini = require("ini");

    // check, that config file exists
    if (!fs.existsSync(configFilePath)) {
      console.log("config file does not exists: " + configFilePath);
      logger.error("configuration file does not exists", {
        "config_path": configFilePath,
      });

      process.exit(1);
    }

    const config = ini.parse(fs.readFileSync(configFilePath, "utf-8"));

    return config;
  }
}
