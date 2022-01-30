import {Mongoose} from "mongoose";
import {IniConfig} from "../config/iniconfig";
import {connect} from "mongoose";

/**
 * This class is responsible for the connection(s) to the MongoDB database.
 *
 * @author Justin Kuenzel
 */
class MongoDBClient {
  private readonly configFile: String;
  private mongoose: Mongoose;

  /**
   * the constructor.
   * @constructor
   * @param {Map<String, String>} configFile the configuration for the
   * mongodb client
   */
  constructor(configFile: string) {
    if (configFile === undefined) {
      throw new Error("no configuration file path is set");
    }

    this.configFile = configFile;
  }

  /**
   * connect to the MongoDB server.
   */
  async connect() {
    if (this.configFile === undefined) {
      throw new Error("configFile is null");
    }

    // read configuration file first
    const config: any = IniConfig.parseFile(this.configFile);
    const hostname = config.host;
    const port = config.port;
    const database = config.database;
    const username = config.username;
    const password = config.password;
    const retryWrites = config.retryWrites;
    const w = config.w;

    this.mongoose = require("mongoose");
    // const { MongoClient } = require('mongodb');
    const uri = "mongodb+srv://" + username + ":" + password + "@" + hostname + "/" + database + "?retryWrites=" + retryWrites + "&w=" + w + "";
    /* const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    client.connect(err => {
      const collection = client.db("test").collection("devices");
      // perform actions on the collection object
      client.close();
    });*/

    const mongoose = this.mongoose;

    logger.info("connect to MongoDB: " + hostname, {"type": "startup"});

    try {
      await mongoose.connect(uri);
    } catch (error) {
      // eslint-disable-next-line max-len
      logger.error("Catched error: ", {"type": "error", "message": error.message, "stack": error.stack}, error);
      process.exit(1);
    }

    /**
     * connect to database.
     */
    async function run(): Promise<void> {
      //logger.info("connect to MongoDB: " + hostname, {"type": "startup"});

      // 4. Connect to MongoDB
      await setTimeout(function() {
        //this.mongoose.connect(uri);
        // mongoose.connect('mongodb://localhost:27017/myapp');
      }, 10000);
    }

    // open connection
    try {
      await run();
    } catch (error) {
      // eslint-disable-next-line max-len
      logger.error("Catched error: ", {"type": "error", "message": error.message, "stack": error.stack}, error);
      process.exit(1);
    }

    logger.info("connected to MongoDB database", {"type": "startup"});

    return this.mongoose;
  }

  /**
   * disconnect from the MongoDB server.
   */
  disconnect() {
    this.mongoose.disconnect();
  }
}

module.exports = new MongoDBClient(ROOT_PATH + "/../../config/mongodb.cfg");
