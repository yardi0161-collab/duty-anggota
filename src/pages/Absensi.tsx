import { useState } from 'react';
import { CalendarDays, ClipboardCheck } from 'lucide-react';
import type { CutiInput, DutyInput, Profile } from '../types';
import PageHeader from '../components/PageHeader';
import DutyForm from '../components/DutyForm';
import CutiForm from '../components/CutiForm';

type Tab = 'duty' | 'cuti';

interface Props {
  personnel: Profile;
  rank: string;
  verified: boolean;
  onBack: () => void;
  onDuty: (i: DutyInput) => Promise<void>;
  onCuti: (i: CutiInput) => Promise<void>;
  onTabSwitch: () => void;
}

// Kedua form ditumpuk dalam satu sel grid agar tinggi kotak stabil. Yang tidak aktif memudar ke sisinya.
const PANEL = 'col-start-1 row-start-1 h-full';
const ACTIVE = 'visible opacity-100 translate-x-0 delay-100 duration-200 transition-[opacity,transform] ease-out';
const hidden = (side: 'left' | 'right') =>
  `invisible opacity-0 pointer-events-none ${side === 'left' ? '-translate-x-6' : 'translate-x-6'} transition-[opacity,transform,visibility] duration-150 ease-in`;

export default function Absensi({ personnel, rank, verified, onBack, onDuty, onCuti, onTabSwitch }: Props) {
  const [tab, setTab] = useState<Tab>('duty');
  const pick = (t: Tab) => {
    if (t === tab) return;
    onTabSwitch();
    setTab(t);
  };
  const tile = (active: boolean) =>
    `flex min-h-[56px] items-center justify-center gap-2 rounded-xl border px-2 py-3 text-center font-display text-base transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-leaf ${
      active ? 'border-leaf bg-leafbg text-leaf' : 'border-line bg-panel2 text-muted'
    }`;

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <PageHeader title={tab === 'duty' ? 'PRESENSI DUTY' : 'PENGAJUAN CUTI'} onBack={onBack} />
      <section className="card space-y-4 p-4">
        <div>
          <p className="mb-1 text-sm font-extrabold">Jenis Laporan</p>
          <div role="tablist" className="grid grid-cols-2 gap-2">
            <button role="tab" aria-selected={tab === 'duty'} className={tile(tab === 'duty')} onClick={() => pick('duty')}>
              <ClipboardCheck size={18} aria-hidden="true" /> PRESENSI DUTY
            </button>
            <button role="tab" aria-selected={tab === 'cuti'} className={tile(tab === 'cuti')} onClick={() => pick('cuti')}>
              <CalendarDays size={18} aria-hidden="true" /> PENGAJUAN CUTI
            </button>
          </div>
        </div>

        <div className="-mx-1 -my-1 grid overflow-hidden px-1 py-1">
          <div role="tabpanel" aria-hidden={tab !== 'duty'} className={`${PANEL} ${tab === 'duty' ? ACTIVE : hidden('left')}`}>
            <DutyForm personnel={personnel} rank={rank} verified={verified} onSubmit={onDuty} />
          </div>
          <div role="tabpanel" aria-hidden={tab !== 'cuti'} className={`${PANEL} ${tab === 'cuti' ? ACTIVE : hidden('right')}`}>
            <CutiForm personnel={personnel} rank={rank} verified={verified} onSubmit={onCuti} />
          </div>
        </div>
      </section>
    </div>
  );
}
