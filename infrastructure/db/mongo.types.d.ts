export interface MongoConnectionConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  authSource: string;
}

export interface MongoDatabaseConfig extends MongoConnectionConfig {
  databaseName: string;
  connectionString: string;
}
