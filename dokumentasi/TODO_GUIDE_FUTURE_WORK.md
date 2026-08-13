# 📋 TODO GUIDE - FUTURE WORK

**Tanggal dibuat:** 13 Agustus 2026  
**Status:** Kode integrasi + akademik + PPDB CRUD siap; uji live = Postgres (VS Code)  
**Konteks:** Panduan lengkap pekerjaan yang belum selesai untuk sesi berikutnya

---

## 🎯 STATUS OVERVIEW

### ✅ **ALREADY COMPLETED (100%)**
- Backend infrastructure (server, database, API basic)
- Frontend infrastructure (React app, configuration)
- Authentication system (login API untuk semua role)
- Core API endpoints (auth, metrics, root)
- Database schema dan migrations
- Seed data awal

### 🟡 **KODE SIAP — UJI LIVE MENUNGGU POSTGRES (VS Code)**
- Full stack: `apiClient` + auth header di semua service akademik
- 8 modul akademik: route + ownership + frontend service
- Linkage auth: `legacyId` + middleware ownership
- PPDB CRUD + mapper ID↔EN + `usePpdbApi = hasApi`
- Script: `backend/scripts/integrationSmoke.ts`, `migrateLocalStorage.ts`

---

## 🚨 PRIORITY 1: INTEGRATION TESTING (HIGH)

### Status: ❌ **NOT STARTED**
### Estimasi: 15-30 menit
### Prioritas: **TINGGI** - Harus dilakukan sebelum development lanjut

### Langkah-langkah:

#### 1. Test Basic Login Flow
```bash
# 1. Buka frontend di browser
http://localhost:5173

# 2. Coba login dengan kredensial yang tersedia:
# - Guru: NIP "198501012010011001", password "guru123"
# - Siswa: NIS "2024001", password "siswa123"  
# - Wali: NIS "2024001", password "ortu123"
# - Admin: username "admin", password "admin123456"

# 3. Verifikasi:
# - Login berhasil
# - Token disimpan dengan benar
# - UI redirect ke halaman yang sesuai
# - Menu/fitur sesuai role muncul
```

#### 2. Test API Connection from Frontend
```bash
# 1. Buka browser DevTools (F12)
# 2. Cek Network tab
# 3. Lakukan login
# 4. Verifikasi:
# - Request ke http://localhost:4000/api/auth/login berhasil
# - Response berisi token dan user data
# - Headers sesuai (Content-Type, dll)
# - Tidak ada error CORS
```

#### 3. Test Logout Flow
```bash
# 1. Login sebagai user manapun
# 2. Klik logout
# 3. Verifikasi:
# - Token dihapus
# - Redirect ke halaman login
# - Tidak bisa akses halaman yang butuh auth
```

#### 4. Test Error Scenarios
```bash
# 1. Coba login dengan password salah
# 2. Verifikasi error message muncul di UI
# 3. Coba akses endpoint tanpa login
# 4. Verifikasi unauthorized response
```

### Success Criteria:
- ✅ Login dari frontend berhasil untuk semua role
- ✅ API calls berfungsi dari frontend
- ✅ Error handling UI berfungsi
- ✅ Logout flow berfungsi
- ✅ Token management benar

### Files yang perlu dicek:
- `src/services/authApi.ts` - Authentication service
- `src/context/` - Auth context
- `src/fitur/autentikasi/` - Auth UI components

---

## 🚨 PRIORITY 2: ACADEMIC ENDPOINTS TESTING (HIGH)

### Status: ❌ **NOT STARTED**  
### Estimasi: 1-2 jam
### Prioritas: **TINGGI** - Penting untuk memastikan fitur akademik berfungsi

### Langkah-langkah:

