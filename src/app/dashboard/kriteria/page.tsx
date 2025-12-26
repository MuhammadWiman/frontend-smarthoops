'use client';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Kriteria } from '@/types';
import KriteriaForm from '@/components/Kriteria/KriteriaForm';
import { Award, Activity, ChevronDown, ChevronUp, Edit2, Trash2, Plus } from 'lucide-react';

export default function KriteriaPage() {
  const [kriteriaList, setKriteriaList] = useState<Kriteria[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State untuk Modal dan Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedKriteria, setSelectedKriteria] = useState<Kriteria | null>(null);

  useEffect(() => {
    fetchKriteria();
  }, []);

  const fetchKriteria = async () => {
    try {
      setLoading(true);
      const res = await api.kriteria.getAll();
      if (res.data) setKriteriaList(res.data);
    } finally {
      setLoading(false);
    }
  };

  // Fungsi saat form disubmit (Tambah atau Edit)
  const handleSubmit = async (formData: Omit<Kriteria, 'id_kriteria'>) => {
    try {
      if (selectedKriteria) {
        // Logika Update
        await api.kriteria.update(selectedKriteria.id_kriteria, formData);
        alert("Kriteria berhasil diperbarui!");
      } else {
        // Logika Create
        await api.kriteria.create(formData);
        alert("Kriteria baru ditambahkan!");
      }
      setIsModalOpen(false);
      fetchKriteria(); // Refresh data
    } catch (err) {
      alert("Gagal memproses data kriteria.");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Hapus kriteria ini? Data penilaian yang terkait mungkin akan hilang.')) {
      await api.kriteria.delete(id);
      fetchKriteria();
    }
  };

  // Sub-komponen Item Kriteria dengan tombol Edit
  function KriteriaItem({ item }: { item: Kriteria }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="border border-slate-100 rounded-xl overflow-hidden bg-white shadow-sm hover:border-blue-200">
        <div 
          onClick={() => setIsOpen(!isOpen)}
          className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50"
        >
          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-400 text-xs w-5">#{item.id_kriteria}</span>
            <h4 className="font-bold text-slate-800">{item.nama_kriteria}</h4>
          </div>
          <div className="flex items-center gap-3">
            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </div>

        {/* Accordion Content */}
        {isOpen && (
          <div className="p-4 bg-slate-50 border-t border-slate-100">
            <p className="text-sm text-slate-600 mb-4">{item.deskripsi || "Tidak ada deskripsi."}</p>
            <div className="flex justify-end gap-2">
              <button 
                onClick={(e) => {
                  e.stopPropagation(); // Agar accordion tidak menutup saat klik edit
                  setSelectedKriteria(item); // Masukkan data ke state edit
                  setIsModalOpen(true);
                }}
                className="flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100"
              >
                <Edit2 size={14} /> Edit
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(item.id_kriteria);
                }}
                className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 px-3 py-1.5 rounded-lg hover:bg-red-100"
              >
                <Trash2 size={14} /> Hapus
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Render Grup (Skill/Fisik)
  const renderGroup = (group: 'Skill' | 'Fisik', icon: any, title: string) => {
    const filtered = kriteriaList.filter(k => k.kelompok?.toLowerCase() === group.toLowerCase());
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 font-bold text-slate-800 px-2 uppercase tracking-widest text-xs opacity-60">
          {icon} {title} ({filtered.length})
        </div>
        <div className="space-y-3">
          {filtered.map(item => <KriteriaItem key={item.id_kriteria} item={item} />)}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manajemen Kriteria</h1>
          <p className="text-slate-500 text-sm">Sesuaikan kriteria penilaian AHP.</p>
        </div>
        <button 
          onClick={() => { setSelectedKriteria(null); setIsModalOpen(true); }}
          className="bg-blue-600 text-white font-bold py-2 px-6 rounded-xl flex items-center gap-2"
        >
          <Plus size={18} /> Tambah Kriteria
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {renderGroup('Skill', <Award size={18} />, "Skill")}
        {renderGroup('Fisik', <Activity size={18} />, "Fisik")}
      </div>

      {/* MODAL FORM EDIT/TAMBAH */}
      {isModalOpen && (
        <KriteriaForm 
          initialData={selectedKriteria} // Kirim data kriteria jika sedang edit
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}