/**
 * This class is responsible for the connection(s) to the MongoDB database.
 *
 * @author Justin Kuenzel
 */
class MongoDBClient {
  private config: Map<String, String>;
  private mongoose: any;

  /**
   * the constructor.
   * @constructor
   * @param {Map<String, String>} config the configuration for the
   * mongodb client
   */
  MongoDBClient(config: Map<String, String>) {
    this.config = config;
  }

  /**
   * connect to the MongoDB server.
   */
  connect() {
    this.mongoose = require("mongoose");
    this.mongoose.connect("mongodb://localhost/my_database", {useNewUrlParser: true});
  }

  /**
   * disconnect from the MongoDB server.
   */
  disconnect() {
    this.mongoose.disconnect();
  }
}
