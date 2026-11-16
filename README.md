# Army Faction System

Personnel Attendance & Duty Management. React + TypeScript + Tailwind + Lucide + Supabase (Auth Discord, Postgres, Storage, Edge Functions).

## 1. Database (sekali, aman diulang)
1. Buat project di supabase.com.
2. SQL Editor > New query: tempel isi `supabase/schema.sql` > Run.
3. Authentication > Providers > Discord: aktifkan, isi Client ID dan Client Secret dari Discord Developer Portal. Tambahkan Callback URL Supabase ke Redirects di Discord Developer Portal.
4. Authentication > URL Configuration: isi Site URL dan Redirect URLs dengan alamat website.

## 2. Verifikasi role Discord (wajib untuk absensi)
Pangkat dan akses dibaca dari role Discord anggota di server. Pengecekan dilakukan di server (Edge Function), lalu aturan database menolak absensi dari anggota yang belum terverifikasi.

1. Aktifkan Developer Mode di Discord (Pengaturan > Lanjutan). Salin **Server ID** (tekan lama nama server) dan **Role ID** tiap pangkat (Pengaturan Server > Role > tekan lama role > Salin ID).
2. Supabase > Edge Functions > Deploy a new function > Via Editor. Nama: `verify-discord`. Tempel isi `supabase/functions/verify-discord/index.ts`, lalu Deploy.
3. Supabase > Edge Functions > Secrets: tambahkan `DISCORD_GUILD_ID` = Server ID.
4. Isi peta pangkat di SQL Editor (ganti ID dan nama sesuai server). `rank_order` lebih besar = pangkat lebih tinggi:
```sql
insert into public.rank_roles (role_id, rank_name, rank_order) values
  ('ID_ROLE_1', 'Prajurit Dua', 1),
  ('ID_ROLE_2', 'Prajurit Satu', 2),
  ('ID_ROLE_3', 'Prajurit Kepala', 3);
```
5. Login ulang dengan Discord. Izin `guilds.members.read` diminta saat login, dan hasil verifikasi berlaku 7 hari. Setelah itu tekan "Verifikasi ulang" di Profile.

Anggota tanpa role yang ada di `rank_roles` tampil "Belum bergabung/mendapatkan role Discord" dan tidak bisa menyimpan absensi.

## 3. Jalankan
```bash
cp .env.example .env.local   # isi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY (dan VITE_DISCORD_DM untuk tombol bantuan login)
npm install
npm run dev
```
Cek TypeScript dan build: `npm run build`. Deploy: upload ke GitHub, import di Vercel, isi dua Environment Variables yang sama.

## Tombol "Kendala Login?"
Isi `VITE_DISCORD_DM` dengan Discord User ID admin (Discord Developer Mode aktif, tekan lama profil, Salin ID Pengguna). Tombol membuka `https://discord.com/users/<ID>`, yaitu profil admin, dan pengguna menekan Message. Kalau variabel kosong, tombol tidak ditampilkan.

## Cara kerja data
- Semua data terikat ke id akun dan dibatasi RLS. Anggota lain tidak bisa melihat atau mengubahnya.
- Absensi: Presensi Duty (jam duty, jam off duty, catatan, sampai 2 foto) atau Pengajuan Cuti (rentang tanggal, maksimal 60 hari). Satu tanggal hanya bisa terisi satu kali, rentang cuti tidak boleh bertabrakan.
- Tanggal minggu ini: hijau jika ada absensi atau cuti, merah jika belum.
- Log aktivitas ditulis trigger database, tidak bisa dipalsukan dari browser.
