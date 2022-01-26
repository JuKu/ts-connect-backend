class MongoDBClient {

    private config: Map<String, String>;
    private mongoose: any;

    MongoDBClient(config: Map<String, String>) {
        this.config = config;
    }

    connect() {
        this.mongoose = require('mongoose');
        this.mongoose.connect('mongodb://localhost/my_database', {useNewUrlParser: true});
    }

    disconnect() {
        this.mongoose.disconnect();
    }

}