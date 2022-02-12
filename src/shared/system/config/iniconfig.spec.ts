import {IniConfig} from "./iniconfig";
import winston, {format, transports} from "winston";

describe("IniConfig", () => {
  beforeAll(() => {
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

  it("should be able to load a configuration file", async () => {
    const configInstance: IniConfig = new IniConfig();

    const config = IniConfig.parseFile(__dirname +
      "/../../../../config/apiserver.example.cfg");

    expect(config).not.toBeNull();
    expect(config).toHaveProperty("host");
    expect(config).toHaveProperty("port");
    expect(config).toHaveProperty("jwtSecretKey");
    expect(config).toHaveProperty("firebaseServiceAccount");

    expect(config["host"]).toEqual("0.0.0.0");
    expect(config["port"]).toEqual("3000");
  });
});
