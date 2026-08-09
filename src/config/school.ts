export const schoolConfig = {
  name: 'Portal Sekolah',
  contact: {
    phone: '+62 XXX XXX XXXX',
    email: 'info@sekolah.com',
    address: 'Jl. Pendidikan No. 123',
  },
  hours: {
    weekdays: { open: '07:00', close: '16:00', label: 'Senin - Jumat' },
    saturday: { open: '07:00', close: '12:00', label: 'Sabtu' },
    sunday: { closed: true, label: 'Minggu' },
  },
  feedback: {
    processingTime: '1-2 hari kerja',
    urgentPriorityLabel: 'Tinggi',
  },
} as const;

export type SchoolConfig = typeof schoolConfig;
