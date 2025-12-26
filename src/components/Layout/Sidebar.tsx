'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Users, ListChecks, Scale, ClipboardList, Trophy, LogOut, X } from 'lucide-react';

// Menambahkan properti 'roles' untuk pembatasan akses menu
const menuItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['admin', 'pelatih'] },
  { name: 'Data Pemain', href: '/dashboard/pemain', icon: Users, roles: ['admin', 'pelatih'] },
  { name: 'Kriteria', href: '/dashboard/kriteria', icon: ListChecks, roles: ['admin', 'pelatih'] },
  { name: 'Bobot AHP', href: '/dashboard/bobot', icon: Scale, roles: ['pelatih'] }, // Hanya Pelatih
  { name: 'Penilaian', href: '/dashboard/penilaian', icon: ClipboardList, roles: ['pelatih'] }, // Hanya Pelatih
  { name: 'Ranking', href: '/dashboard/ranking', icon: Trophy, roles: ['admin', 'pelatih'] },
];

export default function Sidebar({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (v: boolean) => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    // Ambil role dari localStorage untuk validasi menu
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const userData = JSON.parse(userJson);
      setRole(userData.role);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <aside className={`
      fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white p-4 flex flex-col transition-transform duration-300 ease-in-out
      ${isOpen ? "translate-x-0" : "-translate-x-full"}
      lg:translate-x-0
    `}>
      <div className="flex items-center justify-between mb-10 px-2">
        <div className="flex items-center gap-3">
            <span className="text-2xl">🏀</span>
            <h1 className="font-bold text-lg leading-tight">SmartHoops</h1>
        </div>
        <button className="lg:hidden text-slate-400" onClick={() => setIsOpen(false)}>
          <X size={24} />
        </button>
      </div>

      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => {
          // Logika Filter: Hanya tampilkan menu jika role user diizinkan
          if (role && !item.roles.includes(role)) return null;

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                pathname === item.href 
                  ? 'bg-blue-600 text-white' 
                  : 'hover:bg-slate-800 text-slate-400'
              }`}
            >
              <item.icon size={20} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <button 
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg mt-auto transition-colors"
      >
        <LogOut size={20} />
        Logout
      </button>
    </aside>
  );
}