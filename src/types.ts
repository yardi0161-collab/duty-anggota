export type Page = 'home' | 'log' | 'book' | 'profile' | 'absensi' | 'laporan';
export type Kind = 'duty' | 'izin';

export interface Profile {
  name: string;
  division: string;
  serviceId: string;
}
export interface AttendanceRow {
  id: string;
  date: string;
  kind: Kind;
  startTime: string | null;
  endTime: string | null;
  content: string;
  photoPath: string | null;
}
export interface ReportRow {
  id: string;
  category: string;
  title: string;
  description: string;
  date: string;
  createdAt: string;
}
export interface NoteRow {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}
export interface LogRow {
  id: string;
  memberName: string;
  action: string;
  detail: string;
  photoPath: string | null;
  createdAt: string;
}
export interface DutyInput {
  date: string;
  start: string;
  end: string;
  content: string;
  photo: File | null;
}
export interface IzinInput {
  date: string;
  reason: string;
}
export interface ReportInput {
  category: string;
  title: string;
  description: string;
  date: string;
}
export interface NoteInput {
  id?: string;
  title: string;
  content: string;
}
