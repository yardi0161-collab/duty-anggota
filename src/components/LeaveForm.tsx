import { useState } from 'react';
import type { FormEvent } from 'react';
import { Send } from 'lucide-react';
import type { IzinInput, Profile } from '../types';
import { todayISO } from '../lib';
import AccountField from './AccountField';

interface Props {
  personnel: Profile;
  rank: string;
  onSubmit: (i: IzinInput) => Promise<void>;
}

export default function LeaveForm({ personnel, rank, onSubmit }: Props) {
  const [date, setDate] = useState(todayISO());
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!date || !reason.trim()) {
      setError('Lengkapi tanggal dan alasan izin.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      await onSubmit({ date, reason: reason.trim() });
      setReason('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menyimpan pengajuan.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="flex h-full flex-col gap-3">
      <div className="grid gap-3 sm:grid-cols-3">
        <AccountField label="Nama" value={personnel.name} />
        <AccountField label="Pangkat" value={rank} />
        <AccountField label="Divisi" value={personnel.division || 'Belum diatur (isi di Profile)'} />
      </div>
      <label className="block text-sm font-extrabold">
        Tanggal
        <input type="date" max={todayISO()} className="field mt-1 font-normal sm:max-w-xs" value={date} onChange={(e) => setDate(e.target.value)} />
      </label>
      <label className="flex flex-1 flex-col text-sm font-extrabold">
        Alasan Izin
        <textarea
          className="field mt-1 min-h-40 flex-1 font-normal leading-relaxed"
          placeholder="Jelaskan alasan pengajuan izin"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      </label>
      {error && <p className="break-words text-sm font-bold text-rust">{error}</p>}
      <button type="submit" disabled={busy} className="btn w-full bg-army text-cream">
        <Send size={18} /> {busy ? 'MENYIMPAN...' : 'KIRIM PENGAJUAN'}
      </button>
    </form>
  );
}
