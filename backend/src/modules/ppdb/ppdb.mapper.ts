// Pemetaan kontrak frontend (ID) ↔ kolom Prisma (EN) + JSON extended.

export type FrontendPPDB = Record<string, unknown>;

export function toPrismaCreate(body: FrontendPPDB) {
  const registrationNo =
    String(body.registrationNo || `PPDB-${Date.now()}-${Math.floor(Math.random() * 1000)}`);
  const birth = body.tanggalLahir || body.birthDate;
  return {
    registrationNo,
    status: String(body.status || 'PENDING'),
    fullName: String(body.namaLengkap || body.fullName || ''),
    nisn: String(body.nisn || ''),
    nik: String(body.nik || ''),
    birthPlace: String(body.tempatLahir || body.birthPlace || ''),
    birthDate: birth ? new Date(String(birth)) : new Date(),
    gender: String(body.jenisKelamin || body.gender || ''),
    religion: String(body.agama || body.religion || ''),
    address: String(body.alamatLengkap || body.address || ''),
    phone: String(body.nomorHp || body.phone || ''),
    whatsapp: body.whatsApp != null ? String(body.whatsApp) : body.whatsapp != null ? String(body.whatsapp) : null,
    email: String(body.email || ''),
    previousSchool: String(body.sekolahAsal || body.previousSchool || ''),
    previousNpsn: body.npsnSekolahAsal != null ? String(body.npsnSekolahAsal) : null,
    majorId: body.majorId != null ? String(body.majorId) : null,
    pathway: String(body.jalurPendaftaran || body.pathway || ''),
    fatherName: body.namaAyah != null ? String(body.namaAyah) : null,
    motherName: body.namaIbu != null ? String(body.namaIbu) : null,
    guardianName: body.namaWali != null ? String(body.namaWali) : null,
    guardianPhone: body.nomorHpWali != null ? String(body.nomorHpWali) : null,
    adminNotes: body.adminNotes != null ? String(body.adminNotes) : null,
    extended: body as object,
  };
}

export function toFrontend(row: {
  id: string;
  registrationNo: string;
  status: string;
  fullName: string;
  nisn: string;
  nik: string;
  birthPlace: string;
  birthDate: Date;
  gender: string;
  religion: string;
  address: string;
  phone: string;
  whatsapp: string | null;
  email: string;
  previousSchool: string;
  previousNpsn: string | null;
  majorId: string | null;
  pathway: string;
  fatherName: string | null;
  motherName: string | null;
  guardianName: string | null;
  guardianPhone: string | null;
  adminNotes: string | null;
  verifiedBy: string | null;
  verifiedAt: Date | null;
  submittedAt: Date;
  extended: unknown;
}): FrontendPPDB {
  const extra = (row.extended && typeof row.extended === 'object' ? row.extended : {}) as FrontendPPDB;
  return {
    ...extra,
    id: row.id,
    registrationNo: row.registrationNo,
    status: row.status,
    namaLengkap: row.fullName,
    nisn: row.nisn,
    nik: row.nik,
    tempatLahir: row.birthPlace,
    tanggalLahir: row.birthDate.toISOString().slice(0, 10),
    jenisKelamin: row.gender,
    agama: row.religion,
    alamatLengkap: row.address,
    nomorHp: row.phone,
    whatsApp: row.whatsapp,
    email: row.email,
    sekolahAsal: row.previousSchool,
    npsnSekolahAsal: row.previousNpsn,
    majorId: row.majorId,
    jalurPendaftaran: row.pathway,
    namaAyah: row.fatherName,
    namaIbu: row.motherName,
    namaWali: row.guardianName,
    nomorHpWali: row.guardianPhone,
    adminNotes: row.adminNotes,
    verifiedBy: row.verifiedBy,
    verifiedAt: row.verifiedAt ? row.verifiedAt.toISOString() : undefined,
    submittedAt: row.submittedAt.toISOString(),
  };
}
