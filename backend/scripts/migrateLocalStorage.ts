/**
 * Migrasi data akademik/PPDB dari JSON export localStorage → Postgres.
 *
 * Cara pakai (setelah migrate + seed):
 *   DATABASE_URL=... npx tsx scripts/migrateLocalStorage.ts ./export-localstorage.json
 *
 * Format JSON (opsional, semua key boleh kosong):
 * {
 *   "ppdbApplications": [ { "namaLengkap": "...", ... } ],
 *   "attendances": [],
 *   "nilaiRapot": [],
 *   "tagihan": [],
 *   "suratIzin": []
 * }
 *
 * Live import dari browser: export localStorage key `siakad_*` lalu simpan file.
 */
import { readFileSync } from 'node:fs';
import { PrismaClient } from '@prisma/client';
import { toPrismaCreate } from '../src/modules/ppdb/ppdb.mapper.js';

const prisma = new PrismaClient();

async function main() {
  const file = process.argv[2];
  if (!file) {
    console.error('Usage: tsx scripts/migrateLocalStorage.ts <export.json>');
    process.exit(1);
  }
  const raw = JSON.parse(readFileSync(file, 'utf8')) as Record<string, unknown>;
  const apps = Array.isArray(raw.ppdbApplications) ? raw.ppdbApplications : [];
  let created = 0;
  for (const app of apps) {
    const data = toPrismaCreate(app as Record<string, unknown>);
    await prisma.pPDBApplication.upsert({
      where: { registrationNo: data.registrationNo },
      update: data,
      create: data,
    });
    created += 1;
  }
  console.log(`Migrasi PPDB selesai: ${created} baris.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
