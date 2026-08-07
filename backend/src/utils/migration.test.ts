import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MIGRATIONS_DIR = path.resolve(__dirname, '../../prisma/migrations');

function getAllMigrationSql(): string {
  const dirs = fs.readdirSync(MIGRATIONS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .sort((a, b) => a.name.localeCompare(b.name));
  return dirs
    .map((dir) => {
      const sqlPath = path.join(MIGRATIONS_DIR, dir.name, 'migration.sql');
      if (!fs.existsSync(sqlPath)) return '';
      return fs.readFileSync(sqlPath, 'utf-8');
    })
    .join('\n');
}

describe('Database Migrations', () => {
  it('folder migrations harus ada', () => {
    expect(fs.existsSync(MIGRATIONS_DIR)).toBe(true);
  });

  it('harus ada minimal 1 migration', () => {
    const dirs = fs.readdirSync(MIGRATIONS_DIR, { withFileTypes: true })
      .filter((d) => d.isDirectory());
    expect(dirs.length).toBeGreaterThan(0);
  });

  it('nama folder migration harus pakai format timestamp (YYYYMMDDHHMMSS)', () => {
    const dirs = fs.readdirSync(MIGRATIONS_DIR, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);
    for (const name of dirs) {
      expect(name).toMatch(/^\d{14}_/);
    }
  });

  it('urutan migration harus kronologis berdasarkan timestamp', () => {
    const dirs = fs.readdirSync(MIGRATIONS_DIR, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);
    const timestamps = dirs.map((name) => Number(name.slice(0, 14)));
    for (let i = 1; i < timestamps.length; i++) {
      expect(timestamps[i]).toBeGreaterThan(timestamps[i - 1]);
    }
  });

  it('setiap migration harus punya migration.sql yang berisi SQL', () => {
    const dirs = fs.readdirSync(MIGRATIONS_DIR, { withFileTypes: true })
      .filter((d) => d.isDirectory());
    for (const dir of dirs) {
      const sqlPath = path.join(MIGRATIONS_DIR, dir.name, 'migration.sql');
      expect(fs.existsSync(sqlPath), `${dir.name} harus punya migration.sql`).toBe(true);
      const content = fs.readFileSync(sqlPath, 'utf-8');
      expect(content.trim().length).toBeGreaterThan(0);
    }
  });

  it('migration_lock.toml harus ada (provider postgresql)', () => {
    const lockPath = path.join(MIGRATIONS_DIR, 'migration_lock.toml');
    expect(fs.existsSync(lockPath)).toBe(true);
    const content = fs.readFileSync(lockPath, 'utf-8');
    expect(content).toMatch(/provider\s*=\s*"postgresql"/);
  });
});

describe('Schema vs Migration Consistency', () => {
  it('setiap model di schema.prisma harus punya CREATE TABLE di migration', () => {
    const schemaPath = path.resolve(__dirname, '../../prisma/schema.prisma');
    const schema = fs.readFileSync(schemaPath, 'utf-8');

    const modelNames = [...schema.matchAll(/^model\s+(\w+)\s*\{/gm)]
      .map((m) => m[1]);

    const allSql = getAllMigrationSql();

    expect(modelNames.length).toBeGreaterThan(0);
    for (const model of modelNames) {
      const pattern = new RegExp(
        `CREATE TABLE\\s+["]?${model}["]?`,
        'i'
      );
      expect(
        pattern.test(allSql),
        `Model "${model}" harus punya CREATE TABLE di salah satu migration`
      ).toBe(true);
    }
  });

  it('setiap enum di schema.prisma harus punya CREATE TYPE di migration', () => {
    const schemaPath = path.resolve(__dirname, '../../prisma/schema.prisma');
    const schema = fs.readFileSync(schemaPath, 'utf-8');

    const enumNames = [...schema.matchAll(/^enum\s+(\w+)\s*\{/gm)]
      .map((m) => m[1]);

    const allSql = getAllMigrationSql();

    expect(enumNames.length).toBeGreaterThan(0);
    for (const enumName of enumNames) {
      const pattern = new RegExp(
        `CREATE TYPE\\s+["]?${enumName}["]?`,
        'i'
      );
      expect(
        pattern.test(allSql),
        `Enum "${enumName}" harus punya CREATE TYPE di salah satu migration`
      ).toBe(true);
    }
  });

  it('migrasi terbaru harus sinkron dengan field baru di schema', () => {
    const schemaPath = path.resolve(__dirname, '../../prisma/schema.prisma');
    const schema = fs.readFileSync(schemaPath, 'utf-8');

    // Field yang ditambahkan di migrasi terakhir
    const addHomeroomSql = fs.readFileSync(
      path.join(MIGRATIONS_DIR, '20260802090000_add_homeroom_predikat', 'migration.sql'),
      'utf-8'
    );
    const addedColumns = [...addHomeroomSql.matchAll(/ADD COLUMN\s+["]?(\w+)["]?/gi)]
      .map((m) => m[1]);

    expect(addedColumns.length).toBeGreaterThan(0);
    for (const col of addedColumns) {
      const inSchema = new RegExp(`\\b${col}\\b`).test(schema);
      expect(inSchema, `Kolom "${col}" harus ada di schema.prisma`).toBe(true);
    }
  });
});
