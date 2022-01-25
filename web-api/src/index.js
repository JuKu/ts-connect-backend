import express from 'express';

/**
 * this is the main file for the web-api application.
 * 
 * @author Justin Kuenzel
 * 
 * @copyright 2022, Justin Kuenzel, JuKuSoft
 */

//get the server host and port
const HOST = process.env.HOST || '127.0.0.1';
const PORT = process.env.PORT || 3000;

//create a new express application
const app = express();

// define a route handler for the default home page
app.get( "/", ( req, res ) => {
    res.send( "Hello world!" );
} );

// start the Express server
app.listen( PORT, () => {
    console.log( `server started at http://${ HOST }:${ PORT }` );
} );