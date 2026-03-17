import mongoose, { type Connection } from 'mongoose';

import {
  getCoreDatabaseConfig,
  getMongooseServerUri,
  getTenantDatabaseConfig,
} from './mongo.config';

declare global {
  var mongooseRootConnectionPromise: Promise<Connection> | undefined;
}

/**
 * Opens a shared root connection to the MongoDB server.
 * Database-specific access is resolved later through useDb().
 */
export async function getMongooseRootConnection(): Promise<Connection> {
  if (!globalThis.mongooseRootConnectionPromise) {
    globalThis.mongooseRootConnectionPromise = mongoose
      .createConnection(getMongooseServerUri())
      .asPromise();
  }

  return globalThis.mongooseRootConnectionPromise;
}

/**
 * Returns a cached Mongoose connection bound to the shared Core database.
 */
export async function getCoreDbConnection(): Promise<Connection> {
  const rootConnection = await getMongooseRootConnection();
  const { databaseName } = getCoreDatabaseConfig();

  return rootConnection.useDb(databaseName, { useCache: true });
}

/**
 * Returns a cached Mongoose connection bound to a tenant database.
 * The tenant database name is expected to be known only after login.
 */
export async function getTenantDbConnection(
  tenantDatabaseName: string,
): Promise<Connection> {
  const rootConnection = await getMongooseRootConnection();
  const { databaseName } = getTenantDatabaseConfig(tenantDatabaseName);

  return rootConnection.useDb(databaseName, { useCache: true });
}

/**
 * Closes the shared root connection created for Mongoose.
 */
export async function closeMongooseRootConnection(): Promise<void> {
  if (!globalThis.mongooseRootConnectionPromise) {
    return;
  }

  const rootConnection = await globalThis.mongooseRootConnectionPromise;
  await rootConnection.close();
  globalThis.mongooseRootConnectionPromise = undefined;
}