#### 1. Test Attendance Endpoint
```bash
# Reference: DOKUMEN_LANJUTAN_VSCODE.md line 77-80

# Test GET attendance (guru/admin only)
curl -X GET http://localhost:4000/api/attendance \
  -H "Authorization: Bearer <guru_token>"

# Test POST attendance (bulk create)
curl -X POST http://localhost:4000/api/attendance \
  -H "Authorization: Bearer <guru_token>" \
  -H "Content-Type: application/json" \
  -d '[{"date":"2026-08-13","status":"HADIR","studentId":"<student_id>","teacherId":"<teacher_id>","classId":"<class_id>"}]'

# Test DELETE attendance
curl -X DELETE http://localhost:4000/api/attendance/<id> \
  -H "Authorization: Bearer <guru_token>"
```

#### 2. Test Rapot (Report Card) Endpoint
```bash
# Reference: DOKUMEN_LANJUTAN_VSCODE.md line 81-82

# Test GET rapot
curl -X GET http://localhost:4000/api/rapot \
  -H "Authorization: Bearer <guru_token>"

# Test POST/UPSERT rapot
curl -X POST http://localhost:4000/api/rapot \
  -H "Authorization: Bearer <guru_token>" \
  -H "Content-Type: application/json" \
  -d '{"studentId":"<student_id>","classId":"<class_id>","academicYear":"2026-2027","semester":"1","subject":"Matematika","dailyScore":85,"assignScore":90,"midScore":88,"finalScore":87}'
```

#### 3. Test Billing Endpoint
```bash
# Reference: DOKUMEN_LANJUTAN_VSCODE.md line 83-86

# Test GET billing
curl -X GET http://localhost:4000/api/billing \
  -H "Authorization: Bearer <guru_token>"

# Test POST billing/pay
curl -X POST http://localhost:4000/api/billing/<id>/pay \
  -H "Authorization: Bearer <guru_token>"

# Test GET billing/config
curl -X GET http://localhost:4000/api/billing/config \
  -H "Authorization: Bearer <admin_token>"

# Test POST billing/generate
curl -X POST http://localhost:4000/api/billing/generate \
  -H "Authorization: Bearer <admin_token>"
```

#### 4. Test Library Endpoint
```bash
# Reference: DOKUMEN_LANJUTAN_VSCODE.md line 87-90

# Test GET books
curl -X GET http://localhost:4000/api/library/books \
  -H "Authorization: Bearer <guru_token>"

# Test GET members
curl -X GET http://localhost:4000/api/library/members \
  -H "Authorization: Bearer <guru_token>"

# Test GET transactions
curl -X GET http://localhost:4000/api/library/transactions \
  -H "Authorization: Bearer <guru_token>"

# Test POST borrow
curl -X POST http://localhost:4000/api/library/transactions/borrow \
  -H "Authorization: Bearer <siswa_token>" \
  -H "Content-Type: application/json" \
  -d '{"bookId":"<book_id>","memberId":"<member_id>"}'
```

#### 5. Test Assignment Endpoint
```bash
# Reference: DOKUMEN_LANJUTAN_VSCODE.md line 91-92

# Test GET assignments
curl -X GET http://localhost:4000/api/assignments \
  -H "Authorization: Bearer <guru_token>"

# Test POST assignment
curl -X POST http://localhost:4000/api/assignments \
  -H "Authorization: Bearer <guru_token>" \
  -H "Content-Type: application/json" \
  -d '{"classId":"<class_id>","title":"Tugas Matematika","content":{"summary":"..."},"dueDate":"2026-08-20","createdBy":"<teacher_id>"}'

# Test GET submissions
curl -X GET http://localhost:4000/api/assignments/submissions \
  -H "Authorization: Bearer <guru_token>"

# Test POST submission
curl -X POST http://localhost:4000/api/assignments/submissions \
  -H "Authorization: Bearer <siswa_token>" \
  -H "Content-Type: application/json" \
  -d '{"assignmentId":"<assignment_id>","studentId":"<student_id>","answerText":"Jawaban siswa"}'
```

