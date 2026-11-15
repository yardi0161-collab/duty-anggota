import { useState } from 'react';
import { FileText, Mail } from 'lucide-react';
import type { DutyInput, IzinInput, Profile } from '../types';
import PageHeader from '../components/PageHeader';
import DutyForm from '../components/DutyForm';
import LeaveForm from '../components/LeaveForm';

type Tab = 'duty' | 'izin';

interface Props {
  personnel: Profile;
  rank: string;
  onBack: () => void;
  onDuty: (i: DutyInput) => Promise<void>;
  onIzin: (i: IzinInput) => Promise<void>;
  onTabSwitch: () => void;
}

// Panel ditumpuk dalam satu sel grid agar tinggi kotak selalu stabil.
// Panel yang tidak aktif memudar dan bergeser ke sisinya; yang aktif masuk dari samping (semua di dalam overflow-hidden).
const PANEL = 'col-start-1 row-start-1 h-full';
const ACTIVE = 'visible opacity-100 translate-x-0 delay-100 duration-200 transition-[opacity,transform] ease-out';
const hidden = (side: 'left' | 'right') =>
  `invisible opacity-0 pointer-events-none ${side === 'left' ? '-translate-x-6' : 'translate-x-6'} transition-[opacity,transform,visibility] duration-150 ease-in`;

export default function Absensi({ personnel, rank, onBack, onDuty, onIzin, onTabSwitch }: Props) {
  const [tab, setTab] = useState<Tab>('duty');
  const pick = (t: Tab) => {
    if (t === tab) return;
    onTabSwitch();
    setTab(t);
  };
  const tabBtn =
    'relative z-10 flex items-center justify-center gap-2 rounded-xl py-3 font-display text-base transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-leaf';

  const info = [
    { label: 'Personel', value: personnel.name },
    { label: 'Pangkat', value: rank },
    { label: 'ID', value: personnel.serviceId ? `#${personnel.serviceId}` : 'Belum diatur' },
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <PageHeader title="Duty Terminal" onBack={onBack} />
      <section className="card space-y-4 p-4">
        <div className="grid gap-2 sm:grid-cols-3">
          {info.map((i) => (
            <div key={i.label} className="min-w-0 rounded-xl border border-line bg-panel2 px-3 py-2">
              <p className="text-[11px] font-extrabold text-muted">{i.label}</p>
              <p className="break-words font-display text-base leading-snug">{i.value}</p>
            </div>
          ))}
        </div>

        <div role="tablist" className="relative grid grid-cols-2 rounded-2xl border border-line bg-panel2 p-1">
          <span
            aria-hidden="true"
            className="absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-xl border border-leaf/50 bg-leafbg transition-transform duration-300 ease-out"
            style={{ transform: tab === 'izin' ? 'translateX(100%)' : 'translateX(0)' }}
          />
          <button role="tab" aria-selected={tab === 'duty'} className={`${tabBtn} ${tab === 'duty' ? 'text-leaf' : 'text-muted'}`} onClick={() => pick('duty')}>
            <FileText size={18} /> Laporan Duty
          </button>
          <button role="tab" aria-selected={tab === 'izin'} className={`${tabBtn} ${tab === 'izin' ? 'text-leaf' : 'text-muted'}`} onClick={() => pick('izin')}>
            <Mail size={18} /> Izin
          </button>
        </div>

        <div className="-mx-1 -my-1 grid overflow-hidden px-1 py-1">
          <div role="tabpanel" aria-hidden={tab !== 'duty'} className={`${PANEL} ${tab === 'duty' ? ACTIVE : hidden('left')}`}>
            <DutyForm personnel={personnel} rank={rank} onSubmit={onDuty} />
          </div>
          <div role="tabpanel" aria-hidden={tab !== 'izin'} className={`${PANEL} ${tab === 'izin' ? ACTIVE : hidden('right')}`}>
            <LeaveForm personnel={personnel} rank={rank} onSubmit={onIzin} />
          </div>
        </div>
      </section>
    </div>
  );
}
