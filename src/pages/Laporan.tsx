import { ClipboardList, LifeBuoy, Search, ShieldAlert, Target, Ticket } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import PageHeader from '../components/PageHeader';

// Ikon: perisai-tanda-seru = penangkapan, target = kasus besar, kaca pembesar = patroli,
// pelampung = backup (bantuan), tiket = penilangan, papan klip = administrasi.
const CATEGORIES: { name: string; points: number; Icon: LucideIcon }[] = [
  { name: 'Penangkapan', points: 3, Icon: ShieldAlert },
  { name: 'Kasus Besar', points: 10, Icon: Target },
  { name: 'Patroli', points: 5, Icon: Search },
  { name: 'Backup', points: 3, Icon: LifeBuoy },
  { name: 'Penilangan', points: 2, Icon: Ticket },
  { name: 'Administrasi', points: 6, Icon: ClipboardList },
];

export default function Laporan({ onBack }: { onBack: () => void }) {
  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <PageHeader title="Laporan Duty" onBack={onBack} />
      <p className="text-sm font-semibold text-muted">Pengisian laporan per kategori belum tersedia.</p>
      <div className="grid grid-cols-2 gap-3">
        {CATEGORIES.map(({ name, points, Icon }) => (
          // TODO: hubungkan ke formulir laporan per kategori. Sementara dinonaktifkan agar tidak menjadi tombol mati.
          <button
            key={name}
            disabled
            className="card flex flex-col items-center gap-2 px-2 py-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-leaf"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-xl border border-line bg-panel2 text-leaf">
              <Icon size={26} aria-hidden="true" />
            </span>
            <span className="font-display text-lg">{name}</span>
            <span className="rounded-full border border-leaf/30 bg-leafbg px-3 py-0.5 text-xs font-bold text-leaf">+{points} Poin</span>
          </button>
        ))}
      </div>
    </div>
  );
}
