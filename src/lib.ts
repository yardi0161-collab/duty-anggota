import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';

export const DIVISIONS = ['Infanteri', 'Kavaleri', 'Artileri', 'Zeni', 'Perhubungan', 'Kesehatan'];


export const NO_ROLE = 'Belum bergabung/mendapatkan role Discord';

const pad = (n: number) => String(n).padStart(2, '0');
export const toISO = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const todayISO = () => toISO(new Date());
export const localDate = (stamp: string) => toISO(new Date(stamp));
export const initials = (name: string): string =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => (w[0] ? w[0].toUpperCase() : ''))
    .join('') || '?';

/** Semua tanggal yang tercakup absensi atau rentang cuti. */
export function coveredDates(rows: { date: string; endDate: string | null }[]): string[] {
  const out: string[] = [];
  for (const r of rows) {
    const [y, m, d] = r.date.split('-').map(Number);
    const end = r.endDate ?? r.date;
    let cur = new Date(y, m - 1, d);
    for (let i = 0; i < 400 && toISO(cur) <= end; i++) {
      out.push(toISO(cur));
      cur = new Date(cur.getFullYear(), cur.getMonth(), cur.getDate() + 1);
    }
  }
  return out;
}

export const formatDate = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
};
export const formatStamp = (stamp: string) =>
  new Date(stamp).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

const minutes = (t: string) => {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
};
export const dutyHours = (start: string | null, end: string | null): number =>
  start && end ? Math.max(0, (minutes(end) - minutes(start)) / 60) : 0;

export type SwapPhase = 'in' | 'out' | 'pre';

/** Menahan konten lama sampai animasi keluar selesai, lalu menampilkan konten baru. */
export function useSwap<T>(target: T, outMs = 150): { shown: T; phase: SwapPhase } {
  const [shown, setShown] = useState<T>(target);
  const [phase, setPhase] = useState<SwapPhase>('in');

  useEffect(() => {
    if (target !== shown && phase !== 'out') setPhase('out');
  }, [target, shown, phase]);

  useEffect(() => {
    if (phase === 'out') {
      const id = setTimeout(() => {
        setShown(target);
        setPhase('pre');
      }, outMs);
      return () => clearTimeout(id);
    }
    if (phase === 'pre') {
      let r2 = 0;
      const r1 = requestAnimationFrame(() => {
        r2 = requestAnimationFrame(() => setPhase('in'));
      });
      return () => {
        cancelAnimationFrame(r1);
        cancelAnimationFrame(r2);
      };
    }
    return undefined;
  }, [phase, target, outMs]);

  return { shown, phase };
}

export function swapStyle(phase: SwapPhase, dir: number, outMs = 150, dist = 14): CSSProperties {
  if (phase === 'out') {
    return {
      opacity: 0,
      transform: `translateX(${-dir * dist}px)`,
      transition: `opacity ${outMs}ms ease, transform ${outMs}ms ease`,
      pointerEvents: 'none',
    };
  }
  if (phase === 'pre') {
    return { opacity: 0, transform: `translateX(${dir * dist}px)`, transition: 'none', pointerEvents: 'none' };
  }
  return { opacity: 1, transform: 'none', transition: 'opacity 250ms ease-out, transform 250ms ease-out' };
}
