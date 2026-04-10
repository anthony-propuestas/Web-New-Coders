import Database from 'better-sqlite3';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const schemaPath = resolve(__dirname, '../../schema.sql');

function normalizeRow(row) {
  return row ?? null;
}

class D1PreparedStatement {
  constructor(db, sql, params = []) {
    this.db = db;
    this.sql = sql;
    this.params = params;
  }

  bind(...params) {
    return new D1PreparedStatement(this.db, this.sql, params);
  }

  async first() {
    const statement = this.db.prepare(this.sql);
    return normalizeRow(statement.get(...this.params));
  }

  async all() {
    const statement = this.db.prepare(this.sql);
    return { results: statement.all(...this.params) };
  }

  async run() {
    const statement = this.db.prepare(this.sql);
    const result = statement.run(...this.params);
    return {
      success: true,
      meta: {
        changes: result.changes,
        last_row_id: Number(result.lastInsertRowid || 0),
      },
    };
  }
}

export class D1DatabaseMock {
  constructor() {
    this.sqlite = new Database(':memory:');
    this.sqlite.pragma('foreign_keys = ON');
    this.sqlite.exec(readFileSync(schemaPath, 'utf8'));
  }

  prepare(sql) {
    return new D1PreparedStatement(this.sqlite, sql);
  }

  async batch(statements) {
    const runBatch = this.sqlite.transaction((preparedStatements) => preparedStatements.map((statement) => {
      const compiled = this.sqlite.prepare(statement.sql);
      const result = compiled.run(...statement.params);

      return {
        success: true,
        meta: {
          changes: result.changes,
          last_row_id: Number(result.lastInsertRowid || 0),
        },
      };
    }));

    return runBatch(statements);
  }

  exec(sql) {
    return this.sqlite.exec(sql);
  }

  close() {
    this.sqlite.close();
  }
}

export function createTestDb() {
  return new D1DatabaseMock();
}