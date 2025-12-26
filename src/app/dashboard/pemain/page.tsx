'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Pemain } from '@/types';
import PemainForm from '@/components/Pemain/PemainForm';
import { Plus, Edit2, Trash2, Loader2 } from 'lucide-react';

export default function PemainPage() {
  const [pemainList, setPemainList] = useState<Pemain[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPemain, setSelectedPemain] = useState<Pemain | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPemain = async () => {
    try {
      setLoading(true);
      const res = await api.pemain.getAll();
      if (res.success && res.data) {
        setPemainList(res.data);
      }
    } catch (err) {
      console.error("Gagal memuat data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPemain();
  }, []);

  const handleSubmit = async (data: Omit<Pemain, 'id_pemain'>) => {
    try {
      if (selectedPemain) {
        await api.pemain.update(selectedPemain.id_pemain, data);
      } else {
        await api.pemain.create(data);
      }
      setIsModalOpen(false);
      fetchPemain();
    } catch (err) {
      alert("Gagal menyimpan data.");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Hapus data pemain ini?')) {
      await api.pemain.delete(id);
      fetchPemain();
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-10">
      {/* JUDUL HALAMAN: Hanya Teks (Konsisten dengan Manajemen Kriteria) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Data Pemain
          </h1>
          <p className="text-slate-500 font-medium mt-2">
            Kelola atlet yang akan mengikuti seleksi.
          </p>
        </div>
        <button 
          onClick={() => { setSelectedPemain(null); setIsModalOpen(true); }}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-8 rounded-2xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 w-fit active:scale-95"
        >
          <Plus size={20} /> Tambah Pemain
        </button>
      </div>

      {/* TABEL DATA */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Nama Pemain</th>
                <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] text-center">Posisi</th>
                <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] text-center">Umur</th>
                <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] text-center">TB/BB</th>
                <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-24 text-center">
                    <Loader2 className="animate-spin mx-auto mb-4 text-blue-600" size={32} />
                    <span className="text-slate-300 font-bold uppercase tracking-widest text-xs">Menyinkronkan Data...</span>
                  </td>
                </tr>
              ) : pemainList.map((p) => (
                <tr key={p.id_pemain} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5 font-black text-slate-900 text-lg">{p.nama}</td>
                  <td className="px-8 py-5 text-center">
                    <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border border-blue-100">
                      {p.posisi}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-center text-slate-500 font-bold">{p.umur} Thn</td>
                  
                  {/* LOGIKA PENGGABUNGAN TB & BB */}
                  <td className="px-8 py-5 text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-slate-900 font-black text-base leading-none">
                        {/* Panggil tinggi_badan dan berat_badan secara terpisah sesuai database */}
                        {p.tinggi || '-'} / {p.berat || '-'}
                      </span>
                      <span className="text-[9px] text-slate-400 font-black uppercase mt-1 tracking-widest">CM / KG</span>
                    </div>
                  </td>

                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-3">
                      <button 
                        onClick={() => { setSelectedPemain(p); setIsModalOpen(true); }}
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(p.id_pemain)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <PemainForm 
          initialData={selectedPemain}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}