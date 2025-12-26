"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Pemain, Kriteria, SimpanPenilaianRequest } from "@/types"; // Tambahkan SimpanPenilaianRequest

interface SkorState {
  [pemainId: number]: { 
    [kriteriaId: number]: number;
  };
}

export default function PenilaianPage() {
  const [pemain, setPemain] = useState<Pemain[]>([]);
  const [kriteria, setKriteria] = useState<Kriteria[]>([]);
  const [skor, setSkor] = useState<SkorState>({});
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userId, setUserId] = useState<number | null>(null); // State untuk menyimpan ID User

  useEffect(() => {
    // Ambil id_user dari localStorage saat komponen dimuat
    const userJson = localStorage.getItem('user');
    if (userJson) {
      setUserId(JSON.parse(userJson).id_user);
    }
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [resPemain, resKriteria] = await Promise.all([
        api.pemain.getAll(),
        api.kriteria.getAll(),
      ]);

      if (resPemain.data && resKriteria.data) {
        setPemain(resPemain.data);
        setKriteria(resKriteria.data);
        
        const initialSkor: SkorState = {};
        resPemain.data.forEach((p) => {
          initialSkor[p.id_pemain] = {}; 
          resKriteria.data?.forEach((k) => {
            initialSkor[p.id_pemain][k.id_kriteria] = 0;
          });
        });
        setSkor(initialSkor);
      }
    } catch (err) {
      console.error("Gagal mengambil data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (pemainId: number, kriteriaId: number, value: string) => {
    const numValue = value === "" ? 0 : parseInt(value);
    setSkor((prev) => ({
      ...prev,
      [pemainId]: {
        ...prev[pemainId],
        [kriteriaId]: numValue,
      },
    }));
  };

  const handleSubmit = async () => {
    if (!userId) {
      alert("Sesi berakhir, silakan login kembali.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Perbaikan: Loop melalui setiap pemain di state 'skor' 
      // dan kirimkan sesuai struktur SimpanPenilaianRequest
      const savePromises = Object.entries(skor).map(([pId, kriteriaValues]) => {
        const payload: SimpanPenilaianRequest = {
          id_user: userId,
          id_pemain: parseInt(pId),
          nilai: Object.entries(kriteriaValues).map(([kId, val]) => ({
            id_kriteria: parseInt(kId),
            nilai: val as number
          }))
        };
        return api.penilaian.simpan(payload); // Kirim data per pemain
      });

      await Promise.all(savePromises); // Tunggu semua permintaan selesai
      alert("Semua penilaian berhasil disimpan!");
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan penilaian.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="p-10 text-center">Memuat data...</div>;

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Penilaian Pemain</h1>
          <p className="text-gray-500 text-sm">Masukkan skor performa untuk setiap kriteria (1-100)</p>
        </div>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`px-6 py-2 rounded-lg text-white font-semibold transition-all ${
            isSubmitting ? "bg-gray-400" : "bg-green-600 hover:bg-green-700 shadow-md"
          }`}
        >
          {isSubmitting ? "Menyimpan..." : "Simpan Semua Penilaian"}
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="p-4 text-left font-semibold text-gray-700 sticky left-0 bg-gray-50">
                Nama Pemain
              </th>
              {kriteria.map((k) => (
                <th key={k.id_kriteria} className="p-4 text-center font-semibold text-gray-700 min-w-32">
                  {k.nama_kriteria} 
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pemain.map((p) => (
              <tr key={p.id_pemain} className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                <td className="p-4 font-medium text-gray-800 sticky left-0 bg-white">
                  {p.nama}
                </td>
                {kriteria.map((k) => (
                  <td key={k.id_kriteria} className="p-4 text-center">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={skor[p.id_pemain]?.[k.id_kriteria] ?? ""}
                      onChange={(e) => handleInputChange(p.id_pemain, k.id_kriteria, e.target.value)}
                      className="w-20 border border-gray-300 rounded-md p-2 text-center focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}