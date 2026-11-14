# Army Faction System

Personnel Attendance & Duty Management (React + TypeScript + Tailwind + Lucide).

## Jalankan di VS Code
```bash
npm install
npm run dev
```

## Build & cek TypeScript
```bash
npm run build
```

## Deploy ke Vercel
1. Upload folder ini ke GitHub.
2. Di Vercel: Add New Project, pilih repo. Framework otomatis terdeteksi sebagai Vite.
3. Klik Deploy (build command `npm run build`, output `dist`).

Data tersimpan di localStorage browser. Menu Profile punya tombol reset ke data contoh.

## Login Discord (foto profil OAuth2)
Login memakai Supabase Auth dengan provider Discord. Tanpa konfigurasi, website tetap jalan dan header memakai logo TNI AD.

1. Buat project di supabase.com, lalu Authentication > Providers > Discord (isi Client ID dan Client Secret dari Discord Developer Portal).
2. Di Discord Developer Portal, tambahkan Redirect URL dari Supabase (`https://<project>.supabase.co/auth/v1/callback`).
3. Di Supabase: Authentication > URL Configuration, isi Site URL dan Redirect URLs dengan alamat website (localhost dan domain Vercel).
4. Salin `.env.example` menjadi `.env.local`, isi nilainya. Di Vercel isi Environment Variables dengan nama yang sama.
5. Buka menu Profile (ketuk foto di header), lalu tekan LOGIN DENGAN DISCORD.