#### 6. Test Surat Izin Endpoint
```bash
# Reference: DOKUMEN_LANJUTAN_VSCODE.md line 93-94

# Test GET surat izin
curl -X GET http://localhost:4000/api/surat-izin \
  -H "Authorization: Bearer <guru_token>"

# Test POST surat izin
curl -X POST http://localhost:4000/api/surat-izin \
  -H "Authorization: Bearer <siswa_token>" \
  -H "Content-Type: application/json" \
  -d '{"studentId":"<student_id>","classId":"<class_id>","type":"SAKIT","subject":"Izin sakit","message":"Saya izin sakit","letterDate":"2026-08-13"}'
```

#### 7. Test Roster Endpoint
```bash
# Reference: DOKUMEN_LANJUTAN_VSCODE.md line 95-96

# Test GET roster
curl -X GET http://localhost:4000/api/roster \
  -H "Authorization: Bearer <guru_token>"

# Test POST roster
curl -X POST http://localhost:4000/api/roster \
  -H "Authorization: Bearer <guru_token>" \
  -H "Content-Type: application/json" \
  -d '{"classId":"<class_id>","subject":"Matematika","dayOfWeek":1,"startTime":"07:00","endTime":"08:00","room":"R-101","teacherName":"Bapak Andi"}'
```

#### 8. Test PPDB Config Endpoint
```bash
# Reference: DOKUMEN_LANJUTAN_VSCODE.md line 96

# Test GET PPDB config
curl -X GET http://localhost:4000/api/ppdb/config \
  -H "Authorization: Bearer <admin_token>"

# Test PATCH PPDB config
curl -X PATCH http://localhost:4000/api/ppdb/config \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{"ppdbIsOpen":true,"ppdbQuota":100}'
```

### Success Criteria:
- ✅ Semua 8 academic endpoints merespons
- ✅ Role-based access berfungsi (GURU, ADMIN, MURID)
- ✅ CRUD operations berfungsi
- ✅ Error handling sesuai role
- ✅ Data validation berfungsi

### Files yang perlu dicek:
- `backend/src/modules/attendance/` - Attendance module
- `backend/src/modules/rapot/` - Report card module
- `backend/src/modules/billing/` - Billing module
- `backend/src/modules/library/` - Library module
- `backend/src/modules/assignment/` - Assignment module
- `backend/src/modules/surat-izin/` - Permission letters
- `backend/src/modules/roster/` - Class roster
- `backend/src/modules/ppdb/` - PPDB config

---

## 🔴 PRIORITY 3: LINKAGE AUTH (BLOCKING ITEM)

### Status: ✅ **KODE IMPLEMENTED** (uji live menunggu Postgres)
### Estimasi: 4-8 jam
### Prioritas: **SANGAT TINGGI** - Disebut "BLOKIR-4" di DOKUMEN_LANJUTAN_VSCODE.md
### Reference: DOKUMEN_LANJUTAN_VSCODE.md lines 104-121

### Problem Statement:
Frontend menggunakan ID lokal (s1, t1, dll) sedangkan backend menggunakan CUID. Tidak ada mapping antara ID login (backend CUID) dan data lokal. Ini membuat self-service (siswa lihat rapor sendiri) tidak bisa karena tidak ada ownership-check.

### Langkah-langkah:

#### 1. Review Current Schema
```bash
# Cek relasi yang sudah ada di prisma/schema.prisma:
# - Student.guardianName, guardianPhone, guardianPasswordHash
# - ClassRoomTeacher (relation Guru ↔ Kelas)
# - ClassRoom.teacherId (wali kelas)

# Files:
- backend/prisma/schema.prisma
```

