import { MongoClient, Db } from 'mongodb';
import dns from 'dns';

// Fix querySrv ECONNREFUSED on Windows and restrictive DNS resolvers by using public DNS
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Ignored if setting DNS servers is not allowed in runtime
}

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
// Force clear stale promise from before DNS fix
if (typeof global !== 'undefined') {
  delete (global as any)._mongoClientPromise;
}

function getClientPromise(): Promise<MongoClient> | null {
  if (!uri) return null;

  const options = {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 5000,
  };

  if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
      const client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect().catch((err) => {
        // Reset on failure so subsequent attempts can reconnect
        global._mongoClientPromise = undefined;
        throw err;
      });
    }
    return global._mongoClientPromise;
  } else {
    if (!clientPromise) {
      const client = new MongoClient(uri, options);
      clientPromise = client.connect().catch((err) => {
        clientPromise = null;
        throw err;
      });
    }
    return clientPromise;
  }
}

/**
 * Get MongoDB database instance safely.
 * Returns null if MONGODB_URI is not set or if connection times out/fails.
 */
export async function getDatabase(): Promise<Db | null> {
  const promise = getClientPromise();
  if (!promise) {
    return null;
  }
  try {
    const client = await promise;
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
