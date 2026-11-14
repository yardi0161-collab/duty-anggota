import { useEffect, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { ImagePlus, Send } from 'lucide-react';
import type { Personnel } from '../types';
import { todayISO } from '../lib';
import AccountField from './AccountField';

interface Props {
  personnel: Personnel;
  rank: string;
  onSubmitted: () => void;
}

export default function DutyForm({ personnel, rank, onSubmitted }: Props) {
  const [date, setDate] = useState(todayISO());
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [content, setContent] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const pickPhoto = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
    setPhoto(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!date || !start || !end || !content.trim()) {
      setError('Lengkapi tanggal, jam mulai, jam selesai, dan isi kegiatan duty.');
      return;
    }
    if (end <= start) {
      setError('Jam selesai harus setelah jam mulai.');
      return;
    }
    setError('');
    setStart('');
    setEnd('');
    setContent('');
    setPhoto(null);
    setPreview(null);
    onSubmitted();
  };

  return (
    <form onSubmit={submit} className="card space-y-3 p-4">
      <h2 className="text-2xl">Form Laporan Duty</h2>
      <div className="grid gap-3 sm:grid-cols-3">
        <AccountField label="Nama" value={personnel.name} />
        <AccountField label="Devisi" value={personnel.division} />
        <AccountField label="Pangkat" value={rank} />
      </div>
      <p className="text-xs font-semibold text-bark">Nama, devisi, dan pangkat terisi otomatis dari akun.</p>
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="block text-sm font-extrabold">
          Tanggal
          <input type="date" className="field mt-1 font-normal" value={date} onChange={(e) => setDate(e.target.value)} />
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
          className="field mt-1 min-h-40 font-normal"
          placeholder="Tuliskan kegiatan selama bertugas"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </label>
      <div>
        <p className="text-sm font-extrabold">Upload Foto</p>
        <label className="btn mt-1 cursor-pointer bg-sand">
          <ImagePlus size={18} /> {photo ? 'GANTI FOTO' : 'PILIH FOTO'}
          <input type="file" accept="image/*" className="sr-only" onChange={pickPhoto} />
        </label>
        {photo && <span className="ml-2 text-sm font-semibold">{photo.name}</span>}
        {preview && <img src={preview} alt="Pratinjau foto bukti duty" className="mt-2 max-h-56 rounded-xl border-[3px] border-ink object-cover" />}
      </div>
      {error && <p className="text-sm font-bold text-rust">{error}</p>}
      <button type="submit" className="btn w-full bg-army text-cream">
        <Send size={18} /> KIRIM LAPORAN
      </button>
    </form>
  );
}
