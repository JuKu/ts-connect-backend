import {Request, Response} from "express";
import User from "../../shared/system/model/user";
import {v4 as uuidv4} from "uuid";
import {randomUUID} from "crypto";
import {IniConfig} from "../../shared/system/config/iniconfig";

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {check} = require("express-validator");
const bcrypt = require("bcryptjs");

const jwtSecretKey: String = IniConfig.parseFile(
    ROOT_PATH + "/../../config/apiserver.cfg",
).jwtSecretKey;

if (jwtSecretKey === undefined || jwtSecretKey.length == 0) {
  logger.error("jwt secret key not found");
  process.exit(1);
}

module.exports = async () => {
  logger.info("register endpoint /api/login", {"type": "register-endpoint"});

  app.post("/api/login", [
    check("username").isLength({min: 3}).trim().escape(),
    // check('email').isEmail().normalizeEmail(),
    check("password").isLength({min: 3}).trim().escape(),
  ], async (req: Request, res: Response) => {
    const reqUUID = randomUUID();

    if (req.body == null || req.body.username === undefined) {
      logger.warn("login body is empty");
      res.status(400)
          .json({
            errorCode: 400,
            errorMessage: "requested parameters not found",
          });
      return;
    }

    if (req.body.password === undefined) {
      logger.warn("password field was missing", {hostname: req.hostname});
      res.status(400)
          .json({errorCode: 400, errorMessage: "password field was missing"});
      return;
    }

    try {
      logger.info(req.body.username + " attempted login", {"type": "request"});

      // Validate if user exist in our database
      const user = await User.findOne({username: req.body.username});

      if (user) {
        // get salt
        const salt = user.salt;

        // hash given password
        // eslint-disable-next-line max-len
        // const encryptedPassword = await bcrypt.hash(req.body.password + salt, 10);

        if (await bcrypt.compare(req.body.password + salt, user.password)) {
          // password is correct
          logger.info("password correct for user '" + user.username + "'",
              {"type": "login"});

          // Create token
          const token = jwt.sign(
              {user_id: user._id, username: user.username, mail: user.email},
              jwtSecretKey + user.tokenSecret,
              {
                expiresIn: "30d",
              },
          );

          res.status(200)
              .json({
                "success": true,
                "token": token,
              });
          return;
        } else {
          // password is wrong
          res.status(403);
          res.json({
            errorCode: 401,
            errorMessage: "Password wrong",
          });
        }
      } else {
        res.status(404)
            .json({
              errorCode: 404,
              errorMessage: "User not found",
            });
      }

      res.send("OK");

      // TODO: add code here
    } catch (err) {
      const errorUUID = uuidv4();

      logger.warn("error while login user",
          {
            "type": "error", "error": err, "username": req.body.username,
            "errorUUID": errorUUID,
          });
      res.status(500)
          .json({
            errorCode: 500,
            errorUUID: errorUUID,
            errorMessage: "Internal server error while login",
          });
    }
  });
};
