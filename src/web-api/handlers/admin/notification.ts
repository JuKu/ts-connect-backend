import {Request, Response} from "express";
import {hasRole} from "../../../shared/system/middleware/check-role";

// eslint-disable-next-line max-len
// import {FirebaseAdminSDK} from "../../../shared/system/firebase/firebase-admin-sdk";

const {check} = require("express-validator");

/**
 * This module adds an API endpoint to send notification to Firebase Messaging
 * topics.
 *
 * @author Justin Kuenzel
 */
module.exports = async () => {
  // TODO: fix validators
  app.post("/api/admin/topic-notification", [
    check("title").exists().isLength({min: 3}).trim().escape(),
    // check('email').isEmail().normalizeEmail(),
    check("message").exists().isLength({min: 3}).trim().escape(),
    check("targetTopic").exists().isLength({min: 3}).trim().escape(),
    // eslint-disable-next-line max-len
  ], authCheck, hasRole(["super-admin", "super-developer"]), async (req: Request, res: Response) => {
    // @ts-ignore
    const userid: number = req.user.userid;
    // @ts-ignore
    const username: string = req.user.username;

    const title = req.body.title;
    const message = req.body.message;
    const topicName = req.body.targetTopic;

    logger.info("create notification to topic '" + topicName + "'",
        {"authorID": userid, "author": username, "title": title,
          "message": message});

    try {
      // TODO: uncomment this later
      /* FirebaseAdminSDK.sendTopicNotification(topicName,
          title, message);*/
    } catch (err) {
      logger.warn("error while sending topic notification: " + err,
          {
            "targetTopic": topicName,
            "title": title,
            "message": message,
            "userid": userid,
            "username": username,
          });
    }

    return res.status(200)
        .json({
          "success": true,
        });
  });
};
