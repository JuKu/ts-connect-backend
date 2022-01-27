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
            transports: [new transports.Console()]
          });
    }

    public static logger() {
        return this.LOGGER;
    }

}