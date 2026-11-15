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
  endDate: string | null;
  kind: Kind;
  startTime: string | null;
  endTime: string | null;
  content: string;
  photoPaths: string[];
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
  photoPaths: string[];
  createdAt: string;
}
export interface Access {
  verified: boolean;
  rankName: string | null;
  rankOrder: number | null;
}
export interface RankRole {
  rankName: string;
  rankOrder: number;
}
export interface DutyInput {
  date: string;
  start: string;
  end: string;
  content: string;
  photos: File[];
}
export interface CutiInput {
  startDate: string;
  endDate: string;
  reason: string;
}
export interface NoteInput {
  id?: string;
  title: string;
  content: string;
}