#### 2. Design Linkage Strategy
```typescript
// Opsi 1: Tambah kolom legacyId di model
model Student {
  // ... existing fields
  legacyId string?  // untuk mapping s1, s2, dll ke CUID
}

model Teacher {
  // ... existing fields  
  legacyId string?  // untuk mapping t1, t2, dll ke CUID
}

// Opsi 2: Buat tabel mapping khusus
model UserMapping {
  id          String @id @default(cuid())
  backendId   String  // CUID dari backend
  frontendId  String  // s1, t1, dll
  role        String  // GURU, MURID, WALIS
  createdAt   DateTime @default(now())
}
```

#### 3. Implement Linkage di Backend
```typescript
// Update backend/src/modules/auth/auth.service.ts:

// Tambahkan fungsi untuk resolve legacy ID
async function resolveLegacyId(legacyId: string, role: string) {
  if (role === 'MURID') {
    return await prisma.student.findFirst({ where: { legacyId } });
  } else if (role === 'GURU') {
    return await prisma.teacher.findFirst({ where: { legacyId } });
  }
  // ... dll
}

// Update login functions untuk support legacy ID
export async function loginStudent(legacyId: string, password: string) {
  const student = await resolveLegacyId(legacyId, 'MURID');
  // ... rest of login logic
}
```

#### 4. Add Ownership Check Middleware
```typescript
// Buat backend/src/middleware/ownership.ts:

export function requireOwnership(model: 'Student' | 'Teacher') {
  return async (req, res, next) => {
    const userId = req.jwtUser?.userId;
    const targetId = req.params.id; // atau dari body
    
    // Check apakah userId memiliki akses ke targetId
    const hasAccess = await checkOwnership(userId, targetId, model);
    
    if (!hasAccess) {
      return res.status(403).json({ 
        ok: false, 
        message: 'Akses ditolak. Anda hanya dapat mengakses data sendiri.' 
      });
    }
    
    next();
  };
}
```

#### 5. Apply Ownership Check to Endpoints
```typescript
// Update route files untuk menambahkan ownership check:

// src/modules/rapot/rapot.route.ts:
router.get('/', requireAuth, requireOwnership('Student'), getRapot);

// src/modules/billing/billing.route.ts:
router.get('/', requireAuth, requireOwnership('Student'), getBilling);

// src/modules/surat-izin/suratIzin.route.ts:
router.get('/', requireAuth, requireOwnership('Student'), getSuratIzin);
```

#### 6. Update Frontend to Use Backend IDs
```typescript
// Update src/services/ untuk menggunakan backend CUID:
// - Ganti s1 → backend CUID
// - Update API calls untuk menggunakan CUID
// - Update local storage untuk menyimpan CUID

// Files:
- src/services/rapotService.ts
- src/services/billingService.ts
- src/services/suratIzinService.ts
- src/services/assignmentService.ts
```

#### 7. Migrate Frontend Data
```typescript
// Buat script migrasi satu-kali:
// 1. Baca data localStorage (s1, t1, dll)
// 2. Mapping ke backend CUID
// 3. Update localStorage dengan CUID
// 4. Update UI untuk menggunakan CUID
```

### Success Criteria:
- ✅ Relasi akun ↔ data siswa terbangun
- ✅ Ownership-check berfungsi di semua endpoint
- ✅ Siswa hanya bisa lihat data sendiri
- ✅ Wali hanya bisa lihat data anaknya
- ✅ Guru hanya bisa lihat kelas yang diampu
- ✅ Frontend menggunakan backend CUID
- ✅ Data migration dari legacy ID ke CUID selesai

### Files yang perlu dimodifikasi:
- `backend/prisma/schema.prisma` - Tambah linkage fields
- `backend/src/modules/auth/auth.service.ts` - Support legacy ID
- `backend/src/middleware/ownership.ts` - Baru
- `backend/src/modules/*/route.ts` - Tambah ownership check
- `src/services/*.ts` - Update untuk menggunakan CUID
- `src/context/` - Update auth context

---

## 🔴 PRIORITY 4: DATA MIGRATION (BLOCKING ITEM)

