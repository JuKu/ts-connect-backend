/**
 * This middleware is responsible to check if the user has the required
 * permission to use this API endpoint.
 * If the user does not have the role, an error 403 forbidden is send.
 *
 * @author Justin Kuenzel
 */
import {Request, Response} from "express";
import User, {IUser} from "../model/user";

export const hasPermission = function(requiredPermission: String) {
  return async (req: Request, res: Response, next: () => any) => {
    // @ts-ignore
    if (!req.user) {
      logger.warn("user object does not exists on request object." +
        " This means that the auth-middleware was not called before",
      {"type": "error"});
      return res.status(500)
          .json({
            errorCode: 500,
            errorMessage: "Internal Server Error",
          });
    }

    // @ts-ignore
    const userid: Number = req.user.userid;

    try {
      // @ts-ignore
      const user1: IUser = await User.findById(userid);

      if (!user1) {
        throw new Error("user not found: " + userid);
      }

      const permissions: Array<String> = user1.globalPermissions;

      if (permissions !== undefined && permissions.length > 0 &&
        permissions.find((str: String) => str == requiredPermission)) {
        // user has the permission to access this page
      } else {
        // user does not have the required role to access this page
        logger.info("user does not have access to reach the api endpoint",
            {
              "type": "authentication",
              "userid": userid,
              "endpoint": req.route.endpoint,
              "requiredPermission": requiredPermission,
            });

        return res.status(403)
            .json({
              errorCode: 403,
              errorMessage: "You do not have the permission to access this" +
              " API endpoint",
              requiredPermission: requiredPermission,
            });
      }
    } catch (err) {
      logger.info("Error occurred while check for permission", {
        "type": "authorization",
        "client-hostname": req.hostname,
        "error": err,
        "errorMessage": err.message,
        "stacktrace": err.stacktrace,
        "userid": userid,
      });
      return res.status(500)
          .json({
            errorCode: 500,
            errorMessage: "Internal Server Error",
          });
    }
    return next();
  };
};
