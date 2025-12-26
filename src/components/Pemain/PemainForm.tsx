'use client';

import { useState, useEffect } from 'react';
import { Pemain } from '@/types';
import { X, Save } from 'lucide-react';

interface PemainFormProps {
  initialData?: Pemain | null;
  onSubmit: (data: Omit<Pemain, 'id_pemain'>) => void;
  onClose: () => void;
}

export default function PemainForm({ initialData, onSubmit, onClose }: PemainFormProps) {
  // Inisialisasi dengan string kosong untuk mencegah error 'uncontrolled input'
  const [formData, setFormData] = useState({
    nama: '',
    umur: '',
    posisi: '',
    tinggi: '',
    berat: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        nama: initialData.nama ?? '',
        umur: initialData.umur?.toString() ?? '',
        posisi: initialData.posisi ?? '',
        tinggi: initialData.tinggi?.toString() ?? '',
        berat: initialData.berat?.toString() ?? '',
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Konversi kembali string ke number sebelum dikirim ke API
    onSubmit({
      nama: formData.nama,
      umur: parseInt(formData.umur) || 0,
      posisi: formData.posisi,
      tinggi: parseInt(formData.tinggi) || 0,
      berat: parseInt(formData.berat) || 0,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in duration-200">
        {/* Header Modal - Konsisten dengan Judul Halaman */}
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white">
          <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">
            {initialData ? 'Edit Data Pemain' : 'Tambah Pemain Baru'}
          </h2>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
          >
            <X size={20} />
          </button>
        </div>
        
        <form className="p-6 space-y-5" onSubmit={handleSubmit}>
          {/* Input Nama */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
              Nama Lengkap
            </label>
            <input 
              type="text" 
              required 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium text-slate-700"
              placeholder="Contoh: Andi Wijaya"
              value={formData.nama}
              onChange={(e) => setFormData({...formData, nama: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Input Umur */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
                Umur
              </label>
              <input 
                type="number" 
                required 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium text-slate-700"
                placeholder="Thn"
                value={formData.umur}
                onChange={(e) => setFormData({...formData, umur: e.target.value})}
              />
            </div>
            {/* Input Posisi */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
                Posisi
              </label>
              <select 
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium text-slate-700 appearance-none"
                value={formData.posisi}
                onChange={(e) => setFormData({...formData, posisi: e.target.value})}
              >
                <option value="">Pilih Posisi</option>
                <option value="Point Guard">Point Guard</option>
                <option value="Shooting Guard">Shooting Guard</option>
                <option value="Small Forward">Small Forward</option>
                <option value="Power Forward">Power Forward</option>
                <option value="Center">Center</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Input Tinggi - Terpisah */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
                Tinggi (cm)
              </label>
              <input 
                type="number" 
                required 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium text-slate-700"
                placeholder="cm"
                value={formData.tinggi}
                onChange={(e) => setFormData({...formData, tinggi: e.target.value})}
              />
            </div>
            {/* Input Berat - Terpisah */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
                Berat (kg)
              </label>
              <input 
                type="number" 
                required 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium text-slate-700"
                placeholder="kg"
                value={formData.berat}
                onChange={(e) => setFormData({...formData, berat: e.target.value})}
              />
            </div>
          </div>

          {/* Footer Tombol */}
          <div className="flex gap-3 mt-8">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-all"
            >
              Batal
            </button>
            <button 
              type="submit" 
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-blue-200 flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Save size={18} /> Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}