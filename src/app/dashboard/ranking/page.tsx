"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Ranking } from "@/types"; 

export default function RankingPage() {
  const [results, setResults] = useState<Ranking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRanking();
  }, []);

  const fetchRanking = async () => {
    try {
      setLoading(true);
      const res = await api.ranking.getHasil();

      const dataObj = res.data as any;
      const targetData = dataObj?.data_ranking;

      if (Array.isArray(targetData)) {
        const sortedData = [...targetData].sort(
          (a, b) =>
            (Number(b.nilai_akhir) || 0) -
            (Number(a.nilai_akhir) || 0)
        );
        setResults(sortedData);
      } else {
        setResults([]);
      }
    } catch (err) {
      console.error("Gagal memuat ranking:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return <div className="p-10 text-center">Menghitung peringkat...</div>;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Hasil Perangkingan Pemain
        </h1>
        <p className="text-gray-500 text-sm">
          Hasil perhitungan akhir menggunakan metode AHP.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-md border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-4 text-center w-20">Rank</th>
              <th className="p-4">Nama Pemain</th>
              <th className="p-4 text-center">Posisi</th>
              <th className="p-4 text-center">Nilai Akhir</th>
            </tr>
          </thead>
          <tbody>
            {results.length > 0 ? (
              results.map((r, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-4 text-center font-bold">
                    {r.ranking || index + 1}
                  </td>
                  <td className="p-4 font-medium text-gray-800">
                    {r.nama_pemain}
                  </td>
                  <td className="p-4 text-center text-gray-700">
                    {r.posisi || "-"}
                  </td>
                  <td className="p-4 text-center font-mono font-bold text-blue-600">
                    {r.nilai_akhir.toFixed(2)}%
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="p-10 text-center text-gray-400"
                >
                  Belum ada data peringkat.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
