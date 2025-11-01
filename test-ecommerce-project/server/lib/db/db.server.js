import { MongoMemoryServer } from "mongodb-memory-server";
const mongod = await MongoMemoryServer.create();
const uri = mongod.getUri();

console.log("DB URI: ", uri);

export default uri;
