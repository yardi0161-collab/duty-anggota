import { ClipboardCheck, Clock, FileText } from 'lucide-react';
import type { AttendanceRow, Page, Profile } from '../types';
import { coveredDates } from '../lib';
import PersonnelCard from '../components/PersonnelCard';
import StatCard from '../components/StatCard';
import RankProgress from '../components/RankProgress';
import WeekAttendance from '../components/WeekAttendance';
import MenuCard from '../components/MenuCard';

interface Props {
  personnel: Profile;
  rank: string;
  nextRank: string | null;
  verified: boolean;
  attendance: AttendanceRow[];
  dutyCount: number;
  hours: number;
  onNavigate: (p: Page) => void;
}

export default function Home({ personnel, rank, nextRank, verified, attendance, dutyCount, hours, onNavigate }: Props) {
  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <PersonnelCard personnel={personnel} rank={rank} verified={verified} />
      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Laporan Duty" value={String(dutyCount)} unit="laporan" Icon={FileText} />
        <StatCard label="Total Jam Duty" value={hours.toFixed(1)} unit="Jam" Icon={Clock} />
      </div>
      <RankProgress rank={rank} nextRank={nextRank} verified={verified} />
      <WeekAttendance dates={coveredDates(attendance)} />
      <div className="grid grid-cols-2 gap-3">
        <MenuCard title="Absensi" Icon={ClipboardCheck} primary onClick={() => onNavigate('absensi')} />
        <MenuCard title="Laporan" Icon={FileText} onClick={() => onNavigate('laporan')} />
      </div>
    </div>
  );
}
