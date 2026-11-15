import { useEffect, useMemo, useState } from 'react';
import type { ChangeEvent } from 'react';
import { ImagePlus, X } from 'lucide-react';

const MAX_BYTES = 5 * 1024 * 1024;
const TYPES = ['image/jpeg', 'image/png'];

interface Props {
  files: File[];
  onChange: (f: File[]) => void;
  max?: number;
  disabled?: boolean;
}

// Satu kotak untuk semua foto. Hapus foto lama, lalu tambah yang baru untuk mengganti.
export default function PhotoPicker({ files, onChange, max = 2, disabled = false }: Props) {
  const [error, setError] = useState('');
  const urls = useMemo(() => files.map((f) => URL.createObjectURL(f)), [files]);
  useEffect(
    () => () => {
      urls.forEach((u) => URL.revokeObjectURL(u));
    },
    [urls],
  );

  const add = (e: ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files ?? []);
    e.target.value = '';
    const valid: File[] = [];
    let msg = '';
    for (const f of picked) {
      if (!TYPES.includes(f.type)) msg = 'Format foto harus JPG, JPEG, atau PNG.';
      else if (f.size > MAX_BYTES) msg = 'Ukuran tiap foto maksimal 5 MB.';
      else valid.push(f);
    }
    const room = max - files.length;
    if (valid.length > room) msg = `Maksimal ${max} foto.`;
    setError(msg);
    if (valid.length > 0) onChange([...files, ...valid.slice(0, Math.max(0, room))]);
  };

  return (
    <div className="rounded-xl border border-dashed border-line p-3">
      <p className="text-sm text-muted">
        {files.length}/{max} foto. JPG atau PNG, maksimal 5 MB per foto.
      </p>
      {files.length > 0 && (
        <ul className="mt-3 grid grid-cols-2 gap-2">
          {files.map((f, i) => (
            <li key={`${f.name}-${i}`} className="relative">
              <img src={urls[i]} alt={`Foto bukti ${i + 1}`} width={160} height={112} className="h-28 w-full rounded-lg border border-line object-cover" />
              <button
                type="button"
                onClick={() => onChange(files.filter((_, j) => j !== i))}
                disabled={disabled}
                aria-label={`Hapus foto ${i + 1}`}
                className="btn absolute right-1 top-1 h-11 w-11 rounded-full bg-night px-0"
              >
                <X size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}
      {files.length < max && (
        <label className="btn mt-3 w-full cursor-pointer">
          <ImagePlus size={18} /> TAMBAH FOTO
          <input type="file" accept="image/jpeg,image/png" multiple disabled={disabled} className="sr-only" onChange={add} />
        </label>
      )}
      {error && <p className="mt-2 break-words text-sm font-bold text-rust">{error}</p>}
    </div>
  );
}
