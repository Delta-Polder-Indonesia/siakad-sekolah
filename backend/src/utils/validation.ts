import { z } from 'zod';
import { logger } from '../config/logger.js';

/**
 * Validation schemas untuk authentication endpoints
 */

// Login schema
export const loginSchema = z.object({
  role: z.enum(['GURU', 'MURID', 'WALIS', 'TAMU']),
  id: z.string().optional(),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

// Google login schema
export const googleLoginSchema = z.object({
  idToken: z.string().min(1, 'Google ID Token wajib diisi'),
  role: z.enum(['teacher', 'student', 'guest']),
});

// Admin login schema
export const adminLoginSchema = z.object({
  username: z.string().min(1, 'Username wajib diisi'),
  pin: z.string().min(1, 'PIN wajib diisi'),
});

// Refresh token schema
export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token wajib diisi'),
});

// Password validation schema
export const passwordValidationSchema = z.object({
  password: z.string().min(1, 'Password wajib diisi'),
});

// Change password schema
export const changePasswordSchema = z.object({
  teacherId: z.string().optional(),
  studentId: z.string().optional(),
  oldPassword: z.string().min(1, 'Password lama wajib diisi'),
  newPassword: z.string().min(8, 'Password baru minimal 8 karakter'),
});

// School config schema
export const schoolConfigSchema = z.object({
  name: z.string().min(1, 'Nama sekolah wajib diisi'),
  shortName: z.string().min(1, 'Nama singkat wajib diisi'),
  type: z.string().min(1, 'Tipe sekolah wajib diisi'),
  npsn: z.string().optional(),
  founded: z.number().optional(),
  accreditation: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Email tidak valid').optional(),
  website: z.string().url('Website tidak valid').optional(),
  addressStreet: z.string().optional(),
  addressDistrict: z.string().optional(),
  addressCity: z.string().optional(),
  addressProvince: z.string().optional(),
  addressZip: z.string().optional(),
  mapsEmbedUrl: z.string().url('URL maps tidak valid').optional(),
  mapsDirectUrl: z.string().url('URL maps tidak valid').optional(),
  logoUrl: z.string().url('URL logo tidak valid').optional(),
  profilePdfUrl: z.string().url('URL PDF tidak valid').optional(),
  heroImageUrl: z.string().optional(),
  instagram: z.string().optional(),
  youtube: z.string().optional(),
  facebook: z.string().optional(),
  guestAccessCode: z
    .string()
    .regex(/^[A-Za-z0-9]{6,16}$/, 'Kode akses tamu hanya huruf/angka 6-16 karakter')
    .optional(),
  weekdayLabel: z.string().optional(),
  weekdayHours: z.string().optional(),
  weekendLabel: z.string().optional(),
  weekendHours: z.string().optional(),
  statStudents: z.string().optional(),
  statTeachers: z.string().optional(),
  statAchievements: z.string().optional(),
  statAccreditation: z.string().optional(),
  ppdbYear: z.string().optional(),
  ppdbIsOpen: z.boolean().optional(),
  ppdbRegistrationUrl: z.string().url('URL pendaftaran PPDB tidak valid').optional(),
  ppdbQuota: z.number().int().min(0).optional(),
  ppdbOpenDate: z.string().optional(),
  ppdbCloseDate: z.string().optional(),
  featureContactForm: z.boolean().optional(),
  featurePpdb: z.boolean().optional(),
  featureLibrary: z.boolean().optional(),
  featureOnlineAssignment: z.boolean().optional(),
  featureReportCard: z.boolean().optional(),
  featureBilling: z.boolean().optional(),
  featureElearning: z.boolean().optional(),
});

/**
 * Validate request body against schema
 */
export function validateRequest<T>(schema: z.ZodSchema<T>, data: unknown):
  | { success: true; data: T }
  | { success: false; errors: Record<string, string[]> } {
  const result = schema.safeParse(data);
  
  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    logger.warn('Request validation failed', { errors });
    
    const formatted: Record<string, string[]> = {};
    for (const [key, value] of Object.entries(errors)) {
      formatted[key] = Array.isArray(value) ? value : [];
    }
    
    return {
      success: false,
      errors: formatted,
    };
  }
  
  return {
    success: true,
    data: result.data,
  };
}

/**
 * Express middleware untuk request validation
 */
export function validateBody<T>(schema: z.ZodSchema<T>) {
  return (req: any, res: any, next: any) => {
    const result = validateRequest(schema, req.body);
    
    if (!result.success) {
      return res.status(400).json({
        ok: false,
        message: 'Data tidak valid',
        errors: result.errors,
      });
    }
    
    req.validatedBody = result.data;
    next();
  };
}

/**
 * Validate query parameters
 */
export function validateQuery<T>(schema: z.ZodSchema<T>) {
  return (req: any, res: any, next: any) => {
    const result = validateRequest(schema, req.query);
    
    if (!result.success) {
      return res.status(400).json({
        ok: false,
        message: 'Query parameter tidak valid',
        errors: result.errors,
      });
    }
    
    req.validatedQuery = result.data;
    next();
  };
}

/**
 * Validate route parameters
 */
export function validateParams<T>(schema: z.ZodSchema<T>) {
  return (req: any, res: any, next: any) => {
    const result = validateRequest(schema, req.params);
    
    if (!result.success) {
      return res.status(400).json({
        ok: false,
        message: 'Parameter tidak valid',
        errors: result.errors,
      });
    }
    
    req.validatedParams = result.data;
    next();
  };
}

/**
 * Common validation errors
 */
export const VALIDATION_ERRORS = {
  REQUIRED: 'Field ini wajib diisi',
  INVALID_EMAIL: 'Email tidak valid',
  INVALID_URL: 'URL tidak valid',
  MIN_LENGTH: (min: number) => `Minimal ${min} karakter`,
  MAX_LENGTH: (max: number) => `Maksimal ${max} karakter`,
  INVALID_ENUM: 'Nilai tidak valid',
  INVALID_TYPE: 'Tipe data tidak valid',
} as const;