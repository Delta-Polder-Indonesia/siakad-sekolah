export interface ExpectationModalProps {
  open: boolean;
  onClose: () => void;
  onOpenRegistration?: () => void;
}

export type NavItem =
  | 'Beranda'
  | 'Profil'
  | 'Program Sekolah'
  | 'Program Keahlian'
  | 'Sarana Prasarana'
  | 'Kegiatan Sekolah'
  | 'Berita'
  | 'Galeri'
  | 'Kontak'
  | 'Agenda'
  | 'details'
  // Halaman detail Berita
  | 'berita-1'
  | 'berita-2'
  | 'berita-3'
  | 'berita-4'
  // Halaman detail Kegiatan Sekolah
  | 'kegiatan-1'
  | 'kegiatan-2'
  | 'kegiatan-3'
  | 'kegiatan-4'
  | 'kegiatan-5'
  // Halaman detail Program Sekolah
  | 'program-1'
  | 'program-2'
  | 'program-3'
  | 'program-4'
  | 'program-5'
  // Halaman detail Program Keahlian
  | 'reg-01'
  | 'reg-02'
  | 'reg-03'
  | 'reg-04'
  | 'reg-05'
  | 'reg-06'
  | 'reg-07'
  // Halaman detail Sarana Prasarana
  | 'facility-1'
  | 'facility-2'
  | 'facility-3'
  | 'facility-4'
  | 'facility-5'
  | 'facility-6'
  | 'facility-7'
  | 'facility-8'
  // Halaman detail Ekstrakurikuler
  | 'ekskul-1'
  | 'ekskul-2'
  | 'ekskul-3'
  | 'ekskul-4'
  | 'ekskul-5'
  | 'ekskul-6'
  | 'ekskul-7'
  | 'ekskul-8'
  | 'ekskul-9'
  | 'ekskul-10'
  // Halaman detail Sekolah Berdampak
  | 'sekolah-berdampak'
  | 'diktisaintek-berdampak'
  // Halaman detail Profil Kepala Sekolah
  | 'profile-kepsek'
  // Halaman detail Research
  | 'riset/riset-air-bersih'
  | 'riset/riset-infrastruktur'
  | 'riset/riset-digitalisasi'
  // Halaman detail SDGs
  | 'sdgs/sdgs-1'
  | 'sdgs/sdgs-2'
  | 'sdgs/sdgs-3'
  | 'sdgs/sdgs-4'
  | 'sdgs/sdgs-5'
  | 'sdgs/sdgs-6'
  | 'sdgs/sdgs-7'
  | 'sdgs/sdgs-8'
  | 'sdgs/sdgs-9'
  | 'sdgs/sdgs-10'
  | 'sdgs/sdgs-11'
  | 'sdgs/sdgs-12'
  | 'sdgs/sdgs-13'
  | 'sdgs/sdgs-14'
  | 'sdgs/sdgs-15'
  | 'sdgs/sdgs-16'
  | 'sdgs/sdgs-17'
  | 'sdgs-sekolah'
  // Halaman detail Sila
  | 'sila-1'
  | 'sila-2'
  | 'sila-3'
  | 'sila-4'
  | 'sila-5'
  | 'sila-6'
  | 'sila-7'
  // Halaman detail Asa
  | 'asa-1'
  | 'asa-2'
  | 'asa-3'
  | 'asa-4'
  | 'asa-5'
  | 'asa-6'
  | 'asa-7'
  | 'asa-8'
  | 'asa-9'
  | 'asa-10'
  | 'asa-11'
  | 'asa-12'
  | 'asa-13'
  | 'asa-14'
  // Halaman detail Ebook
  | 'ebook-1'
  | 'ebook-2'
  | 'ebook-3'
  | 'ebook-4'
  | 'ebook-5'
  | 'ebook-6'
  | 'ebook-7'
  | 'ebook-8';

export interface PageProps {
  onNavigate?: (menu: NavItem) => void;
}

