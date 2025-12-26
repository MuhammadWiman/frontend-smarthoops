import { redirect } from 'next/navigation';

export default function RootPage() {
  // Mengarahkan pengguna dari '/' ke '/login'
  redirect('/login');
  
  // Fungsi ini tidak akan merender apapun karena navigasi langsung berpindah
  return null;
}