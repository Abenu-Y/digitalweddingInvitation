import { MongoClient, Db } from 'mongodb';

/**
 * MongoDB Connection Singleton for Next.js App Router.
 * Caches the connection promise across hot reloads in development
 * and reuses the connection pool in serverless environments.
 */

const uri = process.env.MONGODB_URI || '';
const dbName = process.env.MONGODB_DB || 'wedding_db';

interface GlobalMongo {
  _mongoClientPromise?: Promise<MongoClient>;
}

declare const global: typeof globalThis & GlobalMongo;

let clientPromise: Promise<MongoClient> | null = null;

if (uri) {
  // Use connection timeout options to fail fast if unreachable (e.g. 3s timeout)
  // This guarantees the app never hangs or stalls if MongoDB is unavailable!
  const options = {
    serverSelectionTimeoutMS: 3000,
    connectTimeoutMS: 3000,
  };

  if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
      const client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    const client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }
}

/**
 * Get MongoDB database instance safely.
 * Returns null if MONGODB_URI is not set or if connection times out/fails.
 */
export async function getDatabase(): Promise<Db | null> {
  if (!clientPromise) {
    return null;
  }
  try {
    const client = await clientPromise;
    return client.db(dbName);
  } catch (error) {
    console.warn('⚠️ MongoDB connection failed, falling back to local storage cache:', error instanceof Error ? error.message : error);
    return null;
  }
}

/**
 * Check MongoDB live connection status and measure latency.
 */
export async function checkMongoStatus(): Promise<{
  connected: boolean;
  database: string;
  latencyMs: number;
  error?: string;
}> {
  if (!uri) {
    return {
      connected: false,
      database: 'local_storage',
      latencyMs: 0,
      error: 'MONGODB_URI is not set in environment variables',
    };
  }

  const start = Date.now();
  try {
    const db = await getDatabase();
    if (!db) {
      return {
        connected: false,
        database: dbName,
        latencyMs: Date.now() - start,
        error: 'Could not connect to MongoDB server',
      };
    }
    // Ping database
    await db.command({ ping: 1 });
    return {
      connected: true,
      database: dbName,
      latencyMs: Date.now() - start,
    };
  } catch (err) {
    return {
      connected: false,
      database: dbName,
      latencyMs: Date.now() - start,
      error: err instanceof Error ? err.message : 'Unknown connection error',
    };
  }
}
