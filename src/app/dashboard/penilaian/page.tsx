"use client";

import { useEffect, useState, useMemo } from "react";
import { api } from "@/lib/api";
import { Pemain, Kriteria, SimpanPenilaianRequest } from "@/types";

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
  const [userId, setUserId] = useState<number | null>(null);

  const TOTAL_KRITERIA = 12; // Standar 12 kriteria

  useEffect(() => {
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

  // VALIDASI: Memastikan semua input (12 per pemain) sudah terisi 1-100
  const isFormValid = useMemo(() => {
    if (pemain.length === 0 || kriteria.length === 0) return false;

    return pemain.every((p) => {
      const playerSkor = skor[p.id_pemain];
      if (!playerSkor) return false;

      const filledValues = Object.values(playerSkor);
      // Cek apakah jumlah kriteria tepat 12 dan semua nilai > 0
      return (
        filledValues.length === TOTAL_KRITERIA && 
        filledValues.every((val) => val > 0 && val <= 100)
      );
    });
  }, [skor, pemain, kriteria]);

  const handleInputChange = (pemainId: number, kriteriaId: number, value: string) => {
    const numValue = value === "" ? 0 : Math.min(100, Math.max(0, parseInt(value)));
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
      const savePromises = Object.entries(skor).map(([pId, kriteriaValues]) => {
        const payload: SimpanPenilaianRequest = {
          id_user: userId,
          id_pemain: parseInt(pId),
          nilai: Object.entries(kriteriaValues).map(([kId, val]) => ({
            id_kriteria: parseInt(kId),
            nilai: val as number
          }))
        };
        return api.penilaian.simpan(payload);
      });

      await Promise.all(savePromises);
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
          {!isFormValid && (
            <p className="text-amber-600 text-xs font-medium mt-1">
              * Lengkapi seluruh kriteria (1-100) untuk semua pemain agar tombol simpan aktif
            </p>
          )}
        </div>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !isFormValid}
          className={`px-6 py-2 rounded-lg text-white font-semibold transition-all ${
            isSubmitting || !isFormValid 
              ? "bg-gray-300 cursor-not-allowed" 
              : "bg-green-600 hover:bg-green-700 shadow-md"
          }`}
        >
          {isSubmitting ? "Menyimpan..." : "Simpan Semua Penilaian"}
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="p-4 text-left font-semibold text-gray-700 sticky left-0 bg-gray-50 z-10">
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
                <td className="p-4 font-medium text-gray-800 sticky left-0 bg-white z-10 border-r shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                  {p.nama}
                </td>
                {kriteria.map((k) => (
                  <td key={k.id_kriteria} className="p-4 text-center">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={skor[p.id_pemain]?.[k.id_kriteria] || ""}
                      onChange={(e) => handleInputChange(p.id_pemain, k.id_kriteria, e.target.value)}
                      className={`w-20 border rounded-md p-2 text-center focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                        (skor[p.id_pemain]?.[k.id_kriteria] || 0) > 0 
                          ? "border-green-200 bg-green-50" 
                          : "border-gray-300"
                      }`}
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