import { useState } from 'react';
import type { FormEvent } from 'react';
import { Send } from 'lucide-react';
import type { Personnel } from '../types';
import { todayISO } from '../lib';
import AccountField from './AccountField';

interface Props {
  personnel: Personnel;
  rank: string;
  onSubmitted: () => void;
}

export default function LeaveForm({ personnel, rank, onSubmitted }: Props) {
  const [date, setDate] = useState(todayISO());
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!date || !reason.trim()) {
      setError('Lengkapi tanggal dan alasan izin.');
      return;
    }
    setError('');
    setReason('');
    onSubmitted();
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-3">
        <AccountField label="Nama" value={personnel.name} />
        <AccountField label="Pangkat" value={rank} />
        <AccountField label="Divisi" value={personnel.division} />
      </div>
      <p className="text-xs font-semibold text-bark">Data akun akan terisi otomatis nanti.</p>
      <label className="block text-sm font-extrabold">
        Tanggal
        <input type="date" className="field mt-1 font-normal sm:max-w-xs" value={date} onChange={(e) => setDate(e.target.value)} />
      </label>
      <label className="block text-sm font-extrabold">
        Alasan Izin
        <textarea
          className="field mt-1 min-h-40 font-normal"
          placeholder="Jelaskan alasan pengajuan izin"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      </label>
      {error && <p className="text-sm font-bold text-rust">{error}</p>}
      <button type="submit" className="btn w-full bg-army text-cream">
        <Send size={18} /> KIRIM PENGAJUAN
      </button>
    </form>
  );
}
