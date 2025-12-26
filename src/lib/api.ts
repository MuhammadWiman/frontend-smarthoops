import { 
  ApiResponse, LoginRequest, AuthResponse, 
  Pemain, Perbandingan, Penilaian, 
  Ranking, Kriteria, SimpanPenilaianRequest
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const api = {
  request: async <T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    console.log(`[HTTP ${options.method || 'GET'}] ${endpoint} | Token: ${token ? 'ADA' : 'TIDAK ADA'}`);

    const headers = new Headers({
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    });

    if (token) headers.append('Authorization', `Bearer ${token}`);

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
      
      if (response.status === 401) {
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.replace('/login');
        }
        return { success: false, error: 'Sesi berakhir' };
      }

      const result = await response.json();
      return { success: true, data: result };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  // 1. Auth Endpoints: Login & Register
  auth: {
    login: (data: LoginRequest) => api.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    register: (data: any) => api.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  },

  // 2. Pemain Endpoints: Kelola Atlet
  pemain: {
    getAll: () => api.request<Pemain[]>('/pemain'),
    getById: (id: number) => api.request<Pemain>(`/pemain/${id}`),
    create: (data: Omit<Pemain, 'id_pemain'>) => api.request<Pemain>('/pemain', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (id: number, data: Partial<Pemain>) => api.request<Pemain>(`/pemain/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    delete: (id: number) => api.request<void>(`/pemain/${id}`, {
      method: 'DELETE',
    }),
  },
  
  // 3. Kriteria Endpoints: Kelola 12 Kriteria
  kriteria: {
    getAll: () => api.request<Kriteria[]>('/kriteria'),
    create: (data: any) => api.request('/kriteria', { 
      method: 'POST', 
      body: JSON.stringify(data) 
    }),
    update: (id: number | string, data: any) => api.request(`/kriteria/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
    delete: (id: number) => api.request(`/kriteria/${id}`, { 
      method: 'DELETE' 
    }),
  },

  // 4. AHP & Bobot: Mendukung Konsensus Multi-Evaluator
ahp: {
    /**
     * LANGKAH 1: Simpan 144 baris perbandingan mentah milik pelatih 
     * ke tabel 'perbandingan_kriteria'
     */
    savePerbandingan: (comparisons: Perbandingan[]) => api.request<any>('/perbandingan', { 
      method: 'POST', 
      body: JSON.stringify({ comparisons }) 
    }),

    /**
     * LANGKAH 2: Memicu backend untuk menghitung bobot final (Eigenvector) 
     * berdasarkan rata-rata Geometric Mean dari semua pelatih
     */
    hitungBobot: () => api.request<any>('/ahp/hitung-bobot', { 
      method: 'POST' 
    }),

    /**
     * Mengambil hasil bobot kriteria yang sudah dihitung
     */
    getBobot: () => api.request<any>('/ahp/bobot'), 
  },

  // 5. Penilaian Endpoints: Input Skor Performa
  penilaian: {
    simpan: (data: SimpanPenilaianRequest) => api.request<void>('/penilaian', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    getAggregated: () => api.request<any[]>('/penilaian'),
    getByPelatih: (idPemain: number, idUser: number) => 
      api.request<any>(`/penilaian/${idPemain}/${idUser}`),
  },

  // 6. Ranking Endpoints: Hasil Seleksi Akhir
  ranking: {
    getHasil: () => api.request<Ranking[]>('/ahp/ranking'),
  }
};