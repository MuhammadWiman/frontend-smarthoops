'use client';
import { useState, useEffect } from 'react';
import { Kriteria } from '@/types';

interface KriteriaFormProps {
  initialData?: Kriteria | null;
  onSubmit: (data: Omit<Kriteria, 'id_kriteria'>) => void;
  onClose: () => void;
}

export default function KriteriaForm({ initialData, onSubmit, onClose }: KriteriaFormProps) {
  const [formData, setFormData] = useState<Omit<Kriteria, 'id_kriteria'>>({
    nama_kriteria: '',
    kelompok: 'skill',
    tipe: 'benefit',
    deskripsi: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        nama_kriteria: initialData.nama_kriteria,
        kelompok: initialData.kelompok,
        tipe: initialData.tipe,
        deskripsi: initialData.deskripsi || '',
      });
    }
  }, [initialData]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
        <h2 className="text-xl font-bold mb-4 text-slate-800">
          {initialData ? 'Edit Kriteria' : 'Tambah Kriteria'}
        </h2>
        
        <form className="space-y-4" onSubmit={(e) => {
          e.preventDefault();
          onSubmit(formData);
        }}>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nama Kriteria</label>
            <input 
              type="text" required className="input-field" 
              value={formData.nama_kriteria}
              onChange={(e) => setFormData({...formData, nama_kriteria: e.target.value})}
              placeholder="Contoh: Shooting, Speed, dll."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Kelompok</label>
              <select 
                className="input-field"
                value={formData.kelompok}
                onChange={(e) => setFormData({...formData, kelompok: e.target.value as 'skill' | 'fisik'})}
              >
                <option value="skill">Skill</option>
                <option value="fisik">Fisik</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tipe</label>
              <select 
                className="input-field"
                value={formData.tipe}
                onChange={(e) => setFormData({...formData, tipe: e.target.value as 'benefit' | 'cost'})}
              >
                <option value="benefit">Benefit</option>
                <option value="cost">Cost</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Deskripsi</label>
            <textarea 
              className="input-field h-24 resize-none"
              value={formData.deskripsi}
              onChange={(e) => setFormData({...formData, deskripsi: e.target.value})}
              placeholder="Penjelasan singkat mengenai kriteria ini..."
            />
          </div>

          <div className="flex gap-3 mt-6">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 text-slate-600">Batal</button>
            <button type="submit" className="btn-primary flex-1">Simpan</button>
          </div>
        </form>
      </div>
    </div>
  );
}