import { useState } from 'react';
import type { FormEvent } from 'react';
import { Send } from 'lucide-react';
import type { CutiInput, Profile } from '../types';
import { NO_ROLE, todayISO } from '../lib';
import IdentityRow from './IdentityRow';

interface Props {
  personnel: Profile;
  rank: string;
  verified: boolean;
  onSubmit: (i: CutiInput) => Promise<void>;
}

export default function CutiForm({ personnel, rank, verified, onSubmit }: Props) {
  const [startDate, setStartDate] = useState(todayISO());
  const [endDate, setEndDate] = useState(todayISO());
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate || !reason.trim()) {
      setError('Lengkapi tanggal mulai, tanggal berakhir, dan alasan cuti.');
      return;
    }
    if (endDate < startDate) {
      setError('Tanggal berakhir tidak boleh sebelum tanggal mulai.');
      return;
    }
    const days = (new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000;
    if (days > 60) {
      setError('Cuti maksimal 60 hari.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      await onSubmit({ startDate, endDate, reason: reason.trim() });
      setReason('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menyimpan pengajuan.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="flex h-full flex-col gap-4">
      <IdentityRow name={personnel.name} division={personnel.division} rank={rank} />
      <div className="grid grid-cols-2 gap-3">
        <label className="block text-sm font-extrabold">
          Tanggal Mulai Cuti
          <input type="date" min={todayISO()} className="field mt-1 font-normal" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </label>
        <label className="block text-sm font-extrabold">
          Tanggal Berakhir Cuti
          <input type="date" min={startDate || todayISO()} className="field mt-1 font-normal" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </label>
      </div>
      <label className="flex flex-1 flex-col text-sm font-extrabold">
        Alasan Pengajuan Cuti
        <textarea
          className="field mt-1 min-h-32 flex-1 font-normal leading-relaxed"
          placeholder="Jelaskan alasan pengajuan cuti"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      </label>
      {!verified && <p className="break-words text-sm font-bold text-rust">{NO_ROLE}</p>}
      {error && <p className="break-words text-sm font-bold text-rust">{error}</p>}
      <button type="submit" disabled={busy || !verified} className="btn w-full bg-army text-cream">
        <Send size={18} /> {busy ? 'MENYIMPAN...' : 'KIRIM PENGAJUAN CUTI'}
      </button>
    </form>
  );
}
