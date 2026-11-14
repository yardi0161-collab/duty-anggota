import { useState } from 'react';
import type { FormEvent } from 'react';
import { Pencil, Save, Trash2, X } from 'lucide-react';
import type { Note, NoteInput, Report } from '../types';
import { formatDate } from '../lib';

interface Props {
  notes: Note[];
  reports: Report[];
  onSave: (n: NoteInput) => void;
  onDelete: (id: string) => void;
}

export default function Book({ notes, reports, onSave, onDelete }: Props) {
  const [editId, setEditId] = useState<string | undefined>(undefined);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  const reset = () => {
    setEditId(undefined);
    setTitle('');
    setContent('');
    setError('');
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Isi judul dan isi catatan terlebih dahulu.');
      return;
    }
    onSave({ id: editId, title: title.trim(), content: content.trim() });
    reset();
  };

  const edit = (n: Note) => {
    setEditId(n.id);
    setTitle(n.title);
    setContent(n.content);
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const remove = (n: Note) => {
    if (window.confirm(`Hapus catatan "${n.title}"?`)) {
      onDelete(n.id);
      if (editId === n.id) reset();
    }
  };

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <section className="card h-fit p-4">
        <h2 className="text-2xl">{editId ? 'Edit Catatan' : 'Catatan Baru'}</h2>
        <form onSubmit={submit} className="mt-2 space-y-2">
          <input className="field" placeholder="Judul catatan" value={title} onChange={(e) => setTitle(e.target.value)} aria-label="Judul catatan" />
          <textarea className="field min-h-36" placeholder="Isi catatan kegiatan atau personel" value={content} onChange={(e) => setContent(e.target.value)} aria-label="Isi catatan" />
          {error && <p className="text-sm font-bold text-rust">{error}</p>}
          <div className="flex gap-2">
            <button type="submit" className="btn flex-1 bg-army text-cream">
              <Save size={18} /> {editId ? 'SIMPAN PERUBAHAN' : 'SIMPAN CATATAN'}
            </button>
            {editId && (
              <button type="button" onClick={reset} className="btn bg-sand">
                <X size={18} /> BATAL
              </button>
            )}
          </div>
        </form>
        <h3 className="mt-5 text-lg">Laporan Tersimpan</h3>
        <ul className="mt-1 divide-y-2 divide-sand text-sm">
          {reports.map((r) => (
            <li key={r.id} className="py-1.5">
              <p className="font-extrabold">{r.title}</p>
              <p className="text-bark">{formatDate(r.date)} · {r.division}</p>
              <p>{r.description}</p>
            </li>
          ))}
          {reports.length === 0 && <li className="py-2 text-bark">Belum ada laporan. Kirim laporan dari halaman Home.</li>}
        </ul>
      </section>
      <section className="space-y-3">
        <h2 className="text-2xl">Buku Catatan</h2>
        {notes.map((n) => (
          <article key={n.id} className="card p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="text-lg leading-tight">{n.title}</h3>
                <p className="text-xs font-bold text-bark">{formatDate(n.date)}</p>
              </div>
              <div className="flex shrink-0 gap-1">
                <button className="btn bg-gold px-2 py-1" onClick={() => edit(n)} aria-label={`Edit ${n.title}`}>
                  <Pencil size={16} />
                </button>
                <button className="btn bg-rust px-2 py-1 text-white" onClick={() => remove(n)} aria-label={`Hapus ${n.title}`}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <p className="mt-2 whitespace-pre-wrap text-sm">{n.content}</p>
          </article>
        ))}
        {notes.length === 0 && <p className="card p-4 text-bark">Belum ada catatan. Tulis catatan pertama di formulir.</p>}
      </section>
    </div>
  );
}
