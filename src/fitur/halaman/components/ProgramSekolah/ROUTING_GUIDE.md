# 📋 Panduan Routing Program Sekolah

## Route yang perlu didaftarkan di router utama:

| Route ID           | Komponen              | Deskripsi                          |
|--------------------|-----------------------|------------------------------------|
| `program-sekolah`  | `ProgramSekolahPage`  | Halaman daftar program (utama)     |
| `program-1`        | `Program1Page`        | Detail: Penguatan Karakter         |
| `program-2`        | `Program2Page`        | Detail: Kelas Industri             |
| `program-3`        | `Program3Page`        | Detail: Magang Siswa               |
| `program-4`        | `Program4Page`        | Detail: Sertifikasi Kompetensi     |
| `program-5`        | `Program5Page`        | Detail: Pendampingan Karir         |

## Contoh pendaftaran di router (React Router v6):

```tsx
import ProgramSekolahPage from './components/ProgramSekolah/ProgramSekolahPage';
import Program1Page from './components/ProgramSekolah/Program-1';
import Program2Page from './components/ProgramSekolah/Program-2';
import Program3Page from './components/ProgramSekolah/Program-3';
import Program4Page from './components/ProgramSekolah/Program-4';
import Program5Page from './components/ProgramSekolah/Program-5';

// Di dalam Routes:
<Route path="/program-sekolah" element={<ProgramSekolahPage onNavigate={(id) => navigate(`/${id}`)} />} />
<Route path="/program-1" element={<Program1Page onNavigate={(id) => navigate(`/${id}`)} />} />
<Route path="/program-2" element={<Program2Page onNavigate={(id) => navigate(`/${id}`)} />} />
<Route path="/program-3" element={<Program3Page onNavigate={(id) => navigate(`/${id}`)} />} />
<Route path="/program-4" element={<Program4Page onNavigate={(id) => navigate(`/${id}`)} />} />
<Route path="/program-5" element={<Program5Page onNavigate={(id) => navigate(`/${id}`)} />} />
```

## Contoh pendaftaran di sistem custom navigation (tanpa React Router):

```tsx
const [currentPage, setCurrentPage] = useState('program-sekolah');

const renderPage = () => {
  switch(currentPage) {
    case 'program-sekolah': return <ProgramSekolahPage onNavigate={setCurrentPage} />;
    case 'program-1': return <Program1Page onNavigate={setCurrentPage} />;
    case 'program-2': return <Program2Page onNavigate={setCurrentPage} />;
    case 'program-3': return <Program3Page onNavigate={setCurrentPage} />;
    case 'program-4': return <Program4Page onNavigate={setCurrentPage} />;
    case 'program-5': return <Program5Page onNavigate={setCurrentPage} />;
    default: return <ProgramSekolahPage onNavigate={setCurrentPage} />;
  }
};
```
