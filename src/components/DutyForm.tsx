import { useEffect, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { ImagePlus, Send } from 'lucide-react';
import type { DutyInput, Profile } from '../types';
import { todayISO } from '../lib';
import AccountField from './AccountField';

const MAX_PHOTO = 5 * 1024 * 1024;

interface Props {
  personnel: Profile;
  rank: string;
  onSubmit: (i: DutyInput) => Promise<void>;
}

export default function DutyForm({ personnel, rank, onSubmit }: Props) {
  const [date, setDate] = useState(todayISO());
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [content, setContent] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const pickPhoto = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
    if (file && !file.type.startsWith('image/')) {
      setError('File harus berupa gambar.');
      return;
    }
    if (file && file.size > MAX_PHOTO) {
      setError('Ukuran foto maksimal 5 MB.');
      return;
    }
    setError('');
    setPhoto(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!date || !start || !end || !content.trim()) {
      setError('Lengkapi tanggal, jam mulai, jam selesai, dan isi kegiatan duty.');
      return;
    }
    if (end <= start) {
      setError('Jam selesai harus setelah jam mulai.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      await onSubmit({ date, start, end, content: content.trim(), photo });
      setStart('');
      setEnd('');
      setContent('');
      setPhoto(null);
      setPreview(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menyimpan laporan.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="flex h-full flex-col gap-3">
      <div className="grid gap-3 sm:grid-cols-3">
        <AccountField label="Nama" value={personnel.name} />
        <AccountField label="Divisi" value={personnel.division || 'Belum diatur (isi di Profile)'} />
        <AccountField label="Pangkat" value={rank} />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="block text-sm font-extrabold">
          Tanggal
          <input type="date" max={todayISO()} className="field mt-1 font-normal" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
        <label className="block text-sm font-extrabold">
          Jam Mulai
          <input type="time" className="field mt-1 font-normal" value={start} onChange={(e) => setStart(e.target.value)} />
        </label>
        <label className="block text-sm font-extrabold">
          Jam Selesai
          <input type="time" className="field mt-1 font-normal" value={end} onChange={(e) => setEnd(e.target.value)} />
        </label>
      </div>
      <label className="block text-sm font-extrabold">
        Isi Kegiatan Duty
        <textarea
          className="field mt-1 min-h-40 font-normal leading-relaxed"
          placeholder="Tuliskan kegiatan selama bertugas"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </label>
      <div>
        <p className="text-sm font-extrabold">Upload Foto (opsional)</p>
        <label className="btn mt-1 cursor-pointer">
          <ImagePlus size={18} /> {photo ? 'GANTI FOTO' : 'PILIH FOTO'}
          <input type="file" accept="image/*" className="sr-only" onChange={pickPhoto} />
        </label>
        {photo && <span className="ml-2 break-all text-sm font-semibold">{photo.name}</span>}
        {preview && <img src={preview} alt="Pratinjau foto bukti duty" width={320} height={224} className="mt-2 max-h-56 rounded-xl border border-line object-cover" />}
      </div>
      {error && <p className="break-words text-sm font-bold text-rust">{error}</p>}
      <button type="submit" disabled={busy} className="btn w-full bg-army text-cream">
        <Send size={18} /> {busy ? 'MENYIMPAN...' : 'KIRIM LAPORAN'}
      </button>
    </form>
  );
}
