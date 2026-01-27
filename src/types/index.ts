// 1. Auth Types - Menggunakan id_user sesuai database [cite: 13-18]
export interface User {
  id_user: number; // Disamakan dengan backend [cite: 16]
  nama_lengkap: string;
  email: string;
  role: 'admin' | 'pelatih'; // Role-Based Access Control [cite: 6]
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// 2. Pemain Types - Menggunakan properti 'tinggi' & 'berat' [cite: 27-40]
export interface Pemain {
  id_pemain: number;
  nama: string;
  umur: number;
  posisi: string;
  tinggi: number; // Bukan tinggi_badan [cite: 39]
  berat: number;  // Bukan berat_badan [cite: 40]
  created_at?: string;
}

// 3. Kriteria Types [cite: 41-62]
export interface Kriteria {
  id_kriteria: number;
  nama_kriteria: string;
  kelompok: 'skill' | 'fisik'; // Kriteria dibagi 2 kelompok [cite: 44]
  tipe: 'benefit' | 'cost'; // Tipe kriteria AHP [cite: 47]
  deskripsi?: string;
}

// 4. Perbandingan AHP Types - Mendukung Multi-Evaluator [cite: 63-67]
export interface Perbandingan {
  id_user: number; // Menandakan siapa pelatih yang menilai [cite: 63]
  kriteria_1: number;
  kriteria_2: number;
  nilai: number; // Skala kepentingan AHP (1-9) [cite: 65]
}

// Digunakan untuk pengiriman bulk/banyak perbandingan sekaligus
export interface BatchPerbandinganRequest {
  id_user: number;
  comparisons: Omit<Perbandingan, 'id_user'>[];
}

/** * 5. BobotKriteria - Hasil perhitungan konsensus AHP [cite: 71-73]
 */
export interface BobotKriteria {
  id_kriteria: number;
  nama_kriteria: string;
  bobot: number; // Hasil normalisasi matriks [cite: 73]
  persentase?: string;
}

/** * 6. Penilaian - Input nilai performa pemain oleh pelatih [cite: 68-70]
 */
export interface Penilaian {
  id_user: number; // Pelatih yang memberikan nilai [cite: 68]
  id_pemain: number;
  id_kriteria: number;
  nilai: number; // Skor 0-100 [cite: 70]
}

// Digunakan untuk pengiriman data penilaian dari form
export interface SimpanPenilaianRequest {
  id_user: number;
  id_pemain: number;
  nilai: { id_kriteria: number; nilai: number }[];
}

// 7. Ranking Types - Hasil seleksi akhir [cite: 74-80]
export interface Ranking {
  ranking: number;
  id_pemain: number;
  nama_pemain: string;
  posisi: string;
  nilai_akhir: number; // Hasil perkalian bobot & skor rata-rata [cite: 79]
}

// 8. API Response Standard
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}