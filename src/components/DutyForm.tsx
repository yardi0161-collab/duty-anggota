import { useState } from 'react';
import type { FormEvent } from 'react';
import { Send } from 'lucide-react';
import type { DutyInput, Profile } from '../types';
import { NO_ROLE, todayISO } from '../lib';
import IdentityRow from './IdentityRow';
import PhotoPicker from './PhotoPicker';

interface Props {
  personnel: Profile;
  rank: string;
  verified: boolean;
  onSubmit: (i: DutyInput) => Promise<void>;
}

export default function DutyForm({ personnel, rank, verified, onSubmit }: Props) {
  const [date, setDate] = useState(todayISO());
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [content, setContent] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!date || !start || !end || !content.trim()) {
      setError('Lengkapi tanggal, jam duty, jam off duty, dan catatan duty.');
      return;
    }
    if (end <= start) {
      setError('Jam off duty harus setelah jam duty.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      await onSubmit({ date, start, end, content: content.trim(), photos });
      setStart('');
      setEnd('');
      setContent('');
      setPhotos([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menyimpan presensi.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="flex h-full flex-col gap-4">
      <IdentityRow name={personnel.name} division={personnel.division} rank={rank} />
      <label className="block text-sm font-extrabold">
        Tanggal Duty
        <input type="date" max={todayISO()} className="field mt-1 font-normal" value={date} onChange={(e) => setDate(e.target.value)} />
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className="block text-sm font-extrabold">
          Jam Duty
          <input type="time" className="field mt-1 font-normal" value={start} onChange={(e) => setStart(e.target.value)} />
        </label>
        <label className="block text-sm font-extrabold">
          Jam Off Duty
          <input type="time" className="field mt-1 font-normal" value={end} onChange={(e) => setEnd(e.target.value)} />
        </label>
      </div>
      <label className="block text-sm font-extrabold">
        Catatan Duty / Area Patroli
        <textarea
          className="field mt-1 min-h-32 font-normal leading-relaxed"
          placeholder="Misal: patroli area Los Santos dan respon call-out 10-20"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </label>
      <div>
        <p className="mb-1 text-sm font-extrabold">Bukti Foto</p>
        <PhotoPicker files={photos} onChange={setPhotos} disabled={busy} />
      </div>
      {!verified && <p className="break-words text-sm font-bold text-rust">{NO_ROLE}</p>}
      {error && <p className="break-words text-sm font-bold text-rust">{error}</p>}
      <button type="submit" disabled={busy || !verified} className="btn w-full bg-army text-cream">
        <Send size={18} /> {busy ? 'MENYIMPAN...' : 'SIMPAN PRESENSI DUTY'}
      </button>
    </form>
  );
}
