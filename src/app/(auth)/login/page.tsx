"use client";
import { useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link"; // 1. Import Link

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  const res = await api.auth.login(form);

  if (res.success && res.data) {
    // Backend mengirim: { success: true, token: "...", user: {...} }
    const { token, user } = res.data;

    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Pastikan data tersimpan sebelum pindah
      setTimeout(() => {
        window.location.replace('/dashboard');
      }, 100); 
    }
  } else {
    alert(res.error || "Login Gagal");
  }
};

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form 
        onSubmit={handleLogin} 
        className="p-8 bg-white shadow-md rounded-lg flex flex-col gap-4 w-full max-w-md"
      >
        <h1 className="text-2xl font-bold text-center text-blue-600">Login SmartHoops</h1>
        
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Email</label>
          <input 
            type="email" 
            placeholder="nama@email.com" 
            className="border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={(e) => setForm({...form, email: e.target.value})}
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Password</label>
          <input 
            type="password" 
            placeholder="••••••••" 
            className="border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={(e) => setForm({...form, password: e.target.value})}
            required
          />
        </div>

        <button className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 font-semibold transition-colors mt-2">
          Login
        </button>

        {/* --- MENU REGISTRASI --- */}
        <div className="text-center mt-4 text-sm text-gray-600">
          Belum punya akun?{" "}
          <Link 
            href="/register" 
            className="text-blue-600 font-bold hover:underline"
          >
            Daftar di sini
          </Link>
        </div>
      </form>
    </div>
  );
}