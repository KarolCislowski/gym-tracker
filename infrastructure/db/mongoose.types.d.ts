export interface MongooseConnectionConfig {
  uri: string;
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  authSource?: string;
}

export interface MongooseDatabaseConfig extends MongooseConnectionConfig {
  databaseName: string;
  serverUri: string;
}