### Status: ✅ **KODE SIAP** (jalankan migrate saat Postgres ada)
### Estimasi: 8-16 jam
### Prioritas: **SANGAT TINGGI** - Disebut "BLOKIR-5" di DOKUMEN_LANJUTAN_VSCODE.md
### Reference: DOKUMEN_LANJUTAN_VSCODE.md lines 124-143

### Problem Statement:
1. Data PPDB masih di localStorage frontend
2. Data akademik (absensi, nilai, dll) masih di localStorage
3. Kontrak field backend ≠ frontend (bahasa Inggris vs Indonesia)

### Langkah-langkah:

#### 1. Schema Alignment
```typescript
// Opsi 1: Tambah kolom JSON untuk field bahasa Indonesia
model PPDBApplication {
  // ... existing English fields
  extended Json?  // untuk field bahasa Indonesia
}

// Opsi 2: Update schema untuk field bahasa Indonesia
model PPDBApplication {
  // Ganti fullName → namaLengkap
  // Ganti gender → jenisKelamin
  // ... dll
}
```

#### 2. Buat Migration Script
```typescript
// Buat backend/scripts/migrateLocalStorage.ts:

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function migratePPDBData() {
  // 1. Baca data dari localStorage (perlu cara akses)
  // 2. Transform ke format backend
  // 3. Insert ke database
  // 4. Update frontend untuk menggunakan API
}

async function migrateAcademicData() {
  // 1. Baca data absensi, nilai, dll dari localStorage
  // 2. Transform ke format backend
  // 3. Insert ke database
  // 4. Update frontend untuk menggunakan API
}
```

#### 3. Update Frontend Services
```typescript
// Update src/services/ppdbService.ts:
// - Aktifkan usePpdbApi = hasApi
// - Update untuk menggunakan backend API
// - Handle field mapping (Indonesia ↔ Inggris)

// Update src/services/ untuk data akademik:
// - Aktifkan API calls
// - Hapus fallback localStorage setelah migrasi
```

#### 4. Build PPDB CRUD Endpoints
```typescript
// Buat backend/src/modules/ppdb/ppdb.controller.ts:
// - POST /api/ppdb/applications (create)
// - GET /api/ppdb/applications (list)
// - GET /api/ppdb/applications/:id (detail)
// - PATCH /api/ppdb/applications/:id (update status)
// - GET /api/ppdb/applications/:id/documents (documents)
// - GET /api/ppdb/applications/:id/audit (audit logs)
```

#### 5. Testing Migration
```bash
# 1. Backup data localStorage (export ke JSON)
# 2. Jalankan migrasi script
# 3. Verifikasi data di database
# 4. Test frontend dengan API
# 5. Rollback jika ada error
```

### Success Criteria:
- ✅ Schema backend ↔ frontend diselaraskan
- ✅ Data PPDB dari localStorage ter-migrasi ke DB
- ✅ Data akademik dari localStorage ter-migrasi ke DB
- ✅ Frontend menggunakan API (bukan localStorage)
- ✅ PPDB CRUD endpoints berfungsi
- ✅ Data consistency terjaga

### Files yang perlu dimodifikasi:
- `backend/prisma/schema.prisma` - Schema alignment
- `backend/scripts/migrateLocalStorage.ts` - Baru
- `backend/src/modules/ppdb/` - PPDB CRUD endpoints
- `src/services/ppdbService.ts` - Update untuk API
- `src/services/*.ts` - Update data akademik services
- Frontend localStorage handling

---

## 📋 QUICK START GUIDE UNTUK SESI BERIKUTNYA

### Saat kembali ke project, ikuti urutan ini:

#### **LANGKAH 1: Baca Dokumentasi**
```bash
# Baca file ini dulu untuk memahami konteks
dokumentasi/TODO_GUIDE_FUTURE_WORK.md

# Baca dokumentasi audit agent
DOKUMEN_LANJUTAN_VSCODE.md

# Baca status full stack
dokumentasi/FULL_STACK_SETUP_COMPLETED.md
```

