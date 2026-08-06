import MasterAnggota from './MasterAnggota';
import MasterBuku from './MasterBuku';
import MasterKategori from './MasterKategori';
import MasterPenerbit from './MasterPenerbit';
import MasterRak from './MasterRak';

interface PerpusMasterDataProps {
  activeSubTab: string;
}

export default function PerpusMasterData({ activeSubTab }: PerpusMasterDataProps) {
  switch (activeSubTab) {
    case 'anggota':
      return <MasterAnggota />;
    case 'buku':
      return <MasterBuku />;
    case 'kategori':
      return <MasterKategori />;
    case 'penerbit':
      return <MasterPenerbit />;
    case 'rak':
      return <MasterRak />;
    default:
      return <MasterBuku />;
  }
}
