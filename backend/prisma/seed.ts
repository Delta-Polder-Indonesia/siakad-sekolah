// Seed data awal agar backend punya akun demo yang sama dengan frontend (store.ts).
// Jalankan: npm run prisma:seed
//
// KEAMANAN (BUG-09): password demo hanya boleh dipakai di lingkungan non-produksi.
// - NODE_ENV=production akan MEMBLOKIR seeding dengan password lemah default
//   dan mewajibkan SEED_TEACHER_PASSWORD / SEED_STUDENT_PASSWORD (kuat) di env.
// - Non-produksi memakai default guru123 / siswa123 untuk demo.
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const isProduction = process.env.NODE_ENV === 'production';

// Password demo default (non-produksi saja).
const DEMO_TEACHER_PASSWORD = 'guru123';
const DEMO_STUDENT_PASSWORD = 'siswa123';
const DEMO_GUARDIAN_PASSWORD = 'ortu123';

function resolveTeacherPassword(): string {
  if (isProduction) {
    const pwd = process.env.SEED_TEACHER_PASSWORD;
    if (!pwd || pwd.length < 8 || ['guru123', 'password', 'admin', 'password123'].includes(pwd.toLowerCase())) {
      throw new Error(
        'SEED di blokir di production: set SEED_TEACHER_PASSWORD (min 8 karakter, kuat) di environment.'
      );
    }
    return pwd;
  }
  return DEMO_TEACHER_PASSWORD;
}

function resolveStudentPassword(): string {
  if (isProduction) {
    const pwd = process.env.SEED_STUDENT_PASSWORD;
    if (!pwd || pwd.length < 8 || ['siswa123', 'password', 'admin', 'password123'].includes(pwd.toLowerCase())) {
      throw new Error(
        'SEED di blokir di production: set SEED_STUDENT_PASSWORD (min 8 karakter, kuat) di environment.'
      );
    }
    return pwd;
  }
  return DEMO_STUDENT_PASSWORD;
}

function resolveGuardianPassword(): string {
  if (isProduction) {
    const pwd = process.env.SEED_GUARDIAN_PASSWORD;
    if (!pwd || pwd.length < 8 || ['ortu123', 'password', 'admin', 'password123'].includes(pwd.toLowerCase())) {
      throw new Error(
        'SEED di blokir di production: set SEED_GUARDIAN_PASSWORD (min 8 karakter, kuat) di environment.'
      );
    }
    return pwd;
  }
  return DEMO_GUARDIAN_PASSWORD;
}

const classes = [
  { code: 'c1', name: 'X IPA 1', grade: 'X' },
  { code: 'c2', name: 'X IPA 2', grade: 'X' },
  { code: 'c3', name: 'X IPS 1', grade: 'X' },
];

const teachers = [
  { legacyId: 't1', nip: '198501012010011001', name: 'Bapak Andi Pratama', subject: 'Matematika', email: 'andi@sekolah.id', classCode: 'c1' },
  { legacyId: 't2', nip: '198701022012012002', name: 'Ibu Rina Kartika', subject: 'Bahasa Indonesia', email: 'rina@sekolah.id', classCode: 'c2' },
  { legacyId: 't3', nip: '198901032014013003', name: 'Bapak Dedi Saputra', subject: 'Fisika', email: 'dedi@sekolah.id', classCode: null },
];

const students = [
  { legacyId: 's1', nis: '2024001', name: 'Siti Rahma', gender: 'P', classCode: 'c1', guardianName: 'Siti Aminah' },
  { legacyId: 's2', nis: '2024002', name: 'Budi Santoso', gender: 'L', classCode: 'c1', guardianName: 'Agus Santoso' },
  { legacyId: 's3', nis: '2024003', name: 'Nabila Putri', gender: 'P', classCode: 'c2', guardianName: 'Dewi Lestari' },
];

async function main() {
  const teacherPassword = resolveTeacherPassword();
  const studentPassword = resolveStudentPassword();
  const guardianPassword = resolveGuardianPassword();

  const teacherHash = await bcrypt.hash(teacherPassword, 10);
  const studentHash = await bcrypt.hash(studentPassword, 10);
  const guardianHash = await bcrypt.hash(guardianPassword, 10);

  // School config (single row)
  const existingConfig = await prisma.schoolConfig.findFirst();
  if (!existingConfig) {
    await prisma.schoolConfig.create({
      data: {
        name: 'SMA Negeri 1 Medan',
        shortName: 'SMAN 1 Medan',
        type: 'SMA',
        guestAccessCode: 'TAMU2026',
      },
    });
  }

  // Classes
  const classIdByCode = new Map<string, string>();
  for (const c of classes) {
    const row = await prisma.classRoom.upsert({
      where: { code: c.code },
      update: { name: c.name, grade: c.grade },
      create: { code: c.code, name: c.name, grade: c.grade },
    });
    classIdByCode.set(c.code, row.id);
  }

  // Teachers (+ link ke kelas, + penanda wali kelas)
  for (const t of teachers) {
    const teacher = await prisma.teacher.upsert({
      where: { nip: t.nip },
      update: { name: t.name, subject: t.subject, email: t.email, passwordHash: teacherHash, legacyId: t.legacyId },
      create: { nip: t.nip, name: t.name, subject: t.subject, email: t.email, passwordHash: teacherHash, legacyId: t.legacyId },
    });

    if (t.classCode) {
      const classId = classIdByCode.get(t.classCode);
      if (classId) {
        await prisma.classRoomTeacher.upsert({
          where: { classRoomId_teacherId: { classRoomId: classId, teacherId: teacher.id } },
          update: { isHomeroom: true },
          create: { classRoomId: classId, teacherId: teacher.id, isHomeroom: true },
        });

        // Guru dengan classCode menjadi wali kelas (ClassRoom.teacherId)
        await prisma.classRoom.update({
          where: { id: classId },
          data: { teacherId: teacher.id },
        });
      }
    }
  }

  // Students (termasuk akun wali: guardianPasswordHash untuk login WALIS via NIS anak)
  for (const s of students) {
    const classId = classIdByCode.get(s.classCode);
    if (!classId) continue;
    await prisma.student.upsert({
      where: { nis: s.nis },
      update: {
        name: s.name,
        gender: s.gender,
        classId,
        guardianName: s.guardianName,
        passwordHash: studentHash,
        guardianPasswordHash: guardianHash,
      },
      create: {
        nis: s.nis,
        name: s.name,
        gender: s.gender,
        classId,
        guardianName: s.guardianName,
        passwordHash: studentHash,
        guardianPasswordHash: guardianHash,
      },
    });
  }

  console.log('Seed selesai: config, 3 kelas, 3 guru, 3 siswa.');
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