#### **LANGKAH 2: Cek Server Status**
```bash
# Cek apakah backend masih berjalan
curl http://localhost:4000

# Cek apakah frontend masih berjalan
curl http://localhost:5173

# Jika tidak, jalankan:
cd backend && npm run dev
# (di terminal lain)
npm run dev
```

#### **LANGKAH 3: Pilih Prioritas**
```bash
# Jika ingin quick test:
→ Lakukan PRIORITY 1 (Integration Testing)

# Jika ingin development lanjut:
→ Lakukan PRIORITY 1 + PRIORITY 2 (Academic Testing)

# Jika ingin production ready:
→ Lakukan semua prioritas (1, 2, 3, 4)
```

#### **LANGKAH 4: Test Credentials**
```bash
# Gunakan kredensial ini untuk testing:
Admin: admin / admin123456
Guru: 198501012010011001 / guru123
Siswa: 2024001 / siswa123
Wali: 2024001 / ortu123
```

---

## 🔗 REFERENSI DOKUMENTASI

### Dokumentasi yang Sudah Ada:
1. **`DOKUMEN_LANJUTAN_VSCODE.md`** - Audit agent documentation (penting!)
2. **`dokumentasi/BACKEND_SETUP_COMPLETED.md`** - Backend status
3. **`dokumentasi/API_TESTING_RESULTS.md`** - API testing results
4. **`dokumentasi/FULL_STACK_SETUP_COMPLETED.md`** - Full stack status
5. **`dokumentasi/TODO_GUIDE_FUTURE_WORK.md`** - File ini (future work)

### Backend Documentation:
- `backend/ENV_DOCUMENTATION.md` - Environment variables
- `backend/CONVENTIONS.md` - Coding conventions
- `backend/README.md` - Backend README

### Frontend Documentation:
- `src/data/services/API.md` - Frontend API documentation
- Service files di `src/services/` - API integration

---

## 📊 SUMMARY TABLE

| Priority | Task | Status | Estimasi | Urgensi |
|----------|------|--------|----------|---------|
| 1 | Integration Testing | ✅ Kode + smoke script | 15-30 min | HIGH |
| 2 | Academic Endpoints | ✅ Route + service siap | 1-2 jam | HIGH |
| 3 | Linkage Auth | ✅ Kode siap | 4-8 jam | VERY HIGH |
| 4 | Data Migration | ✅ Mapper + script + PPDB CRUD | 8-16 jam | VERY HIGH |

---

## 💡 REKOMENDASI

### Untuk Demo/Testing:
1. Selesaikan Priority 1 (Integration Testing)
2. Selesaikan Priority 2 (Academic Testing - 1-2 endpoint)
3. **Sudah cukup untuk demo basic**

### Untuk Development:
1. Selesaikan Priority 1 + 2 (Semua academic endpoints)
2. **Siap untuk development fitur lanjutan**

### Untuk Production:
1. Selesaikan semua priorities (1, 2, 3, 4)
2. Full E2E testing
3. Performance optimization
4. **Siap untuk production deployment**

---

**Last updated:** 13 Agustus 2026  
**Next action:** Pilih priority sesuai kebutuhan dan ikuti langkah-langkah di atas



tambahan:
 JAWABAN LANGSUNG:

"Semua sudah ready?" - TIDAK sepenuhnya ready

  • ✅ Infrastructure: 100% ready
  • ✅ Basic Auth: 100% ready
  • ✅ Full Integration: ~85% ready (uji E2E live = VS Code + Postgres)
  • ✅ Academic Features: ~80% ready (8 modul + ownership + apiClient)
  • ✅ Production Features: ~70% ready (linkage, PPDB CRUD, mapper, migrate script)

Rekomendasi saya: Test dulu integration basic (login dari frontend), lalu lanjutkan sesuai kebutuhan Anda (demo vs production).