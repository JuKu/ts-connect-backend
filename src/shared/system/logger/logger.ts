import winston from 'winston';

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
}

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
}

winston.addColors(colors);

export class Logger {

    //TODO: fix type
    static LOGGER: any;

    private Logger() {
        //
    }

    /**
     * initialize the logger with the ELK format.
     */
    public static init() {
        const { createLogger, format, transports } = require('winston');

        const logger = createLogger({
            level: 'debug',
            format: format.combine(
              format.timestamp({
                format: "YYYY-MM-DD'T'HH:mm:ss.SSSZ"
              }),
              format.json()
            ),
            transports: [
              new transports.Console(),
              new transports.File({
                filename: 'logs/error.log',
                level: 'warn',
              })
            ]
          });
    }

    public static logger() {
        return this.LOGGER;
    }

}