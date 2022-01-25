/**
 * this is the main file for the web-api application.
 * 
 * @author Justin Kuenzel
 * 
 * @copyright 2022, Justin Kuenzel, JuKuSoft
 */

//get the server host and port
const HOST = process.env.HOST || '127.0.0.1';
const PORT = process.env.PORT || 4000;

const express = require('express');
const app = express();
const port = 3000;