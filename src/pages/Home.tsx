import { useState } from 'react';
import type { Attendance, Personnel, Report, ReportInput } from '../types';
import { todayISO } from '../lib';
import PersonnelCard from '../components/PersonnelCard';
import AttendanceCard from '../components/AttendanceCard';
import ReportCard from '../components/ReportCard';
import RankProgress from '../components/RankProgress';
import Calendar from '../components/Calendar';

interface Props {
  personnel: Personnel;
  rank: string;
  points: number;
  attendance: Attendance[];
  reports: Report[];
  onOpenAbsensi: () => void;
  onReport: (r: ReportInput) => void;
}

export default function Home({ personnel, rank, points, attendance, reports, onOpenAbsensi, onReport }: Props) {
  const [selected, setSelected] = useState(todayISO());
  return (
    <div className="space-y-4">
      <PersonnelCard personnel={personnel} rank={rank} />
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-4">
          <AttendanceCard onOpen={onOpenAbsensi} />
          <ReportCard reports={reports} defaultDivision={personnel.division} onSubmit={onReport} />
        </div>
        <div className="space-y-4">
          <RankProgress points={points} />
          <Calendar attendance={attendance} reports={reports} selected={selected} onSelect={setSelected} />
        </div>
      </div>
    </div>
  );
}
