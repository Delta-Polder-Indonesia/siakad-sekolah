import type { PageProps } from '../../types';
import { ArticleLayout } from '../shared';
import { getEkskulById } from '../../data/ekskulData';
import { namaSekolahUppercase } from '../Profile/dataSekolah';

export default function Ekskul1Page({ onNavigate }: PageProps) {
  const ekskulData = getEkskulById('ekskul-1');

  if (!ekskulData) {
    return <div>Data tidak ditemukan</div>;
  }

  return (
    <ArticleLayout
      title={ekskulData.name}
      imageSrc={ekskulData.imageSrc}
      imageAlt={ekskulData.imageAlt}
      subtitle={ekskulData.subtitle}
      badge={ekskulData.category}
      onNavigate={onNavigate}
      showShareButtons={false}
      showFloatingNav={false}
    >
      <div className="space-y-6">
        <div>
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold tracking-wide text-slate-950 uppercase">
            <span className="h-4 w-1 bg-slate-950" />
            Deskripsi Program
          </h2>
          <p className="text-justify">
            Gerakan Pramuka di {namaSekolahUppercase} merupakan ekstrakurikuler wajib yang telah
            menjadi bagian integral dari sistem pembentukan karakter siswa sejak sekolah ini
            berdiri. Dalam konteks pendidikan nasional, Pramuka bukan sekadar kegiatan kepanduan
            yang mengajarkan tali-temali dan navigasi alam; ia merupakan sistem pendidikan
            non-formal yang secara sistematis membangun kedisiplinan, kepemimpinan, kemandirian,
            dan solidaritas sosial melalui metode pembelajaran experiential yang terbukti efektif
            selama lebih dari satu abad.
          </p>
        </div>

        <div>
          <p className="text-justify">
            Metodologi pembelajaran Pramuka yang mengandalkan pengalaman langsung di alam terbuka
            memberikan dimensi pedagogis yang tidak dapat digantikan oleh pembelajaran di dalam
            kelas. Ketika siswa menghadapi tantangan mendirikan tenda di tengah hujan, memasak
            menggunakan bahan terbatas, atau menentukan arah menggunakan kompas dan peta, mereka
            tidak hanya mengembangkan keterampilan teknis melainkan juga membangun ketahanan
            mental dan kemampuan pemecahan masalah di bawah tekanan. Dalam teori pendidikan, ini
            dikenal sebagai pembelajaran berbasis pengalaman atau experiential learning yang
            memperkuat retensi dan aplikasi pengetahuan secara signifikan dibandingkan metode
            ceramah konvensional.
          </p>
        </div>

        <div>
          <p className="text-justify">
            Sistem regu dalam Pramuka mengajarkan prinsip-prinsip kepemimpinan dan kerja sama tim
            yang relevan dengan dunia kerja modern. Setiap anggota regu memiliki peran dan
            tanggung jawab spesifik, dan keberhasilan kelompok bergantung pada kontribusi dan
            koordinasi setiap individu. Pemimpin regu belajar untuk mendelegasikan tugas,
            mengambil keputusan di bawah ketidakpastian, dan mempertahankan moral kelompok dalam
            situasi sulit. Anggota regu belajar untuk mengikuti arahan dengan disiplin sekaligus
            berinisiatif ketika diperlukan. Dinamika ini mencerminkan realitas organisasi
            profesional yang akan dihadapi siswa dalam karir mereka.
          </p>
        </div>

        <div>
          <p className="text-justify">
            Dasa Darma Pramuka, sebagai kode etik gerakan kepanduan Indonesia, menanamkan
            nilai-nilai moral yang komprehensif mulai dari ketakwaan kepada Tuhan, cinta alam dan
            kasih sayang sesama manusia, patriotisme, kedisiplinan, keberanian, kesetiaan, hemat
            dan cermat, hingga bertanggung jawab dan dapat dipercaya. Internalisasi nilai-nilai
            ini melalui kegiatan yang menyenangkan dan bermakna membentuk fondasi karakter yang
            kuat—karakter yang tidak hanya relevan untuk kehidupan profesional melainkan juga
            untuk kehidupan sebagai warga negara yang bertanggung jawab.
          </p>
        </div>

        <div>
          <p className="text-justify">
            Prestasi Pramuka {namaSekolahUppercase} dalam berbagai kompetisi tingkat kota dan
            provinsi mencerminkan kualitas pembinaan yang konsisten dan komitmen siswa terhadap
            pengembangan diri. Namun, nilai sejati dari program Pramuka tidak hanya diukur dari
            trofi dan penghargaan; ia diukur dari perubahan yang terjadi pada diri setiap siswa
            yang telah menjalani proses kepanduan selama tiga tahun—dari siswa yang awalnya ragu
            menghadapi tantangan menjadi pemuda yang percaya diri, disiplin, dan siap mengabdi
            kepada masyarakat.
          </p>
        </div>
      </div>
    </ArticleLayout>
  );
}