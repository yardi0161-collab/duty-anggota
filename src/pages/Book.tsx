import { useState } from 'react';
import type { FormEvent } from 'react';
import { Pencil, Save, Trash2, X } from 'lucide-react';
import type { NoteInput, NoteRow } from '../types';
import { formatStamp } from '../lib';

interface Props {
  notes: NoteRow[];
  onSave: (n: NoteInput) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function Book({ notes, onSave, onDelete }: Props) {
  const [editId, setEditId] = useState<string | undefined>(undefined);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const reset = () => {
    setEditId(undefined);
    setTitle('');
    setContent('');
    setError('');
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Isi judul dan isi catatan terlebih dahulu.');
      return;
    }
    setBusy(true);
    try {
      await onSave({ id: editId, title: title.trim(), content: content.trim() });
      reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menyimpan catatan.');
    } finally {
      setBusy(false);
    }
  };

  const edit = (n: NoteRow) => {
    setEditId(n.id);
    setTitle(n.title);
    setContent(n.content);
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const remove = async (n: NoteRow) => {
    if (!window.confirm(`Hapus catatan "${n.title}"?`)) return;
    try {
      await onDelete(n.id);
      if (editId === n.id) reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menghapus catatan.');
    }
  };

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <section className="card h-fit p-4">
        <h2 className="text-2xl">{editId ? 'Edit Catatan' : 'Catatan Baru'}</h2>
        <form onSubmit={submit} className="mt-2 space-y-2">
          <label className="block text-sm font-extrabold">
            Judul catatan
            <input className="field mt-1 font-normal" value={title} onChange={(e) => setTitle(e.target.value)} />
          </label>
          <label className="block text-sm font-extrabold">
            Isi catatan
            <textarea className="field mt-1 min-h-36 font-normal leading-relaxed" value={content} onChange={(e) => setContent(e.target.value)} />
          </label>
          {error && <p className="break-words text-sm font-bold text-rust">{error}</p>}
          <div className="flex gap-2">
            <button type="submit" disabled={busy} className="btn flex-1 bg-army text-cream">
              <Save size={18} /> {editId ? 'SIMPAN PERUBAHAN' : 'SIMPAN CATATAN'}
            </button>
            {editId && (
              <button type="button" onClick={reset} className="btn">
                <X size={18} /> BATAL
              </button>
            )}
          </div>
        </form>
      </section>
      <section className="space-y-3">
        <h2 className="text-2xl">Buku Catatan</h2>
        {notes.length === 0 && <p className="card p-4 text-muted">Belum di isi</p>}
        {notes.map((n) => (
          <article key={n.id} className="card p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="break-words text-lg leading-snug">{n.title}</h3>
                <p className="text-xs font-semibold text-muted">{formatStamp(n.createdAt)}</p>
              </div>
              <div className="flex shrink-0 gap-1">
                <button className="btn px-2 py-1" onClick={() => edit(n)} aria-label={`Edit ${n.title}`}>
                  <Pencil size={16} />
                </button>
                <button className="btn bg-rust px-2 py-1 text-white" onClick={() => remove(n)} aria-label={`Hapus ${n.title}`}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed">{n.content}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
