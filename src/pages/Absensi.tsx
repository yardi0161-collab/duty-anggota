import { useState } from 'react';
import { ArrowLeft, FileText, Mail } from 'lucide-react';
import type { Personnel } from '../types';
import DutyForm from '../components/DutyForm';
import LeaveForm from '../components/LeaveForm';

interface Props {
  personnel: Personnel;
  rank: string;
  onBack: () => void;
  onSubmitted: (msg: string) => void;
}

export default function Absensi({ personnel, rank, onBack, onSubmitted }: Props) {
  const [tab, setTab] = useState<'duty' | 'izin'>('duty');
  const tabClass = (active: boolean) => `btn flex-1 ${active ? 'bg-gold' : 'bg-white'}`;

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <button onClick={onBack} className="btn bg-sand">
        <ArrowLeft size={18} /> KEMBALI
      </button>
      <div className="flex gap-2" role="tablist">
        <button role="tab" aria-selected={tab === 'duty'} className={tabClass(tab === 'duty')} onClick={() => setTab('duty')}>
          <FileText size={18} /> Form Laporan Duty
        </button>
        <button role="tab" aria-selected={tab === 'izin'} className={tabClass(tab === 'izin')} onClick={() => setTab('izin')}>
          <Mail size={18} /> Form Izin
        </button>
      </div>
      {tab === 'duty' ? (
        <DutyForm personnel={personnel} rank={rank} onSubmitted={() => onSubmitted('Laporan duty terkirim')} />
      ) : (
        <LeaveForm personnel={personnel} rank={rank} onSubmitted={() => onSubmitted('Pengajuan izin terkirim')} />
      )}
    </div>
  );
}
