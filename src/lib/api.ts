import { 
  ApiResponse, LoginRequest, AuthResponse, 
  Pemain, Perbandingan, Penilaian, 
  Ranking, Kriteria, SimpanPenilaianRequest
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const api = {
  request: async <T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> => {
    // 1. Ambil token dan pastikan nilainya valid (bukan string "null" atau "undefined")
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const isValidToken = token && token !== "null" && token !== "undefined";

    console.log(`[HTTP ${options.method || 'GET'}] ${endpoint} | Token: ${isValidToken ? 'Tersedia' : 'KOSONG'}`);

    const headers = new Headers({
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    });

    // 2. Lampirkan token hanya jika valid
    if (isValidToken) {
      headers.append('Authorization', `Bearer ${token}`);
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
      
      // 3. Tangani Sesi Berakhir (401)
      if (response.status === 401) {
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.replace('/login');
        }
        return { success: false, error: 'Sesi berakhir', data: [] as any };
      }

      const result = await response.json();

      // 4. Perbaikan Utama: Cek jika respons fetch tidak OK (e.g., 400, 500)
      if (!response.ok) {
        return { 
          success: false, 
          error: result.message || 'Terjadi kesalahan pada server', 
          data: (Array.isArray(result) ? result : []) as any // Pastikan tetap array jika error
        };
      }

      return { success: true, data: result };
    } catch (error: any) {
      console.error(`[API Error] ${endpoint}:`, error.message);
      return { success: false, error: error.message, data: [] as any };
    }
  },

  // 1. Auth Endpoints: Login & Register dengan RBAC
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

  // 2. Pemain Endpoints: Kelola Atlet & Status Penilaian Konsensus
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
  
  // 3. Kriteria Endpoints: Kelola 12 Kriteria Utama
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

  // 4. AHP & Bobot: Perhitungan Geometric Mean & Konsensus
  ahp: {
    savePerbandingan: (comparisons: Perbandingan[]) => api.request<any>('/perbandingan', { 
      method: 'POST', 
      body: JSON.stringify({ comparisons }) 
    }),
    hitungBobot: () => api.request<any>('/ahp/hitung-bobot', { 
      method: 'POST' 
    }),
    getBobot: () => api.request<any>('/ahp/bobot'), 
  },

  // 5. Penilaian Endpoints: Input & Monitoring
  penilaian: {
    simpan: (data: SimpanPenilaianRequest) => api.request<void>('/penilaian', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    getAggregated: () => api.request<any[]>('/penilaian'),
    
    // Pastikan mengembalikan array untuk menghindari .filter() error
    getStatus: () => api.request<any[]>('/penilaian/status'), 
    
    getByPelatih: (idPemain: number, idUser: number) => 
      api.request<any>(`/penilaian/${idPemain}/${idUser}`),
  },

  // 6. Admin Stats: Monitoring Objektivitas Pelatih
  admin: {
    getRekapPelatih: () => api.request<any[]>('/admin/rekap-penilaian'),
  },

  // 7. Ranking Endpoints: Hasil Akhir Perangkingan
  ranking: {
    getHasil: () => api.request<Ranking[]>('/ahp/ranking'),
  }
};