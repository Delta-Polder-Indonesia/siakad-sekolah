import { lazy } from 'react';

// Group lazy imports by category untuk better code splitting
export const BeritaComponents = {
  Berita01: lazy(() => import('../Berita/Berita01')),
  Berita02: lazy(() => import('../Berita/Berita02')),
  Berita03: lazy(() => import('../Berita/Berita03')),
  Berita04: lazy(() => import('../Berita/Berita04')),
};

export const ProgramKeahlianComponents = {
  Reg01: lazy(() => import('../ProgramKeahlian/REG-01')),
  Reg02: lazy(() => import('../ProgramKeahlian/REG-02')),
  Reg03: lazy(() => import('../ProgramKeahlian/REG-03')),
  Reg04: lazy(() => import('../ProgramKeahlian/REG-04')),
  Reg05: lazy(() => import('../ProgramKeahlian/REG-05')),
  Reg06: lazy(() => import('../ProgramKeahlian/REG-06')),
  Reg07: lazy(() => import('../ProgramKeahlian/REG-07')),
};

export const ProgramSekolahComponents = {
  Program1: lazy(() => import('../ProgramSekolah/Program-1')),
  Program2: lazy(() => import('../ProgramSekolah/Program-2')),
  Program3: lazy(() => import('../ProgramSekolah/Program-3')),
  Program4: lazy(() => import('../ProgramSekolah/Program-4')),
  Program5: lazy(() => import('../ProgramSekolah/Program-5')),
};

export const SaranaPrasaranaComponents = {
  Facility01: lazy(() => import('../SaranaPrasarana/Facility01')),
  Facility02: lazy(() => import('../SaranaPrasarana/Facility02')),
  Facility03: lazy(() => import('../SaranaPrasarana/Facility03')),
  Facility04: lazy(() => import('../SaranaPrasarana/Facility04')),
  Facility05: lazy(() => import('../SaranaPrasarana/Facility05')),
  Facility06: lazy(() => import('../SaranaPrasarana/Facility06')),
  Facility07: lazy(() => import('../SaranaPrasarana/Facility07')),
  Facility08: lazy(() => import('../SaranaPrasarana/Facility08')),
};

export const KegiatanSekolahComponents = {
  Strategis01: lazy(() => import('../KegiatanSekolah/Strategis01')),
  Strategis02: lazy(() => import('../KegiatanSekolah/Strategis02')),
  Strategis03: lazy(() => import('../KegiatanSekolah/Strategis03')),
  Strategis04: lazy(() => import('../KegiatanSekolah/Strategis04')),
  Strategis05: lazy(() => import('../KegiatanSekolah/Strategis05')),
};

export const EkstrakurikulerComponents = {
  Ekskul1: lazy(() => import('../Ekstrakurikuler/Ekskul-1')),
  Ekskul2: lazy(() => import('../Ekstrakurikuler/Ekskul-2')),
  Ekskul3: lazy(() => import('../Ekstrakurikuler/Ekskul-3')),
  Ekskul4: lazy(() => import('../Ekstrakurikuler/Ekskul-4')),
  Ekskul5: lazy(() => import('../Ekstrakurikuler/Ekskul-5')),
  Ekskul6: lazy(() => import('../Ekstrakurikuler/Ekskul-6')),
  Ekskul7: lazy(() => import('../Ekstrakurikuler/Ekskul-7')),
  Ekskul8: lazy(() => import('../Ekstrakurikuler/Ekskul-8')),
  Ekskul9: lazy(() => import('../Ekstrakurikuler/Ekskul-9')),
  Ekskul10: lazy(() => import('../Ekstrakurikuler/Ekskul-10')),
};

