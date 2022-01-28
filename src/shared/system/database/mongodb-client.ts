import { Mongoose } from "mongoose";
import { IniConfig } from "../config/iniconfig";
import { connect } from 'mongoose';

/**
 * This class is responsible for the connection(s) to the MongoDB database.
 *
 * @author Justin Kuenzel
 */
class MongoDBClient {
  private configFile: String;
  private mongoose: Mongoose;

  /**
   * the constructor.
   * @constructor
   * @param {Map<String, String>} config the configuration for the
   * mongodb client
   */
  MongoDBClient(configFile: string) {
    this.configFile = configFile;
  }

  /**
   * connect to the MongoDB server.
   */
  async connect() {
    //read configuration file first
    let config: any = IniConfig.parseFile(this.configFile);
    let hostname = config.host;
    let port = config.port;
    let database = config.database;
    let username = config.username;
    let password = config.password;
    let retryWrites = config.retryWrites;
    let w = config.w;

    this.mongoose = require("mongoose");
    //const { MongoClient } = require('mongodb');
    const uri = "mongodb+srv://" + username + ":" + password + "@" + hostname + "/" + database + "?retryWrites=" + retryWrites + "&w=" + w + "";
    /*const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    client.connect(err => {
      const collection = client.db("test").collection("devices");
      // perform actions on the collection object
      client.close();
    });*/

    async function run(): Promise<void> {
      // 4. Connect to MongoDB
      this.mongoose = await connect(uri);
    }

    //open connection
    await run();

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

module.exports = new MongoDBClient();