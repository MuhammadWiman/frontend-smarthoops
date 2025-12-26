"use client";
import { useState } from "react";
import Sidebar from "@/components/Layout/Sidebar";
import { Menu } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Overlay Hitam saat Sidebar terbuka di Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Komponen Sidebar */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Area Konten Utama */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Header Mobile (Hanya muncul di HP/Tablet) */}
        <header className="lg:hidden bg-white border-b p-4 flex items-center justify-between sticky top-0 z-30">
          <h1 className="font-bold text-slate-800">SmartHoops</h1>
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-slate-600">
            <Menu size={24} />
          </button>
        </header>

        {/* Konten Halaman */}
        <main className="flex-1 p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}