export const EbookComponents = {
  Ebook1: lazy(() => import('../Ebook/ebook_1')),
  Ebook2: lazy(() => import('../Ebook/ebook_2')),
  Ebook3: lazy(() => import('../Ebook/ebook_3')),
  Ebook4: lazy(() => import('../Ebook/ebook_4')),
  Ebook5: lazy(() => import('../Ebook/ebook_5')),
  Ebook6: lazy(() => import('../Ebook/ebook_6')),
  Ebook7: lazy(() => import('../Ebook/ebook_7')),
  Ebook8: lazy(() => import('../Ebook/ebook_8')),
};

export const SdgsComponents = {
  Sdgs1: lazy(() => import('../SdgsDetail/Sdgs1')),
  Sdgs2: lazy(() => import('../SdgsDetail/Sdgs2')),
  Sdgs3: lazy(() => import('../SdgsDetail/Sdgs3')),
  Sdgs4: lazy(() => import('../SdgsDetail/Sdgs4')),
  Sdgs5: lazy(() => import('../SdgsDetail/Sdgs5')),
  Sdgs6: lazy(() => import('../SdgsDetail/Sdgs6')),
  Sdgs7: lazy(() => import('../SdgsDetail/Sdgs7')),
  Sdgs8: lazy(() => import('../SdgsDetail/Sdgs8')),
  Sdgs9: lazy(() => import('../SdgsDetail/Sdgs9')),
  Sdgs10: lazy(() => import('../SdgsDetail/Sdgs10')),
  Sdgs11: lazy(() => import('../SdgsDetail/Sdgs11')),
  Sdgs12: lazy(() => import('../SdgsDetail/Sdgs12')),
  Sdgs13: lazy(() => import('../SdgsDetail/Sdgs13')),
  Sdgs14: lazy(() => import('../SdgsDetail/Sdgs14')),
  Sdgs15: lazy(() => import('../SdgsDetail/Sdgs15')),
  Sdgs16: lazy(() => import('../SdgsDetail/Sdgs16')),
  Sdgs17: lazy(() => import('../SdgsDetail/Sdgs17')),
};

export const ResearchComponents = {
  RisetAirBersih: lazy(() => import('../ResearchDetail/RisetAirBersih')),
  RisetInfrastruktur: lazy(() => import('../ResearchDetail/RisetInfrastruktur')),
  RisetDigitalisasi: lazy(() => import('../ResearchDetail/RisetDigitalisasi')),
};

export const SilaAsaComponents = {
  Sila01: lazy(() => import('../SilaAsa/Sila/Sila01')),
  Sila02: lazy(() => import('../SilaAsa/Sila/Sila02')),
  Sila03: lazy(() => import('../SilaAsa/Sila/Sila03')),
  Sila04: lazy(() => import('../SilaAsa/Sila/Sila04')),
  Sila05: lazy(() => import('../SilaAsa/Sila/Sila05')),
  Sila06: lazy(() => import('../SilaAsa/Sila/Sila06')),
  Sila07: lazy(() => import('../SilaAsa/Sila/Sila07')),
  Asa01: lazy(() => import('../SilaAsa/Asa/Asa01')),
  Asa02: lazy(() => import('../SilaAsa/Asa/Asa02')),
  Asa03: lazy(() => import('../SilaAsa/Asa/Asa03')),
  Asa04: lazy(() => import('../SilaAsa/Asa/Asa04')),
  Asa05: lazy(() => import('../SilaAsa/Asa/Asa05')),
  Asa06: lazy(() => import('../SilaAsa/Asa/Asa06')),
  Asa07: lazy(() => import('../SilaAsa/Asa/Asa07')),
  Asa08: lazy(() => import('../SilaAsa/Asa/Asa08')),
  Asa09: lazy(() => import('../SilaAsa/Asa/Asa09')),
  Asa10: lazy(() => import('../SilaAsa/Asa/Asa10')),
  Asa11: lazy(() => import('../SilaAsa/Asa/Asa11')),
  Asa12: lazy(() => import('../SilaAsa/Asa/Asa12')),
  Asa13: lazy(() => import('../SilaAsa/Asa/Asa13')),
  Asa14: lazy(() => import('../SilaAsa/Asa/Asa14')),
};