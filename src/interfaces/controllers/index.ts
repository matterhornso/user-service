import { MongoConnection } from '../../infrastructure/MongoConnection'

const mongoConnection = new MongoConnection();

enum ActivityType {
  READ = "read",
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
}

export {
  mongoConnection,
  ActivityType
}