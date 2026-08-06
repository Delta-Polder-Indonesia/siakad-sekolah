import { namaSekolah } from './dataSekolah';
import { useSectionNavigate } from '../../context/NavigationContext';
export default function SambutanKepsek() {
  const navigateTo = useSectionNavigate();
  return (
    <div className="bg-white font-serif">
      {/* JUDUL */}
      <div className="mx-auto max-w-6xl px-6 pt-14 pb-4 md:px-12 md:pt-10">
        <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">Sambutan Kepala Sekolah</h2>
        <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-slate-700">
          Pesan resmi dari Kepala {namaSekolah} kepada seluruh warga sekolah, orang tua, alumni, dan
          masyarakat umum.
        </p>
      </div>

      {/* KONTEN */}
      <div className="mx-auto max-w-6xl px-6 pb-20 md:px-12 md:pb-28">
        <article className="pt-10 text-justify text-[15px] leading-relaxed text-slate-800 md:pt-12">
          {/* FOTO KOTAK DENGAN BINGKAI + TOMBOL PROFIL — float ke kiri, teks membungkus */}
          <div className="float-left mr-6 mb-6">
            <div className="relative w-40 rounded-lg bg-white p-1.5 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.10)] md:w-48">
              <div className="rounded-lg bg-gradient-to-b from-[#8ABAA3] to-[#b0d1c1] p-0.5">
                <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-slate-100">
                  <img
                    src={`${import.meta.env.BASE_URL}images/GuruPegawai/kepala-sekolah.jpg`}
                    alt="Foto Kepala Sekolah"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      const t = e.target as HTMLImageElement;
                      t.style.display = 'none';
                      if (t.parentElement) {
                        // Safer: create element instead of innerHTML
                        t.parentElement.textContent = '';
                        const fallback = document.createElement('div');
                        fallback.className =
                          'flex h-full w-full items-center justify-center text-xs font-medium text-slate-400';
                        fallback.textContent = 'Foto Resmi';
                        t.parentElement.appendChild(fallback);
                      }
                    }}
                  />
                </div>
              </div>

              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo('profile-kepsek');
                }}
                className="group ease absolute -bottom-4 left-1/2 flex h-9 w-[8.75rem] -translate-x-1/2 items-center justify-center gap-2 rounded-md border border-solid border-slate-400 bg-transparent px-4 py-2 transition duration-300 hover:bg-slate-100"
              >
                <p className="text-xs leading-[1.125rem] font-medium text-black">Profil Kepsek</p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 256 256"
                  className="ease text-black transition duration-300 group-hover:translate-x-1"
                >
                  <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"></path>
                </svg>
              </a>
            </div>
          </div>

          <p className="mb-3 font-bold text-slate-900">
            Assalamu'alaikum Warahmatullahi Wabarakatuh.
          </p>

          <p className="mb-4">
            Selamat datang di website resmi Sekolah Menengah Atas Negeri 1 Medan. Dalam perkembangan
            era globalisasi dan pesatnya kemajuan teknologi dan informasi, tidak dapat dipungkiri
            bahwa keberadaan sebuah website untuk dunia pendidikan khususnya sekolah, sangatlah
            penting. Media website dapat digunakan sebagai penyedia sarana dalam menyebarluaskan
            informasi dan perkembangan terkini dari sekolah, yang memang harus diketahui oleh setiap
            stakeholder secara riil.
          </p>

          <p className="mb-4">
            Website juga dapat dijadikan sarana komunikasi antara sekolah dengan para alumni. Bahkan
            alumni dapat memanfaatkan website sekolah untuk koordinasi dan konsolidasi, sehingga
            terbentuk ikatan alumni yang semakin solid. Sekolah menyadari bahwa alumni merupakan
            salah satu potensi yang apabila digali dan dikelola dengan baik dan benar akan mampu
            memberikan kontribusi yang sangat besar dan positif kepada sekolah. Oleh karena itu,
            saya sangat berharap, melalui website ini, himpunan alumni {namaSekolah} semakin kuat,
            sehingga pada waktunya nanti dapat memberikan kontribusi yang sangat besar bagi kemajuan
            sekolah tercinta ini.
          </p>

          <p className="mb-4">
            Akhir kata <em>"Tak ada gading yang tak retak"</em> segala sesuatu pasti memiliki
            kekurangan atau kelemahan masing-masing baik dalam bentuk tulisan maupun penyajian pada
            website {namaSekolah}. Oleh karena itu, kami akan terus belajar dan meng-update diri,
            sehingga mutu dan kualitas dari tampilan serta isi website kami akan terus berkembang.
            Kepada tim pembuat dan pengelola website sekolah, kami mengharapkan agar terus
            senantiasa mengembangkan website dengan semangat dan pantang menyerah. Terima kasih atas
            kerjasamanya, maju terus untuk mencapai {namaSekolah} yang lebih berkualitas dan sukses
            dalam mencerdaskan kehidupan anak Bangsa Indonesia.
          </p>

          <p className="mb-6 font-bold text-slate-900">
            Wassalamu'alaikum Warahmatullahi Wabarakatuh.
          </p>

          {/* Tanda tangan / nama — clear float supaya turun di bawah */}
          <div className="clear-both pt-6">
            <p className="text-[15px] text-slate-700">Hormat kami,</p>
            <p className="mt-8 text-xl font-bold text-slate-900 md:text-2xl">
              Drs. H. Mulyono, M.Pd.
            </p>
            <p className="mt-1 text-[14px] text-slate-600">Kepala {namaSekolah}</p>
          </div>
        </article>
      </div>
    </div>
  );
}
