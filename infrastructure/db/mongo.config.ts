const DEFAULT_CORE_DATABASE_NAME = 'Core';

import type {
  MongooseConnectionConfig,
  MongooseDatabaseConfig,
} from './mongoose.types';

/**
 * Reads and validates the shared MongoDB settings used by Mongoose.
 */
export function getMongooseConnectionConfig(): MongooseConnectionConfig {
  const uri = process.env.MONGODB_URI?.trim();

  if (uri) {
    return {
      uri,
    };
  }

  const host = getRequiredEnv('MONGODB_HOST');
  const port = Number.parseInt(getRequiredEnv('MONGODB_PORT'), 10);
  const username = getRequiredEnv('MONGODB_USERNAME');
  const password = getRequiredEnv('MONGODB_PASSWORD');
  const authSource = process.env.MONGODB_AUTH_SOURCE?.trim() || 'admin';

  if (Number.isNaN(port)) {
    throw new Error(
      'Environment variable MONGODB_PORT must be a valid number.',
    );
  }

  return {
    uri: buildStandardMongoUri({
      host,
      port,
      username,
      password,
      authSource,
    }),
    host,
    port,
    username,
    password,
    authSource,
  };
}

/**
 * Returns configuration for the shared Core database.
 */
export function getCoreDatabaseConfig(): MongooseDatabaseConfig {
  return createMongooseDatabaseConfig(DEFAULT_CORE_DATABASE_NAME);
}

/**
 * Returns configuration for a tenant database resolved after user login.
 */
export function getTenantDatabaseConfig(
  tenantDatabaseName: string,
): MongooseDatabaseConfig {
  if (!tenantDatabaseName.trim()) {
    throw new Error('Tenant database name must not be empty.');
  }

  return createMongooseDatabaseConfig(tenantDatabaseName);
}

/**
 * Returns the server URI without binding the connection to a single database.
 */
export function getMongooseServerUri(): string {
  return buildMongooseServerUri(getMongooseConnectionConfig());
}

function createMongooseDatabaseConfig(
  databaseName: string,
): MongooseDatabaseConfig {
  const connection = getMongooseConnectionConfig();

  return {
    ...connection,
    databaseName,
    serverUri: buildMongooseServerUri(connection),
  };
}

/**
 * Builds a MongoDB server URI that Mongoose can reuse with different db names.
 */
function buildMongooseServerUri(
  config: MongooseConnectionConfig,
): string {
  if (config.uri) {
    return config.uri;
  }

  if (
    !config.host ||
    typeof config.port !== 'number' ||
    !config.username ||
    !config.password
  ) {
    throw new Error('MongoDB connection config is incomplete.');
  }

  return buildStandardMongoUri({
    host: config.host,
    port: config.port,
    username: config.username,
    password: config.password,
    authSource: config.authSource || 'admin',
  });
}

function buildStandardMongoUri(config: {
  host: string;
  port: number;
  username: string;
  password: string;
  authSource: string;
}): string {
  const username = encodeURIComponent(config.username);
  const password = encodeURIComponent(config.password);
  const authSource = encodeURIComponent(config.authSource);

  return `mongodb://${username}:${password}@${config.host}:${config.port}/?authSource=${authSource}`;
}

function getRequiredEnv(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}
