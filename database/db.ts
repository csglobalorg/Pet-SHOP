import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Handle ESM dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = process.env.SQLITE_DB_PATH || path.resolve(__dirname, 'dokan_erp.db');

class DatabaseManager {
  private db: DatabaseSync;

  constructor() {
    this.db = new DatabaseSync(DB_PATH);
    this.initSchema();
  }

  private initSchema() {
    const schemaPath = path.resolve(__dirname, 'schema.sql');
    if (fs.existsSync(schemaPath)) {
      const ddl = fs.readFileSync(schemaPath, 'utf8');
      this.db.exec(ddl);
    }
  }

  public getDb(): DatabaseSync {
    return this.db;
  }

  // Prepared statement query helper (returns all rows)
  public all<T = any>(query: string, ...params: any[]): T[] {
    const stmt = this.db.prepare(query);
    return stmt.all(...params) as T[];
  }

  // Prepared statement query helper (returns single row)
  public get<T = any>(query: string, ...params: any[]): T | undefined {
    const stmt = this.db.prepare(query);
    return stmt.get(...params) as T | undefined;
  }

  // Prepared statement execute helper (insert, update, delete)
  public run(query: string, ...params: any[]) {
    const stmt = this.db.prepare(query);
    return stmt.run(...params);
  }

  // Transaction runner for ACID guarantees (Atomic Stock deduction, ledger updates)
  public transaction<T>(callback: () => T): T {
    this.db.exec('BEGIN TRANSACTION;');
    try {
      const result = callback();
      this.db.exec('COMMIT;');
      return result;
    } catch (err) {
      this.db.exec('ROLLBACK;');
      throw err;
    }
  }
}

export const dbManager = new DatabaseManager();
export const db = dbManager.getDb();
