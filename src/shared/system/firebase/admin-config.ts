import {IniConfig} from "../config/iniconfig";

const admin = require("firebase-admin");

const firebaseServiceAccount = require(ROOT_PATH +
  "/../../config/serviceAccountKey.json");

const firebaseConfig = IniConfig.parseFile(
    ROOT_PATH + "/../../config/apiserver.cfg",
);

logger.info("initialize Firebase Admin SDK...",
    {
      "type": "startup",
      "databaseURL": firebaseConfig.firebaseServiceAccount,
    });
admin.initializeApp({
  credential: admin.credential.cert(firebaseServiceAccount),
  databaseURL: firebaseConfig.firebaseServiceAccount,
});

export const firebaseAdmin = admin;
module.exports.admin = admin;
