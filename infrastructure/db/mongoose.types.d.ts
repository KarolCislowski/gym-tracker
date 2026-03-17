export interface MongooseConnectionConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  authSource: string;
}

export interface MongooseDatabaseConfig extends MongooseConnectionConfig {
  databaseName: string;
  serverUri: string;
}
