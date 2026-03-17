const DEFAULT_CORE_DATABASE_NAME = 'Core';
import type { MongoConnectionConfig, MongoDatabaseConfig } from './mongo.types';

/**
 * Reads and validates the shared MongoDB connection settings.
 * @returns An object containing the MongoDB connection configuration including host, port, credentials, and auth source.
 */
export function getMongoConnectionConfig(): MongoConnectionConfig {
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
    host,
    port,
    username,
    password,
    authSource,
  };
}

/**
 *  @returns Configuration for the shared Core database.
 */
export function getCoreDatabaseConfig(): MongoDatabaseConfig {
  return createMongoDatabaseConfig(DEFAULT_CORE_DATABASE_NAME);
}

/**
 *  @param tenantDatabaseName - Name of the tenant database to connect to.
 *  @returns Configuration for a tenant database resolved after user login.
 */
export function getTenantDatabaseConfig(
  tenantDatabaseName: string,
): MongoDatabaseConfig {
  if (!tenantDatabaseName.trim()) {
    throw new Error('Tenant database name must not be empty.');
  }

  return createMongoDatabaseConfig(tenantDatabaseName);
}

/**
 *
 * @param databaseName
 * @returns MongoDatabaseConfig with connection string built from shared connection settings and provided database name.
 */
function createMongoDatabaseConfig(databaseName: string): MongoDatabaseConfig {
  const connection = getMongoConnectionConfig();

  return {
    ...connection,
    databaseName,
    connectionString: buildMongoConnectionString({
      ...connection,
      databaseName,
    }),
  };
}

/**
 * Builds a MongoDB connection string from the provided configuration.
 * @param config - The MongoDB connection configuration including credentials and database name.
 * @returns A MongoDB connection string.
 */
function buildMongoConnectionString(
  config: MongoConnectionConfig & { databaseName: string },
): string {
  const username = encodeURIComponent(config.username);
  const password = encodeURIComponent(config.password);
  const databaseName = encodeURIComponent(config.databaseName);
  const authSource = encodeURIComponent(config.authSource);

  return `mongodb://${username}:${password}@${config.host}:${config.port}/${databaseName}?authSource=${authSource}`;
}

function getRequiredEnv(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}
