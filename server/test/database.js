const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

mongoose.Promise = global.Promise;

let mongoServer;
class Connection {
  async connect() {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }

  async disconnect() {
    await mongoose.disconnect();
    await mongoServer.stop();
  }

  async cleanup() {
    const collections = mongoose.connection.collections;
    for (const keys in collections) {
      await collections[keys].deleteMany({});
    }
  }
}

const connect = new Connection();
module.exports = connect;
