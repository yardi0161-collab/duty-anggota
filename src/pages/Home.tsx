import { ClipboardCheck, Clock, FileText } from 'lucide-react';
import type { Attendance, Page, Personnel, Report } from '../types';
import PersonnelCard from '../components/PersonnelCard';
import StatCard from '../components/StatCard';
import RankProgress from '../components/RankProgress';
import WeekAttendance from '../components/WeekAttendance';
import MenuCard from '../components/MenuCard';

interface Props {
  personnel: Personnel;
  rank: string;
  points: number;
  attendance: Attendance[];
  reports: Report[];
  onNavigate: (p: Page) => void;
}

export default function Home({ personnel, rank, points, attendance, reports, onNavigate }: Props) {
  const hours = reports.reduce((s, r) => s + (r.hours ?? 0), 0);
  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <PersonnelCard personnel={personnel} rank={rank} />
      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Laporan Duty" value={String(reports.length)} unit="laporan" Icon={FileText} />
        <StatCard label="Total Jam Duty" value={hours.toFixed(1)} unit="Jam" Icon={Clock} />
      </div>
      <RankProgress points={points} />
      <WeekAttendance attendance={attendance} />
      <div className="grid grid-cols-2 gap-3">
        <MenuCard title="Absensi" Icon={ClipboardCheck} primary onClick={() => onNavigate('absensi')} />
        <MenuCard title="Laporan" Icon={FileText} onClick={() => onNavigate('laporan')} />
      </div>
    </div>
  );
}
