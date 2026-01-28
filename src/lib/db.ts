import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { ArchitectureState } from '../types';

interface ArchitectureDB extends DBSchema {
    architecture: {
        key: string;
        value: ArchitectureState;
    };
}

const DB_NAME = 'architecture-canvas';
const DB_VERSION = 1;
const STORE_NAME = 'architecture';

let dbInstance: IDBPDatabase<ArchitectureDB> | null = null;

async function getDB(): Promise<IDBPDatabase<ArchitectureDB>> {
    if (dbInstance) return dbInstance;

    dbInstance = await openDB<ArchitectureDB>(DB_NAME, DB_VERSION, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME);
            }
        },
    });

    return dbInstance;
}

export async function saveArchitecture(state: ArchitectureState): Promise<void> {
    const db = await getDB();
    await db.put(STORE_NAME, state, 'main');
}

export async function loadArchitecture(): Promise<ArchitectureState | null> {
    const db = await getDB();
    const state = await db.get(STORE_NAME, 'main');
    return state || null;
}

export async function clearArchitecture(): Promise<void> {
    const db = await getDB();
    await db.clear(STORE_NAME);
}
