/**
 * This middleware is responsible to check if the user has the required role
 * to use this API endpoint.
 * If the user does not have the role, an error 403 forbidden is send.
 *
 * @author Justin Kuenzel
 */
import {Request, Response} from "express";

export const hasRole = function(requiredRoles: Array<String>) {
  return (req: Request, res: Response, next: () => any) => {
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

    try {
      // @ts-ignore
      const roles: Array<String> = req.user.globalRoles;

      // check, if user has one of this roles
      let hasRole: boolean = false;

      requiredRoles.forEach((requiredRole: string) => {
        if (roles.find((str: string) => str == requiredRole)) {
          // user has the permission to access this page
          hasRole = true;
        }
      });

      if (hasRole) {
        // user has the permission to access this page
      } else {
        // user does not have the required role to access this page
        return res.status(403)
            .json({
              errorCode: 403,
              errorMessage: "You do not have the permission to access this" +
              " API endpoint",
              requiredRoles: requiredRoles,
            });
      }
    } catch (err) {
      logger.info("Error occurred while check for role",
          {"type": "authorization",
            "client-hostname": req.hostname,
            "error": err});
      return res.status(401)
          .json({
            errorCode: 401,
            errorMessage: "Invalid token",
          });
    }
    return next();
  };
};

