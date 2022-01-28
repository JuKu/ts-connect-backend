import { Request, Response } from "express";
import { rmSync } from "fs";
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { check } = require('express-validator');

module.exports = () => {
    logger.info("register endpoint /api/login");
    
app.post("/api/login", [
    check('username').isLength({ min: 3 }).trim().escape(),
    //check('email').isEmail().normalizeEmail(),
    check('password').isLength({min: 3}).trim().escape()
  ], (req: Request, res: Response) => {
    if (req.body == null || req.body.username === undefined) {
        logger.warn("login body is empty");
        res.status(400);
        res.json({errorCode: 400, errorMessage: "requested parameters not found"});
        return;
    }

    if (req.body.password === undefined) {
        logger.warn("password field was missing", {hostname: req.hostname});
        res.status(400);
        res.json({errorCode: 400, errorMessage: "password field was missing"});
    }

    //sanitize input
    //let sanitizer = require('sanitize')();

    //let username = sanitizer.value(req.body.username, 'String');
    //let password = sanitizer.value(req.body.password, 'String');

    logger.info(req.body.username + " attempted login");
    let passwordHash = crypto.createHash('sha256').update(req.body.password).digest('hex');
    /*db.get("SELECT * FROM users WHERE (username, password) = (?, ?)", [req.body.username, password], function(err, row) {
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

    //TODO: add code here
});
}
