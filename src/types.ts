export type Status = 'HADIR' | 'IZIN' | 'SAKIT' | 'ALPA';
export type Page = 'home' | 'log' | 'book' | 'profile' | 'absensi' | 'laporan' | 'bar';

export interface Personnel {
  name: string;
  division: string;
  serviceId: string;
}
export interface Attendance {
  id: string;
  date: string;
  time: string;
  status: Status;
  points: number;
}
export interface Report {
  id: string;
  title: string;
  description: string;
  division: string;
  date: string;
  points: number;
  hours?: number;
}
export interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
}
export interface ReportInput {
  title: string;
  description: string;
  division: string;
  date: string;
}
export interface NoteInput {
  id?: string;
  title: string;
  content: string;
}
