'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { User } from '@/types';
import { 
  Users, 
  ClipboardCheck, 
  Trophy, 
  UserCheck, 
  ArrowRight,
  Activity,
  LayoutDashboard,
  Loader2
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState({
    pemain: 0,
    kriteria: 0,
    sudahDinilai: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ambil session user
    const userJson = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!token || !userJson) {
      window.location.replace('/login');
      return;
    }

    setUser(JSON.parse(userJson));

    // Sinkronisasi data dashboard
    const loadData = async () => {
      try {
        setLoading(true);
        const [resPemain, resKriteria, resPenilaian] = await Promise.all([
          api.pemain.getAll(),
          api.kriteria.getAll(),
          api.penilaian.getAggregated() // Data gabungan multi-evaluator
        ]);

        setStats({
          pemain: resPemain.data?.length || 0,
          kriteria: resKriteria.data?.length || 12,
          sudahDinilai: resPenilaian.data?.length || 0
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return (
    <div className="flex h-96 items-center justify-center">
      <Loader2 className="animate-spin text-blue-600" size={32} />
    </div>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-slate-500 mt-1">
            Selamat datang, <span className="text-blue-600 font-bold">{user?.nama_lengkap}</span>. 
            Anda masuk sebagai <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase border border-blue-100 ml-1">{user?.role}</span>
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-slate-100 shadow-sm text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          <Activity size={14} className="text-green-500" />
          Sistem Online
        </div>
      </div>

      {/* STATS ROW */}
      <div className="grid grid-cols-4 gap-6">
        <StatCard icon={<Users size={20} />} label="TOTAL ATLET" value={stats.pemain} color="blue" />
        <StatCard icon={<ClipboardCheck size={20} />} label="KRITERIA" value={stats.kriteria} color="slate" />
        <StatCard icon={<UserCheck size={20} />} label="PENILAIAN" value={stats.sudahDinilai} color="orange" />
        <StatCard icon={<Trophy size={20} />} label="RANKING" value="READY" color="green" />
      </div>

      <div className="grid grid-cols-3 gap-8">
        {/* PROGRESS SECTION */}
        <div className="col-span-2 bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-10">
            <div className="p-2 bg-slate-900 rounded-lg text-white">
              <LayoutDashboard size={18} />
            </div>
            <h2 className="text-lg font-bold text-slate-800 uppercase tracking-tight">Status Progres Seleksi</h2>
          </div>

          <div className="space-y-6 mb-10">
            <StepItem num="01" title="DATA ATLET" status="SELESAI" isDone={stats.pemain > 0} />
            <StepItem num="02" title="KONSENSUS AHP" status="AKTIF" isDone={true} />
            <StepItem num="03" title="PENILAIAN" status="PROSES" isDone={stats.sudahDinilai > 0} />
          </div>

          <Link href="/dashboard/ranking" className="flex items-center justify-between p-6 bg-blue-600 rounded-2xl text-white hover:bg-blue-700 transition-all">
            <div>
              <p className="text-[10px] font-bold uppercase opacity-70 tracking-widest">HASIL AKHIR</p>
              <h3 className="text-xl font-bold uppercase">Lihat Ranking Final</h3>
            </div>
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: any) {
  const colors: any = {
    blue: "text-blue-600 bg-blue-50",
    slate: "text-slate-600 bg-slate-50",
    orange: "text-orange-600 bg-orange-50",
    green: "text-green-600 bg-green-50"
  };

  return (
    <div className="p-6 rounded-3xl border border-slate-100 bg-white shadow-sm flex flex-col gap-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 tracking-widest mb-1 uppercase">{label}</p>
        <h3 className="text-3xl font-bold text-slate-900 tracking-tighter">{value}</h3>
      </div>
    </div>
  );
}

function StepItem({ num, title, status, isDone }: any) {
  return (
    <div className="flex items-center gap-4">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${isDone ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-slate-300'}`}>
        {num}
      </div>
      <div className="flex-1 flex items-center gap-3">
        <h4 className="font-bold text-slate-800 text-xs tracking-tight uppercase">{title}</h4>
        <span className={`text-[8px] px-2 py-0.5 rounded font-bold uppercase ${isDone ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-slate-400'}`}>
          {status}
        </span>
      </div>
    </div>
  );
}