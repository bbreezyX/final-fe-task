# Task Management

<div align="center">

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white)

</div>

## Overview 👋

Task Management Frontend adalah antarmuka pengguna modern untuk sistem manajemen tugas. Aplikasi ini dibangun menggunakan RVite eact dan Bootstrap, dirancang untuk berinteraksi dengan [Task Management Backend](https://github.com/bbreezyX/be).

### Fitur Utama 🚀

- **UI Bootstrap**: Antarmuka yang responsif dan modern menggunakan komponen Bootstrap
- **Autentikasi Pengguna**: Sistem login dan registrasi yang terintegrasi
- **Manajemen Tugas**: Tambah, edit, hapus, dan lihat tugas
- **Responsive Design**: Tampilan yang responsif untuk berbagai ukuran layar
- **Real-time Updates**: Pembaruan data secara real-time
- **Form Validation**: Validasi form menggunakan fitur Bootstrap
- **Vite as Build Tool**: Development server yang cepat dan optimasi build

## Prasyarat

Untuk menjalankan aplikasi ini, Anda memerlukan:

- Node.js (versi 14 atau lebih baru)
- npm atau yarn
- Task Management Backend yang sudah berjalan

## Instalasi

1. Clone repositori:
```bash
git clone https://github.com/bbreezyX/final-fe-task.git
cd final-fe-task
```

2. Install dependensi:
```bash
npm install
# atau
yarn install
```

3. Buat file `.env` di root direktori:
```
REACT_APP_API_URL=http://localhost:3000  # sesuaikan dengan URL backend Anda
```

## Menjalankan Aplikasi

### Mode Development
```bash
npm start
# atau
yarn start
```

### Mode Production
```bash
npm run build
# atau
yarn build
```

Aplikasi akan berjalan di `http://localhost:3000`

## Struktur Proyek
```
src/
├── assets/          # Gambar, icon, dan asset statis
├── components/      # Komponen React yang dapat digunakan kembali
├── pages/           # Komponen halaman utama
├── routes/          # Konfigurasi Routing
├── services/        # Layanan API dan utilitas
├── styles/          # File CSS dan Bootstrap overrides
└── App.jsx          # Root component
```

## Styling dengan Bootstrap

Aplikasi ini menggunakan Bootstrap untuk styling. Beberapa komponen utama yang digunakan:

- Navigation: Navbar Bootstrap untuk header
- Forms: Form controls Bootstrap untuk input
- Cards: Untuk menampilkan task
- Modals: Untuk dialog konfirmasi dan form
- Toast: Untuk notifikasi sistem
- Grid System: Untuk layout responsif

## Konfigurasi

Pastikan backend API sudah berjalan sebelum menjalankan frontend. Update file `.env` dengan URL backend yang sesuai.

### Vite
Proyek ini menggunakan Vite sebagai build tool. Konfigurasi dapat ditemukan di `vite.config.js`.

### ESLint & Prettier
Proyek ini menggunakan ESLint dan Prettier untuk code formatting. Konfigurasi dapat ditemukan di:
- `.eslintrc.js`
- `.prettierrc`


## Fitur yang Akan Datang 🚀

- [ ] Drag and drop task management
- [ ] Kolaborasi tim
- [ ] Notifikasi real-time
- [ ] Export data ke PDF/Excel
- [ ] Mobile app version
