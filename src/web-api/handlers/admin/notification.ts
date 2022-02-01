import {Request, Response} from "express";
import {hasRole} from "../../../shared/system/middleware/check-role";

const {check} = require("express-validator");

/**
 * This module adds an API endpoint to send notification to Firebase Messaging
 * topics.
 *
 * @author Justin Kuenzel
 */
module.exports = async () => {
  app.post("/api/login", [
    check("username").isLength({min: 3}).trim().escape(),
    // check('email').isEmail().normalizeEmail(),
    check("password").isLength({min: 3}).trim().escape(),
    // eslint-disable-next-line max-len
  ], authCheck, hasRole(["super-admin", "super-developer"]), async (req: Request, res: Response) => {
    // @ts-ignore
    const userid: Number = req.user.userid;
    // @ts-ignore
    const username: String = req.user.username;

    const topicName = "all";

    logger.info("create notification to topic '" + topicName + "'",
        {"authorID": userid, "author": username});
  });
};
