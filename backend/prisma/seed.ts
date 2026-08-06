// Seed data awal agar backend punya akun demo yang sama dengan frontend (store.ts).
// Jalankan: npm run prisma:seed
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const TEACHER_PASSWORD = 'guru123';
const STUDENT_PASSWORD = 'siswa123';

const classes = [
  { code: 'c1', name: 'X IPA 1', grade: 'X' },
  { code: 'c2', name: 'X IPA 2', grade: 'X' },
  { code: 'c3', name: 'X IPS 1', grade: 'X' },
];

const teachers = [
  { nip: '198501012010011001', name: 'Bapak Andi Pratama', subject: 'Matematika', email: 'andi@sekolah.id', classCode: 'c1' },
  { nip: '198701022012012002', name: 'Ibu Rina Kartika', subject: 'Bahasa Indonesia', email: 'rina@sekolah.id', classCode: 'c2' },
  { nip: '198901032014013003', name: 'Bapak Dedi Saputra', subject: 'Fisika', email: 'dedi@sekolah.id', classCode: null },
];

const students = [
  { nis: '2024001', name: 'Siti Rahma', gender: 'P', classCode: 'c1', guardianName: 'Siti Aminah' },
  { nis: '2024002', name: 'Budi Santoso', gender: 'L', classCode: 'c1', guardianName: 'Agus Santoso' },
  { nis: '2024003', name: 'Nabila Putri', gender: 'P', classCode: 'c2', guardianName: 'Dewi Lestari' },
];

async function main() {
  const teacherHash = await bcrypt.hash(TEACHER_PASSWORD, 10);
  const studentHash = await bcrypt.hash(STUDENT_PASSWORD, 10);

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
      update: { name: t.name, subject: t.subject, email: t.email, passwordHash: teacherHash },
      create: { nip: t.nip, name: t.name, subject: t.subject, email: t.email, passwordHash: teacherHash },
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

  // Students
  for (const s of students) {
    const classId = classIdByCode.get(s.classCode);
    if (!classId) continue;
    await prisma.student.upsert({
      where: { nis: s.nis },
      update: { name: s.name, gender: s.gender, classId, guardianName: s.guardianName, passwordHash: studentHash },
      create: { nis: s.nis, name: s.name, gender: s.gender, classId, guardianName: s.guardianName, passwordHash: studentHash },
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
