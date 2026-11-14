import { useEffect, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { Attendance, Note, Personnel, Report, Status } from './types';

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

export const STATUS_POINTS: Record<Status, number> = { HADIR: 10, IZIN: 2, SAKIT: 2, ALPA: -5 };
export const REPORT_POINTS = 15;

export const STATUS_STYLE: Record<Status, string> = {
  HADIR: 'bg-olive text-white',
  IZIN: 'bg-gold text-ink',
  SAKIT: 'bg-bark text-white',
  ALPA: 'bg-rust text-white',
};

export function rankInfo(points: number) {
  const index = RANKS.reduce((acc, r, i) => (points >= r.points ? i : acc), 0);
  const current = RANKS[index];
  const next = RANKS[index + 1] ?? null;
  const percent = next
    ? Math.min(100, Math.round(((points - current.points) / (next.points - current.points)) * 100))
    : 100;
  return { current, next, percent };
}

const pad = (n: number) => String(n).padStart(2, '0');
export const toISO = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const todayISO = () => toISO(new Date());
export const timeOf = (d: Date) => `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
export const timeNow = () => timeOf(new Date());
export const formatDate = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
};
export const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

export function useLocalStorage<T>(key: string, initial: () => T): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) return JSON.parse(raw) as T;
    } catch {
      /* abaikan data rusak */
    }
    return initial();
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* penyimpanan penuh atau diblokir */
    }
  }, [key, value]);
  return [value, setValue];
}

const daysAgo = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return toISO(d);
};

export const seedPersonnel = (): Personnel => ({
  name: 'Serda Budi Santoso',
  division: 'Infanteri',
  serviceId: 'AD-2026-0147',
});

export const seedAttendance = (): Attendance[] => {
  const list: [number, Status, string][] = [
    [1, 'HADIR', '07:02:11'],
    [2, 'HADIR', '06:55:40'],
    [3, 'IZIN', '07:30:05'],
    [4, 'HADIR', '07:10:22'],
    [5, 'SAKIT', '06:48:19'],
    [6, 'HADIR', '07:01:03'],
  ];
  return list.map(([n, status, time]) => ({
    id: uid(),
    date: daysAgo(n),
    time,
    status,
    points: STATUS_POINTS[status],
  }));
};

export const seedReports = (): Report[] => [
  { id: uid(), title: 'Patroli perbatasan sektor utara', description: 'Patroli rutin 3 jam, situasi aman terkendali.', division: 'Infanteri', date: daysAgo(1), points: REPORT_POINTS },
  { id: uid(), title: 'Latihan baris-berbaris', description: 'Latihan dasar bersama regu, evaluasi kekompakan barisan.', division: 'Infanteri', date: daysAgo(2), points: REPORT_POINTS },
  { id: uid(), title: 'Pengecekan logistik pos jaga', description: 'Perbekalan dan peralatan pos jaga lengkap.', division: 'Zeni', date: daysAgo(4), points: REPORT_POINTS },
];

export const seedNotes = (): Note[] => [
  { id: uid(), title: 'Jadwal apel pekan ini', content: 'Apel pagi pukul 06.30 di lapangan utama. Seragam PDH.', date: daysAgo(1) },
  { id: uid(), title: 'Catatan briefing komandan', content: 'Fokus minggu ini: disiplin waktu dan kelengkapan laporan duty.', date: daysAgo(3) },
];
