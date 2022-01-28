import winston from 'winston';

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
}

const level = () => {
  const env = process.env.NODE_ENV || 'development'
  const isDevelopment = env === 'development'
  return isDevelopment ? 'debug' : 'info'
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
            level: level(),//'info',
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
              }),
              transports.File({ filename: 'logs/all.log' })
            ]
          });
    }

    public static logger() {
        return this.LOGGER;
    }

    public static debug(msg: String) {
      this.logger().debug(msg);
    }

    public static info(msg: String) {
      this.logger().info(msg);
    }

    public static http(msg: String) {
      this.logger().http(msg);
    }

    public static warn(msg: String) {
      this.logger().warn(msg);
    }

    public static error(msg: String) {
      this.logger().error(msg);
    }

}