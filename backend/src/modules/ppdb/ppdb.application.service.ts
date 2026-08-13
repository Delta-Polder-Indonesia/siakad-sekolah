import { prisma } from '../../lib/prisma.js';
import { NotFoundError } from '../../utils/errors.js';
import { toFrontend, toPrismaCreate, type FrontendPPDB } from './ppdb.mapper.js';

export async function listApplications() {
  const rows = await prisma.pPDBApplication.findMany({ orderBy: { submittedAt: 'desc' } });
  return rows.map((r) => toFrontend(r));
}

export async function getApplication(id: string) {
  const row = await prisma.pPDBApplication.findUnique({ where: { id } });
  if (!row) throw new NotFoundError('PPDBApplication', id);
  return toFrontend(row);
}

export async function getApplicationByRegNo(regNo: string) {
  const row = await prisma.pPDBApplication.findUnique({ where: { registrationNo: regNo } });
  return row ? toFrontend(row) : null;
}

export async function createApplication(body: FrontendPPDB) {
  const data = toPrismaCreate(body);
  const row = await prisma.pPDBApplication.create({ data });
  await prisma.pPDBAuditLog.create({
    data: {
      applicationId: row.id,
      action: 'SUBMIT_APPLICATION',
      actor: 'public',
      metadata: { registrationNo: row.registrationNo },
    },
  });
  return toFrontend(row);
}

export async function updateApplicationStatus(
  id: string,
  status: string,
  adminNotes?: string,
  verifiedBy?: string
) {
  const existing = await prisma.pPDBApplication.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError('PPDBApplication', id);
  const row = await prisma.pPDBApplication.update({
    where: { id },
    data: {
      status,
      adminNotes: adminNotes ?? existing.adminNotes,
      verifiedBy: verifiedBy ?? existing.verifiedBy,
      verifiedAt: status === 'VERIFIED' || status === 'ACCEPTED' ? new Date() : existing.verifiedAt,
    },
  });
  await prisma.pPDBAuditLog.create({
    data: {
      applicationId: id,
      action: 'UPDATE_STATUS',
      actor: verifiedBy || 'admin',
      metadata: { status },
    },
  });
  return toFrontend(row);
}

export async function deleteApplication(id: string) {
  const existing = await prisma.pPDBApplication.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError('PPDBApplication', id);
  await prisma.pPDBApplication.delete({ where: { id } });
  return true;
}

export async function listAuditLogs() {
  return prisma.pPDBAuditLog.findMany({ orderBy: { occurredAt: 'desc' }, take: 500 });
}

export async function getStatistics() {
  const rows = await prisma.pPDBApplication.groupBy({
    by: ['status'],
    _count: { _all: true },
  });
  const byStatus = Object.fromEntries(rows.map((r) => [r.status, r._count._all]));
  const total = rows.reduce((s, r) => s + r._count._all, 0);
  return { total, byStatus };
}
