/**
 * Smoke test login + 8 academic endpoints.
 * Butuh backend + DATABASE_URL. Jalankan: npx tsx scripts/integrationSmoke.ts
 */
const BASE = process.env.API_BASE || 'http://localhost:4000';

const ACCOUNTS = [
  { label: 'admin', role: 'ADMIN', id: 'admin', password: process.env.ADMIN_PASSWORD || 'admin123456' },
  { label: 'guru', role: 'GURU', id: '198501012010011001', password: 'guru123' },
  { label: 'siswa', role: 'MURID', id: '2024001', password: 'siswa123' },
  { label: 'wali', role: 'WALIS', id: '2024001', password: 'ortu123' },
];

async function login(acc: (typeof ACCOUNTS)[number]) {
  const path = acc.role === 'ADMIN' ? '/api/auth/admin/login' : '/api/auth/login';
  const body =
    acc.role === 'ADMIN'
      ? { username: acc.id, pin: acc.password }
      : { role: acc.role, id: acc.id, password: acc.password };
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = (await res.json()) as { ok?: boolean; accessToken?: string; message?: string };
  return { status: res.status, ok: Boolean(data.ok && data.accessToken), token: data.accessToken, data };
}

async function get(path: string, token: string) {
  const res = await fetch(`${BASE}${path}`, { headers: { Authorization: `Bearer ${token}` } });
  return { status: res.status, ok: res.ok };
}

async function main() {
  console.log('== Smoke login ==');
  const tokens: Record<string, string> = {};
  for (const acc of ACCOUNTS) {
    try {
      const r = await login(acc);
      console.log(acc.label, r.status, r.ok ? 'OK' : 'FAIL');
      if (r.token) tokens[acc.label] = r.token;
    } catch (e) {
      console.log(acc.label, 'UNREACHABLE', (e as Error).message);
    }
  }

  const guru = tokens.guru;
  if (!guru) {
    console.log('Skip academic: no guru token (backend/DB belum siap?)');
    process.exit(tokens.guru || tokens.siswa ? 0 : 1);
  }

  console.log('== Academic GET ==');
  const paths = [
    '/api/attendance',
    '/api/rapot',
    '/api/billing',
    '/api/billing/config',
    '/api/library/books',
    '/api/library/members',
    '/api/library/transactions',
    '/api/assignments',
    '/api/assignments/submissions',
    '/api/surat-izin',
    '/api/roster',
    '/api/ppdb/config',
  ];
  for (const p of paths) {
    const r = await get(p, guru);
    console.log(r.status, p);
  }

  if (tokens.siswa) {
    console.log('== Siswa self-service ==');
    for (const p of ['/api/rapot', '/api/billing', '/api/surat-izin']) {
      const r = await get(p, tokens.siswa);
      console.log('siswa', r.status, p);
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
