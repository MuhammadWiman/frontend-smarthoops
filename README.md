

# SmartHoops - Frontend Web Application 

SmartHoops Frontend adalah antarmuka pengguna (*user interface*) modern berbasis Next.js yang dirancang untuk sistem pendukung keputusan (SPK) seleksi atlet basket menggunakan metode **Analytic Hierarchy Process (AHP)**. Aplikasi ini menyediakan dashboard interaktif bagi pelatih untuk melakukan penilaian performa dan bagi admin untuk mengelola data master kriteria serta atlet.

---

##  Fitur Utama 

* **Dashboard & Statistik**: Ringkasan data atlet, jumlah kriteria, dan status penilaian terbaru secara visual.
* **Role-Based Access Control (RBAC)**: Navigasi sidebar dinamis yang membatasi hak akses antara Admin (Manajemen Data) dan Pelatih (Penilai AHP).
* **Manajemen Data Atlet & Kriteria**: Pengelolaan lengkap profil pemain basket dan 12 kriteria penilaian skill serta fisik.
* **Matriks Perbandingan AHP**: Antarmuka penilaian berpasangan 12x12 yang user-friendly dengan perhitungan nilai kebalikan (*reciprocal*) otomatis.
* **Ranking & Hasil Seleksi**: Visualisasi hasil akhir perangkingan atlet berdasarkan bobot konsensus multi-evaluator.

---

##  Instalasi & Persiapan

### 1. Prasyarat

* Node.js (v20+)
* NPM / Yarn / Bun

### 2. Cloning Project

```bash
git clone https://github.com/MuhammadWiman/frontend-smarthoops.git
cd frontend-smarthoops

```

### 3. Instalasi Dependensi

```bash
npm install

```

### 4. Konfigurasi Environment

Buat file `.env.local` di root folder dan arahkan ke URL API Backend Anda:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api

```

### 5. Menjalankan Project

```bash
npm run dev

```

Aplikasi akan tersedia di `http://localhost:3000`.

---

##  Arsitektur Teknologi 

* **Framework**: Next.js 14 (App Router).
* **Styling**: Tailwind CSS untuk UI yang responsif dan modern.
* **Icons**: Lucide React untuk elemen visual navigasi.
* **State Management**: React Hooks (useState, useEffect) untuk pengelolaan data lokal.
* **API Integration**: Axios/Fetch untuk komunikasi asinkron dengan REST API Backend.

---

## 📂 Struktur Folder Utama

* `src/app/(dashboard)`: Berisi seluruh rute halaman fungsional (Pemain, Kriteria, Bobot, Ranking).
* `src/components`: Komponen UI modular seperti Sidebar, Navbar, dan Tabel Matriks.
* `src/lib/api.ts`: Konfigurasi *endpoint* dan *request handler* terpusat.
* `src/types`: Definisi kontrak data (interface) untuk konsistensi TypeScript.

---

