import { useCallback, useEffect, useState } from 'react';
import { supabase } from './supabase';
import type { AuthUser } from './auth';
import type { AttendanceRow, DutyInput, IzinInput, Kind, LogRow, NoteInput, NoteRow, Profile, ReportInput, ReportRow } from './types';

export interface MemberData {
  profile: Profile;
  attendance: AttendanceRow[];
  reports: ReportRow[];
  notes: NoteRow[];
  log: LogRow[];
}

interface RawProfile { name: string; division: string; service_id: string }
interface RawAttendance { id: string; date: string; kind: Kind; start_time: string | null; end_time: string | null; content: string; photo_path: string | null }
interface RawReport { id: string; category: string; title: string; description: string; date: string; created_at: string }
interface RawNote { id: string; title: string; content: string; created_at: string }
interface RawLog { id: string; member_name: string; action: string; detail: string; photo_path: string | null; created_at: string }

function client() {
  if (!supabase) throw new Error('Database belum dikonfigurasi.');
  return supabase;
}

function fail(e: { message: string; code?: string }): never {
  throw new Error(e.code === '23505' ? 'Absensi untuk tanggal ini sudah terisi.' : e.message);
}

async function loadAll(id: string, name: string): Promise<MemberData> {
  const db = client();
  // Buat profil pada login pertama. Profil yang sudah ada tidak ditimpa.
  const created = await db.from('profiles').upsert({ id, name }, { onConflict: 'id', ignoreDuplicates: true });
  if (created.error) fail(created.error);

  const [p, a, r, n, l] = await Promise.all([
    db.from('profiles').select('name, division, service_id').eq('id', id).single(),
    db.from('attendance').select('id, date, kind, start_time, end_time, content, photo_path').eq('user_id', id).order('date', { ascending: false }),
    db.from('reports').select('id, category, title, description, date, created_at').eq('user_id', id).order('created_at', { ascending: false }),
    db.from('notes').select('id, title, content, created_at').eq('user_id', id).order('created_at', { ascending: false }),
    db.from('activity_log').select('id, member_name, action, detail, photo_path, created_at').eq('user_id', id).order('created_at', { ascending: false }).limit(500),
  ]);
  for (const x of [p, a, r, n, l]) if (x.error) fail(x.error);

  const prof = p.data as RawProfile;
  return {
    profile: { name: prof.name, division: prof.division, serviceId: prof.service_id },
    attendance: (a.data as RawAttendance[]).map((x) => ({ id: x.id, date: x.date, kind: x.kind, startTime: x.start_time, endTime: x.end_time, content: x.content, photoPath: x.photo_path })),
    reports: (r.data as RawReport[]).map((x) => ({ id: x.id, category: x.category, title: x.title, description: x.description, date: x.date, createdAt: x.created_at })),
    notes: (n.data as RawNote[]).map((x) => ({ id: x.id, title: x.title, content: x.content, createdAt: x.created_at })),
    log: (l.data as RawLog[]).map((x) => ({ id: x.id, memberName: x.member_name, action: x.action, detail: x.detail, photoPath: x.photo_path, createdAt: x.created_at })),
  };
}

export async function photoUrl(path: string): Promise<string> {
  const r = await client().storage.from('duty-photos').createSignedUrl(path, 300);
  if (r.error) fail(r.error);
  return r.data.signedUrl;
}

export function useMemberData(user: AuthUser) {
  const [data, setData] = useState<MemberData | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const { id, name } = user;

  const refresh = useCallback(async () => {
    try {
      setData(await loadAll(id, name));
      setError('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal memuat data.');
    } finally {
      setLoading(false);
    }
  }, [id, name]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const run = async (fn: () => Promise<void>) => {
    await fn();
    await refresh();
  };

  const submitDuty = (i: DutyInput) =>
    run(async () => {
      const db = client();
      if (data && data.attendance.some((a) => a.date === i.date)) throw new Error('Absensi untuk tanggal ini sudah terisi.');
      let path: string | null = null;
      if (i.photo) {
        const ext = (i.photo.name.split('.').pop() ?? 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
        path = `${id}/${crypto.randomUUID()}.${ext}`;
        const up = await db.storage.from('duty-photos').upload(path, i.photo, { contentType: i.photo.type });
        if (up.error) fail(up.error);
      }
      const res = await db.from('attendance').insert({ date: i.date, kind: 'duty', start_time: i.start, end_time: i.end, content: i.content, photo_path: path });
      if (res.error) fail(res.error);
    });

  const submitIzin = (i: IzinInput) =>
    run(async () => {
      const res = await client().from('attendance').insert({ date: i.date, kind: 'izin', content: i.reason });
      if (res.error) fail(res.error);
    });

  const submitReport = (i: ReportInput) =>
    run(async () => {
      const res = await client().from('reports').insert({ category: i.category, title: i.title, description: i.description, date: i.date });
      if (res.error) fail(res.error);
    });

  const saveNote = (n: NoteInput) =>
    run(async () => {
      const db = client();
      const res = n.id
        ? await db.from('notes').update({ title: n.title, content: n.content }).eq('id', n.id).eq('user_id', id)
        : await db.from('notes').insert({ title: n.title, content: n.content });
      if (res.error) fail(res.error);
    });

  const deleteNote = (noteId: string) =>
    run(async () => {
      const res = await client().from('notes').delete().eq('id', noteId).eq('user_id', id);
      if (res.error) fail(res.error);
    });

  const saveProfile = (p: Profile) =>
    run(async () => {
      const res = await client().from('profiles').update({ name: p.name, division: p.division, service_id: p.serviceId }).eq('id', id);
      if (res.error) fail(res.error);
    });

  return { data, error, loading, refresh, submitDuty, submitIzin, submitReport, saveNote, deleteNote, saveProfile };
}
