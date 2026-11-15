# Army Faction System

Personnel Attendance & Duty Management. React + TypeScript + Tailwind + Lucide + Supabase (Auth Discord, Postgres, Storage).

## Siapkan database (sekali saja)
1. Buat project di supabase.com.
2. SQL Editor > New query: tempel isi `supabase/schema.sql` > Run. Skrip ini membuat tabel, aturan keamanan per anggota (RLS), trigger log aktivitas, dan bucket foto privat `duty-photos`.
3. Authentication > Providers > Discord: isi Client ID dan Client Secret dari Discord Developer Portal.
4. Discord Developer Portal: tambahkan Redirect URL `https://<project>.supabase.co/auth/v1/callback`.
5. Supabase > Authentication > URL Configuration: isi Site URL dan Redirect URLs dengan alamat website (localhost dan domain Vercel).

## Jalankan
```bash
cp .env.example .env.local   # isi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY
npm install
npm run dev
```
Build dan cek TypeScript: `npm run build`.

## Deploy ke Vercel
Upload ke GitHub, import di Vercel (Vite terdeteksi otomatis), isi dua Environment Variables yang sama dengan `.env.example`, lalu Deploy.

## Cara kerja data
- Setiap anggota login dengan Discord. Semua data terikat ke id akunnya dan dibatasi RLS, jadi anggota lain tidak bisa melihat atau mengubahnya.
- Absensi: Form Laporan Duty (jam mulai, jam selesai, kegiatan, foto) atau Form Izin. Satu absensi per tanggal. Tanggal hijau di dashboard berarti sudah ada absensi, merah berarti belum.
- Laporan: pilih kategori, isi, kirim. Tampil di "Laporan Saya".
- Log aktivitas ditulis otomatis oleh trigger database saat absensi, laporan, atau catatan disimpan. Browser tidak bisa menulis atau memalsukan log.
- Poin dihitung dari data: Duty +10, Izin +2, ditambah poin kategori laporan.
