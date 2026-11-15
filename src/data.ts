import { useCallback, useEffect, useState } from 'react';
import { supabase } from './supabase';
import type { AuthUser } from './auth';
import { coveredDates } from './lib';
import type { Access, AttendanceRow, CutiInput, DutyInput, Kind, LogRow, NoteInput, NoteRow, Profile, RankRole } from './types';

export interface MemberData {
  profile: Profile;
  attendance: AttendanceRow[];
  notes: NoteRow[];
  log: LogRow[];
  access: Access;
  ranks: RankRole[];
  verifyNote: string;
}

interface RawProfile { name: string; division: string; service_id: string }
interface RawAttendance { id: string; date: string; end_date: string | null; kind: Kind; start_time: string | null; end_time: string | null; content: string; photo_paths: string[] | null }
interface RawNote { id: string; title: string; content: string; created_at: string }
interface RawLog { id: string; member_name: string; action: string; detail: string; photo_paths: string[] | null; created_at: string }
interface RawAccess { verified: boolean; rank_name: string | null; rank_order: number | null; verified_at: string }
interface RawRank { rank_name: string; rank_order: number }

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

function client() {
  if (!supabase) throw new Error('Database belum dikonfigurasi.');
  return supabase;
}

function fail(e: { message: string; code?: string }): never {
  if (e.code === '23505' || e.code === '23P01') throw new Error('Tanggal ini sudah terisi absensi atau cuti.');
  if (e.code === '42501' || /row-level security/i.test(e.message)) {
    throw new Error('Akses belum terverifikasi. Pastikan role Discord sudah ada, lalu verifikasi ulang di Profile.');
  }
  throw new Error(e.message);
}

/** Minta server memeriksa role Discord. Hanya jalan jika sesi masih membawa token Discord (setelah login). */
async function verifyRoles(): Promise<string> {
  const db = client();
  const { data } = await db.auth.getSession();
  const token = data.session ? data.session.provider_token : null;
  if (!token) return '';
  const r = await db.functions.invoke('verify-discord', { body: { providerToken: token } });
  if (!r.error) return '';
  const ctx = (r.error as unknown as { context?: Response }).context;
  if (ctx) {
    try {
      const j = (await ctx.json()) as { error?: string };
      if (j.error) return j.error;
    } catch {
      /* pakai pesan bawaan */
    }
  }
  return r.error.message;
}

async function loadAll(id: string, name: string): Promise<MemberData> {
  const db = client();
  // Buat profil pada login pertama. Profil yang sudah ada tidak ditimpa.
  const created = await db.from('profiles').upsert({ id, name }, { onConflict: 'id', ignoreDuplicates: true });
  if (created.error) fail(created.error);

  const verifyNote = await verifyRoles();

  const [p, a, n, l, m, k] = await Promise.all([
    db.from('profiles').select('name, division, service_id').eq('id', id).single(),
    db.from('attendance').select('id, date, end_date, kind, start_time, end_time, content, photo_paths').eq('user_id', id).order('date', { ascending: false }),
    db.from('notes').select('id, title, content, created_at').eq('user_id', id).order('created_at', { ascending: false }),
    db.from('activity_log').select('id, member_name, action, detail, photo_paths, created_at').eq('user_id', id).order('created_at', { ascending: false }).limit(500),
    db.from('member_access').select('verified, rank_name, rank_order, verified_at').eq('user_id', id).maybeSingle(),
    db.from('rank_roles').select('rank_name, rank_order').order('rank_order', { ascending: true }),
  ]);
  for (const x of [p, a, n, l, m, k]) if (x.error) fail(x.error);

  const prof = p.data as RawProfile;
  const acc = m.data as RawAccess | null;
  const fresh = acc ? Date.now() - new Date(acc.verified_at).getTime() < WEEK_MS : false;
  return {
    profile: { name: prof.name, division: prof.division, serviceId: prof.service_id },
    attendance: (a.data as RawAttendance[]).map((x) => ({
      id: x.id, date: x.date, endDate: x.end_date, kind: x.kind, startTime: x.start_time, endTime: x.end_time, content: x.content, photoPaths: x.photo_paths ?? [],
    })),
    notes: (n.data as RawNote[]).map((x) => ({ id: x.id, title: x.title, content: x.content, createdAt: x.created_at })),
    log: (l.data as RawLog[]).map((x) => ({
      id: x.id, memberName: x.member_name, action: x.action, detail: x.detail, photoPaths: x.photo_paths ?? [], createdAt: x.created_at,
    })),
    access: {
      verified: Boolean(acc && acc.verified) && fresh,
      rankName: acc ? acc.rank_name : null,
      rankOrder: acc ? acc.rank_order : null,
    },
    ranks: (k.data as RawRank[]).map((x) => ({ rankName: x.rank_name, rankOrder: x.rank_order })),
    verifyNote,
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
      if (data && coveredDates(data.attendance).includes(i.date)) throw new Error('Tanggal ini sudah terisi absensi atau cuti.');
      const paths: string[] = [];
      for (const f of i.photos) {
        const path = `${id}/${crypto.randomUUID()}.${f.type === 'image/png' ? 'png' : 'jpg'}`;
        const up = await db.storage.from('duty-photos').upload(path, f, { contentType: f.type });
        if (up.error) fail(up.error);
        paths.push(path);
      }
      const res = await db.from('attendance').insert({ date: i.date, kind: 'duty', start_time: i.start, end_time: i.end, content: i.content, photo_paths: paths });
      if (res.error) fail(res.error);
    });

  const submitCuti = (i: CutiInput) =>
    run(async () => {
      if (data) {
        const taken = new Set(coveredDates(data.attendance));
        if (coveredDates([{ date: i.startDate, endDate: i.endDate }]).some((d) => taken.has(d))) {
          throw new Error('Rentang cuti bertabrakan dengan absensi atau cuti lain.');
        }
      }
      const res = await client().from('attendance').insert({
        date: i.startDate,
        end_date: i.endDate === i.startDate ? null : i.endDate,
        kind: 'izin',
        content: i.reason,
      });
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

  return { data, error, loading, refresh, submitDuty, submitCuti, saveNote, deleteNote, saveProfile };
}
