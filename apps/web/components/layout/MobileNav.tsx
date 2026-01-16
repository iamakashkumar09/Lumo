'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, Search, PlusSquare, MessageCircle, User } from 'lucide-react';
import { useState } from 'react';
import CreatePostModal from '@/components/shared/CreatePostModal';

export default function MobileNav() {
  const pathname = usePathname();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  if (pathname.includes('/login') || pathname.includes('/signup')) return null;

  return (
    <>
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#FAFAFA]/90 dark:bg-[#050505]/90 backdrop-blur-xl border-t border-neutral-200/50 dark:border-neutral-800/50">
          <div className="flex items-center justify-around px-4 py-3 pb-5"> 
              <Link href="/" className={`p-2 rounded-2xl transition-all ${pathname === '/' ? 'text-black dark:text-white' : 'text-neutral-400'}`}>
                  <Home size={26} strokeWidth={pathname === '/' ? 2.5 : 2} />
              </Link>
              
              <Link href="/search" className={`p-2 rounded-2xl transition-all ${pathname === '/search' ? 'text-black dark:text-white' : 'text-neutral-400'}`}>
                  <Search size={26} strokeWidth={pathname === '/search' ? 2.5 : 2} />
              </Link>
              
              <button 
                onClick={() => setIsCreateOpen(true)} 
                className="p-3 -mt-1 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 rounded-2xl text-white shadow-lg shadow-purple-500/20 active:scale-90 transition-transform"
              >
                  <PlusSquare size={24} strokeWidth={2.5} />
              </button>

              <Link href="/messages" className={`p-2 rounded-2xl transition-all ${pathname === '/messages' ? 'text-black dark:text-white' : 'text-neutral-400'}`}>
                  <MessageCircle size={26} strokeWidth={pathname === '/messages' ? 2.5 : 2} />
              </Link>
              
              <Link href="/profile" className={`p-2 rounded-2xl transition-all ${pathname === '/profile' ? 'text-black dark:text-white' : 'text-neutral-400'}`}>
                  <User size={26} strokeWidth={pathname === '/profile' ? 2.5 : 2} />
              </Link>
          </div>
      </div>
      <CreatePostModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </>
  );
}