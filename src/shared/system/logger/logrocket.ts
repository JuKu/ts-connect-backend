import LogRocket from "logrocket";

const CONFIG_DIR = process.env.CONFIG_DIR || __dirname + "/../../../../config/";

// import and initialize LogRocket
// eslint-disable-next-line max-len
const logRocketToken = require(CONFIG_DIR + "logrocket")["authToken"];
console.log("LogRocket token: " + logRocketToken);
LogRocket.init(logRocketToken);

// This is an example script - don't forget to change it!
LogRocket.identify("-1", {
  "name": "System",
  "email": "root@example.com",

  // Add your own custom user variables here, ie:
  "subscriptionType": "pro",
});
