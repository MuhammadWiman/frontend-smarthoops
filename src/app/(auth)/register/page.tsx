"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [form, setForm] = useState({
    nama_lengkap: "",
    email: "",
    role: "pelatih", // Default role sebagai pelatih
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Password dan Konfirmasi Password tidak cocok!");
      return;
    }

    setLoading(true);
    try {
      // payload sekarang otomatis menyertakan 'role'
      const { confirmPassword, ...payload } = form;
      
      const res = await api.auth.register(payload);

      if (res && res.data) {
        alert("Registrasi berhasil! Silahkan login.");
        router.push("/login");
      } else {
        setError("Gagal melakukan registrasi, coba lagi nanti.");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Terjadi kesalahan saat registrasi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <form 
        onSubmit={handleRegister} 
        className="w-full max-w-md p-8 bg-white shadow-lg rounded-xl flex flex-col gap-4"
      >
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-blue-600">SmartHoops</h1>
          <p className="text-gray-500">Buat akun baru untuk mulai penilaian</p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Nama Lengkap</label>
          <input 
            required
            type="text" 
            className="border p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Masukkan username"
            onChange={(e) => setForm({...form, nama_lengkap: e.target.value})}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Email</label>
          <input 
            required
            type="email" 
            className="border p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="nama@email.com"
            onChange={(e) => setForm({...form, email: e.target.value})}
          />
        </div>

        {/* --- INPUT PILIHAN ROLE (IDENTIK DENGAN UI LAIN) --- */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Daftar Sebagai</label>
          <select 
            required
            className="border p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            value={form.role}
            onChange={(e) => setForm({...form, role: e.target.value})}
          >
            <option value="pelatih">Pelatih (Penilai)</option>
            <option value="admin">Administrator</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Password</label>
          <input 
            required
            type="password" 
            className="border p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="••••••••"
            onChange={(e) => setForm({...form, password: e.target.value})}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Konfirmasi Password</label>
          <input 
            required
            type="password" 
            className="border p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="••••••••"
            onChange={(e) => setForm({...form, confirmPassword: e.target.value})}
          />
        </div>

        <button 
          disabled={loading}
          className={`mt-2 p-2 rounded-md text-white font-semibold transition-all ${
            loading ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Mendaftarkan..." : "Daftar Sekarang"}
        </button>

        <p className="text-center text-sm text-gray-600 mt-2">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-blue-600 font-bold hover:underline">
            Login di sini
          </Link>
        </p>
      </form>
    </div>
  );
}