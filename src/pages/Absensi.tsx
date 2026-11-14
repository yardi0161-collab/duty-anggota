import { useState } from 'react';
import { FileText, Mail } from 'lucide-react';
import type { Personnel } from '../types';
import { swapStyle, useSwap } from '../lib';
import PageHeader from '../components/PageHeader';
import DutyForm from '../components/DutyForm';
import LeaveForm from '../components/LeaveForm';

type Tab = 'duty' | 'izin';

interface Props {
  personnel: Personnel;
  rank: string;
  onBack: () => void;
  onSubmitted: (msg: string) => void;
}

export default function Absensi({ personnel, rank, onBack, onSubmitted }: Props) {
  const [tab, setTab] = useState<Tab>('duty');
  const { shown, phase } = useSwap<Tab>(tab, 150);
  const dir = tab === 'izin' ? 1 : -1;
  const tabBtn =
    'relative z-10 flex items-center justify-center gap-2 rounded-xl py-2 font-display text-base focus-visible:outline focus-visible:outline-4 focus-visible:outline-gold';

  const info = [
    { label: 'Personel', value: personnel.name },
    { label: 'Pangkat', value: rank },
    { label: 'ID', value: `#${personnel.serviceId}` },
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <PageHeader title="Duty Terminal" onBack={onBack} />
      <section className="card space-y-4 p-4">
        <div className="grid grid-cols-3 gap-2">
          {info.map((i) => (
            <div key={i.label} className="min-w-0 rounded-xl border-[3px] border-ink bg-sand px-2 py-1">
              <p className="text-[11px] font-extrabold text-bark">{i.label}</p>
              <p className="truncate font-display text-sm leading-tight md:text-base">{i.value}</p>
            </div>
          ))}
        </div>

        <div role="tablist" className="relative grid grid-cols-2 rounded-2xl border-[3px] border-ink bg-sand p-1">
          <span
            aria-hidden="true"
            className="absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-xl border-[3px] border-ink bg-gold shadow-soft transition-transform duration-300 ease-out"
            style={{ transform: tab === 'izin' ? 'translateX(100%)' : 'translateX(0)' }}
          />
          <button role="tab" aria-selected={tab === 'duty'} className={tabBtn} onClick={() => setTab('duty')}>
            <FileText size={18} /> Laporan Duty
          </button>
          <button role="tab" aria-selected={tab === 'izin'} className={tabBtn} onClick={() => setTab('izin')}>
            <Mail size={18} /> Izin
          </button>
        </div>

        <div style={swapStyle(phase, dir, 150, 14)}>
          <div className={shown === 'duty' ? '' : 'hidden'}>
            <DutyForm personnel={personnel} rank={rank} onSubmitted={() => onSubmitted('Laporan duty terkirim')} />
          </div>
          <div className={shown === 'izin' ? '' : 'hidden'}>
            <LeaveForm personnel={personnel} rank={rank} onSubmitted={() => onSubmitted('Pengajuan izin terkirim')} />
          </div>
        </div>
      </section>
    </div>
  );
}
