import { Logger } from "../logger/logger";

export class IniConfig {

    public IniConfig() {
        'use strict'
    }

    public static parseFile(configFilePath: String): any {
        Logger.info("parse config file: ")
        const fs = require('fs');
        const ini = require('ini');
        const config = ini.parse(fs.readFileSync(configFilePath, 'utf-8'));

        return config;
    }

}
