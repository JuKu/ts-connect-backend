/**
 * This middleware is responsible to check the authentication of users
 * which uses this API.
 * If the user is not authenticated, an error 401 is sended.
 *
 * @author Justin Kuenzel
 */
import {Request, Response} from "express";
import {IniConfig} from "../config/iniconfig";
const jwt = require("jsonwebtoken");

const jwtSecretKey: string = IniConfig.parseFile(
    CONFIG_DIR + "apiserver.cfg",
).jwtSecretKey;

if (jwtSecretKey === undefined || jwtSecretKey.length == 0) {
  logger.error("jwt secret key not found");
  process.exit(1);
}

const verifyToken = (req: Request, res: Response, next: () => any) => {
  const token =
    // eslint-disable-next-line max-len
    req.body.token || req.query.token || req.headers["x-access-token"] || req.headers["Authorization"];

  if (!token) {
    return res.status(401)
        .json({
          errorCode: 401,
          errorMessage: "A token is required for authentication",
        });
  }

  try {
    const decoded = jwt.verify(token, jwtSecretKey);
    // console.log(decoded);
    // @ts-ignore
    req.user = decoded;
  } catch (err) {
    logger.info("invalid token", {"type": "authorization",
      "client-hostname": req.hostname});
    return res.status(401)
        .json({
          errorCode: 401,
          errorMessage: "Invalid token",
        });
  }
  return next();
};

module.exports = verifyToken;
