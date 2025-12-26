"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Kriteria, Perbandingan } from "@/types"; 

export default function BobotPage() {
  const [kriteria, setKriteria] = useState<Kriteria[]>([]);
  const [matrix, setMatrix] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    // 1. Ambil identitas penilai dari session storage
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const userData = JSON.parse(userJson);
      setUserId(userData.id_user);
    }
    loadKriteria();
  }, []);

  const loadKriteria = async () => {
    try {
      const res = await api.kriteria.getAll();
      if (res.data) {
        const data = res.data;
        setKriteria(data);
        
        // 2. Inisialisasi Matriks Otomatis (Standar Basket Real)
        const initialMatrix: { [key: string]: number } = {};
        
        data.forEach((k1) => {
          data.forEach((k2) => {
            const id1 = k1.id_kriteria;
            const id2 = k2.id_kriteria;
            const n1 = k1.nama_kriteria.toLowerCase();
            const n2 = k2.nama_kriteria.toLowerCase();
            let val = 1; // Standar: Sama Penting

            if (id1 !== id2) {
              // Logika: Game Intelligence (IQ) & Shooting adalah prioritas utama
              if (n1.includes("iq") || n1.includes("intelligence")) val = 5;
              else if (n1.includes("shooting") && id2 > 7) val = 3;
              // Skill Dasar (1-6) lebih utama dari Atribut Fisik (7-12)
              else if (id1 <= 6 && id2 > 6) val = 3;
            }

            initialMatrix[`${id1}-${id2}`] = val;
            initialMatrix[`${id2}-${id1}`] = parseFloat((1 / val).toFixed(3));
          });
        });

        // Pastikan diagonal matriks selalu 1
        data.forEach(k => initialMatrix[`${k.id_kriteria}-${k.id_kriteria}`] = 1);
        setMatrix(initialMatrix);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleComparisonChange = (id1: number, id2: number, value: number) => {
    setMatrix((prev) => ({
      ...prev,
      [`${id1}-${id2}`]: value,
      [`${id2}-${id1}`]: parseFloat((1 / value).toFixed(3)), // Reciprocal otomatis
    }));
  };

const handleSave = async () => {
    // 1. Validasi Sesi Pelatih
    if (!userId) {
      alert("Sesi berakhir, silakan login kembali.");
      return;
    }

    setIsSaving(true);
    try {
      // 2. Transformasi Matrix (Object) menjadi Array untuk Bulk Insert
      // Kita ambil semua pasangan (144 baris untuk 12 kriteria)
      const comparisonArray: Perbandingan[] = Object.entries(matrix).map(([key, value]) => {
        const [id1, id2] = key.split("-");
        return { 
          id_user: userId, 
          kriteria_1: parseInt(id1), 
          kriteria_2: parseInt(id2), 
          nilai: value 
        };
      });

      // 3. Kirim ke Backend dalam format { comparisons: [...] }
      // Ini memanggil POST /api/perbandingan
      const resSave = await api.ahp.savePerbandingan(comparisonArray); 
      
      if (resSave.success) {
        // 4. Setelah data mentah tersimpan, picu perhitungan AHP Global
        // Ini memanggil POST /api/ahp/hitung-bobot
        const resHitung = await api.ahp.hitungBobot(); 
        
        if (resHitung.success) {
          alert("Data perbandingan berhasil disimpan dan bobot konsensus telah diperbarui!");
        } else {
          alert("Data tersimpan, namun gagal menghitung bobot otomatis.");
        }
      } else {
        alert("Gagal menyimpan data perbandingan ke database.");
      }
    } catch (err) {
      console.error("Error saving:", err);
      alert("Terjadi kesalahan pada koneksi server.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-500 font-medium">Menyiapkan Matriks Standar...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Perbandingan Kriteria (AHP)</h1>
      <p className="text-gray-500 mb-6 text-sm">Nilai perbandingan telah otomatis diatur sesuai standar basket profesional. Silakan tinjau kembali.</p>

      <div className="bg-white p-6 rounded-xl shadow-sm border overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-3 border bg-gray-50 text-xs uppercase text-gray-400 sticky left-0 z-10">Kriteria</th>
              {kriteria.map((k) => (
                <th key={k.id_kriteria} className="p-3 border bg-gray-50 text-xs uppercase text-gray-600 min-w-37.5">{k.nama_kriteria}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {kriteria.map((k1) => (
              <tr key={k1.id_kriteria}>
                <td className="p-3 border font-bold bg-gray-50 text-sm text-gray-700 sticky left-0 z-10">{k1.nama_kriteria}</td>
                {kriteria.map((k2) => {
                  const isDiagonal = k1.id_kriteria === k2.id_kriteria;
                  const isUpperTriangle = k1.id_kriteria < k2.id_kriteria;
                  const val = matrix[`${k1.id_kriteria}-${k2.id_kriteria}`];

                  return (
                    <td key={k2.id_kriteria} className="p-3 border text-center">
                      {isDiagonal ? (
                        <span className="font-bold text-gray-300">1</span>
                      ) : isUpperTriangle ? (
                        <select 
                          className="border rounded p-1 text-sm bg-blue-50 text-blue-700 border-blue-100 outline-none focus:ring-2 focus:ring-blue-500 w-full"
                          value={val}
                          onChange={(e) => handleComparisonChange(k1.id_kriteria, k2.id_kriteria, parseFloat(e.target.value))}
                        >
                          <option value="1">1 - Sama Penting</option>
                          <option value="3">3 - Sedikit Lebih Penting</option>
                          <option value="5">5 - Lebih Penting</option>
                          <option value="7">7 - Sangat Penting</option>
                          <option value="9">9 - Mutlak Penting</option>
                        </select>
                      ) : (
                        <span className="text-gray-400 font-medium text-xs">{val}</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-8 flex justify-end">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className={`px-8 py-2 rounded-lg text-white font-semibold transition-all shadow-md ${
              isSaving ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700 active:scale-95"
            }`}
          >
            {isSaving ? "Memproses..." : "Terapkan & Simpan Standar"}
          </button>
        </div>
      </div>
    </div>
  );
}