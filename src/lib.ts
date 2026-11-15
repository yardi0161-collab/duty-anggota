import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import type { Kind } from './types';

export const DIVISIONS = ['Infanteri', 'Kavaleri', 'Artileri', 'Zeni', 'Perhubungan', 'Kesehatan'];

export const RANKS = [
  { name: 'Prajurit Dua', points: 0 },
  { name: 'Prajurit Satu', points: 60 },
  { name: 'Prajurit Kepala', points: 140 },
  { name: 'Kopral Dua', points: 240 },
  { name: 'Kopral Satu', points: 360 },
  { name: 'Sersan Dua', points: 500 },
  { name: 'Sersan Satu', points: 680 },
  { name: 'Sersan Mayor', points: 900 },
];

export const ATTENDANCE_POINTS: Record<Kind, number> = { duty: 10, izin: 2 };

export const REPORT_CATEGORIES = [
  { name: 'Penangkapan', points: 3 },
  { name: 'Kasus Besar', points: 10 },
  { name: 'Patroli', points: 5 },
  { name: 'Backup', points: 3 },
  { name: 'Penilangan', points: 2 },
  { name: 'Administrasi', points: 6 },
];
export const categoryPoints = (name: string): number => REPORT_CATEGORIES.find((c) => c.name === name)?.points ?? 0;

export function rankInfo(points: number) {
  const index = RANKS.reduce((acc, r, i) => (points >= r.points ? i : acc), 0);
  const current = RANKS[index];
  const next = RANKS[index + 1] ?? null;
  return { current, next };
}

const pad = (n: number) => String(n).padStart(2, '0');
export const toISO = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const todayISO = () => toISO(new Date());
export const localDate = (stamp: string) => toISO(new Date(stamp));
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
