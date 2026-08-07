# KONVENSI NAMING BACKEND

Dokumen ini menstandarkan penamaan di seluruh kode backend agar konsisten dan mudah dipelihara. Berlaku untuk file baru maupun perbaikan file lama.

## 📁 Nama File

| Jenis | Pola | Contoh |
|-------|------|--------|
| File route | `kebab-case.route.ts` | `health.route.ts`, `likes.route.ts` |
| File controller | `kebab-case.controller.ts` | `school-config.controller.ts` |
| File service | `kebab-case.service.ts` | `school-config.service.ts` |
| File module | `kebab-case.module.ts` | `auth.module.ts` |
| File middleware | `kebab-case.ts` (folder `middleware/`) | `errorHandler.ts`, `performance.ts` |
| File utility | `camelCase.ts` (folder `utils/`) | `tokenManager.ts`, `passwordValidator.ts` |
| File config | `camelCase.ts` (folder `config/`) | `env.ts`, `logger.ts` |
| File test | `<nama>.test.ts` | `helpers.test.ts`, `performance.test.ts` |
| File type deklarasi | `camelCase.d.ts` (folder `types/`) | `express.d.ts` |

> **Aturan:** file route/controller/service menggunakan `kebab-case`, utility/config menggunakan `camelCase`. Jangan mencampur gaya dalam satu folder.

## 🏷️ Export Router

Semua router WAJIB menggunakan **named export** (bukan default export) dengan akhiran `Router`.

```typescript
export const authRouter = Router();
export const healthRouter = Router();
```

- ❌ `export default likesRoute;`
- ✅ `export const likesRouter = Router();`

Impor di `src/routes/index.ts` juga harus named import:

```typescript
import { authRouter } from '../modules/auth/auth.route.js';
```

## 🎮 Controller / Handler

Handler di controller menggunakan prefix `handle` + nama aksi, dengan tipe `RequestHandler` eksplisit.

```typescript
export const handleLogin: RequestHandler = async (req, res, next) => { ... };
export const handleGetSchoolConfig: RequestHandler = async (_req, res, next) => { ... };
```

## 🧩 Variabel

| Kategori | Gaya | Contoh |
|----------|------|--------|
| Variabel biasa | `camelCase` | `accessToken`, `userIp` |
| Konstanta | `UPPER_SNAKE_CASE` | `MAX_RECENT_REQUESTS`, `DEFAULT_SLOW_THRESHOLD_MS` |
| Kelas/Interface | `PascalCase` | `AppError`, `JwtPayload`, `PerformanceMetricsStore` |
| Enum/Enum member | `PascalCase` | `ErrorType.VALIDATION` |
| Object literal type | `camelCase` | `userId`, `refreshToken` |
| Query param / URL | `camelCase` | `?limit=10` |
| Nama kolom DB (field name) | `camelCase` | `programId`, `passwordHash` |
| Nama kolom compound (Prisma) | `camelCase_pascalCase` (sesuai skema) | `programId_ip` |
| Event log (logSecurityEvent) | `snake_case` | `login_failed`, `blacklisted_token_used` |

> **Aturan:** `snake_case` HANYA dipakai untuk nama event pada structured logging, bukan untuk variabel kode.

## 🔌 Fungsi Export

- Semua fungsi yang dipakai lintas file harus di-export dan diimpor secara named.
- Hindari default export kecuali benar-benar diperlukan (misal komponen frontend).
- Gunakan `type` import untuk tipe saja: `import type { RequestHandler } from 'express'`.

## 📦 Struktur Modul

Setiap modul (misal `auth`, `school-config`, `backup`) berisi tiga file:

```text
src/modules/<modul>/
  <modul>.controller.ts
  <modul>.route.ts
  <modul>.service.ts
```

## 🚫 Larangan

- Jangan campur `console.log`/`console.error` di dalam route/controller — gunakan `logger` dari `src/config/logger.ts`.
- Jangan duplikasi type definitions — gunakan `src/types/` atau export dari file sumber.
- Jangan membuat `PrismaClient` baru di setiap file — gunakan singleton `src/lib/prisma.ts`.

## ✅ Checklist File Baru

- [ ] Nama file mengikuti pola tabel di atas
- [ ] Router menggunakan named export berakhiran `Router`
- [ ] Handler ber-prefix `handle`
- [ ] Semua logging via `logger`
- [ ] Type definitions diimport via `import type`
- [ ] Response API konsisten `{ ok, message, data }`
