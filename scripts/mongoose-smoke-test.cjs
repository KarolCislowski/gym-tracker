const mongoose = require('mongoose');

const coreUserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    tenantDatabaseName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
  },
  {
    timestamps: true,
    collection: 'core_users',
  },
);

const tenantWorkoutSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    workoutName: {
      type: String,
      required: true,
      trim: true,
    },
    durationMinutes: {
      type: Number,
      required: true,
      min: 1,
    },
    performedAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: 'tenant_workouts',
  },
);

function getRequiredEnv(name) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function getServerUri() {
  const username = encodeURIComponent(getRequiredEnv('MONGODB_USERNAME'));
  const password = encodeURIComponent(getRequiredEnv('MONGODB_PASSWORD'));
  const host = getRequiredEnv('MONGODB_HOST');
  const port = getRequiredEnv('MONGODB_PORT');
  const authSource = encodeURIComponent(
    process.env.MONGODB_AUTH_SOURCE?.trim() || 'admin',
  );

  return `mongodb://${username}:${password}@${host}:${port}/?authSource=${authSource}`;
}

async function run() {
  const rootConnection = await mongoose.createConnection(getServerUri()).asPromise();
  const coreConnection = rootConnection.useDb('Core', { useCache: true });
  const tenantDatabaseName = `tenant_smoke_${Date.now()}`;
  const tenantConnection = rootConnection.useDb(tenantDatabaseName, {
    useCache: true,
  });

  const CoreUser =
    coreConnection.models.CoreUser ||
    coreConnection.model('CoreUser', coreUserSchema);

  const TenantWorkout =
    tenantConnection.models.TenantWorkout ||
    tenantConnection.model('TenantWorkout', tenantWorkoutSchema);

  const coreUser = await CoreUser.create({
    email: `smoke-${Date.now()}@gymtracker.dev`,
    tenantDatabaseName,
  });

  const tenantWorkout = await TenantWorkout.create({
    userId: String(coreUser._id),
    workoutName: 'Smoke Test Workout',
    durationMinutes: 30,
    performedAt: new Date(),
  });

  console.log(
    JSON.stringify(
      {
        status: 'ok',
        coreDatabase: coreConnection.name,
        tenantDatabase: tenantConnection.name,
        coreUserId: String(coreUser._id),
        tenantWorkoutId: String(tenantWorkout._id),
      },
      null,
      2,
    ),
  );

  await rootConnection.close();
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
