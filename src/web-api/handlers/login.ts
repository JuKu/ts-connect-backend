import {Request, Response} from "express";
import {rmSync} from "fs";
import User from "../../shared/system/model/user";
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {check} = require("express-validator");
const bcrypt = require("bcryptjs");
import {v4 as uuidv4} from "uuid";

module.exports = async () => {
  logger.info("register endpoint /api/login", {"type": "register-endpoint"});

  app.post("/api/login", [
    check("username").isLength({min: 3}).trim().escape(),
    // check('email').isEmail().normalizeEmail(),
    check("password").isLength({min: 3}).trim().escape(),
  ], async (req: Request, res: Response) => {
    if (req.body == null || req.body.username === undefined) {
      logger.warn("login body is empty");
      res.status(400);
      res.json({
        errorCode: 400,
        errorMessage: "requested parameters not found",
      });
      return;
    }

    if (req.body.password === undefined) {
      logger.warn("password field was missing", {hostname: req.hostname});
      res.status(400);
      res.json({errorCode: 400, errorMessage: "password field was missing"});
      return;
    }

    try {
      logger.info(req.body.username + " attempted login", {"type": "request"});

      // hash password
      const encryptedPassword = await bcrypt.hash(req.body.password, 10);

      // Validate if user exist in our database
      const user = await User.findOne({username: req.body.username});

      // const user = await User.
      // check, if user exists in database
      /* db.get("SELECT * FROM users WHERE (username, password) = (?, ?)", [req.body.username, password], function(err, row) {
        if(row != undefined ) {
          var payload = {
            username: req.body.username,
          };

          var token = jwt.sign(payload, KEY, {algorithm: 'HS256', expiresIn: "15d"});
          console.log("Success");
          res.send(token);
        } else {
          console.error("Failure");
          res.status(401)
          res.send("There's no user matching that");
        }
      });*/

      res.send("OK");

      // TODO: add code here
    } catch (err) {
      const errorUUID = uuidv4();

      logger.warn("error while login user",
          {"type": "error", "error": err, "username": req.body.username,
            "errorUUID": errorUUID});
      res.status(500);
      res.json({
        errorCode: 500,
        errorUUID: errorUUID,
        errorMessage: "Internal server error while login",
      });
    }
  });
};
