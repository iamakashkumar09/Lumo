'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Home, Search, MessageCircle, Heart, PlusSquare, User, Share2, LogOut, Settings } from 'lucide-react';
import { useState } from 'react';
import CreatePostModal from '@/components/shared/CreatePostModal';
import { api } from '@/lib/api';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  if (pathname.includes('/login') || pathname.includes('/signup')) return null;
  
  const NavIcon = ({ icon: Icon, label, href, onClick }: any) => {
    const isActive = pathname === href;
    const Component = href ? Link : 'button';
    
    return (
      <Component href={href || undefined} onClick={onClick} className="block w-full text-left">
        <div className={`relative flex items-center gap-4 p-3 xl:px-5 rounded-[20px] transition-all duration-300 group ${isActive ? 'bg-neutral-900 dark:bg-white text-white dark:text-black shadow-lg' : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-900/50 dark:hover:text-white'}`}>
            <Icon size={26} strokeWidth={isActive ? 2.5 : 2} className="relative z-10 flex-shrink-0" />
            <span className={`text-base font-bold hidden xl:block ${isActive ? '' : 'font-medium'}`}>
                {label}
            </span>
        </div>
      </Component>
    );
  };

  return (
    <>
      <aside className="w-full h-full flex flex-col justify-between">
         <div className="space-y-2">
            {/* Logo Area */}
            <div className="mb-8 pl-2 xl:pl-4 pt-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neutral-900 to-neutral-700 flex items-center justify-center text-white font-bold text-lg shadow-lg">L</div>
            </div>
            
            <NavIcon icon={Home} label="Home" href="/" />
            <NavIcon icon={Search} label="Search" href="/search" />
            <NavIcon icon={MessageCircle} label="Messages" href="/messages" />
            <NavIcon icon={Heart} label="Activity" href="/notifications" />
            <NavIcon icon={PlusSquare} label="Create" onClick={() => setIsCreateOpen(true)} />
            <NavIcon icon={User} label="Profile" href="/profile" />
         </div>
         
         <div className="mt-auto relative">
             {isMoreOpen && (
                 <div className="absolute bottom-16 left-0 w-56 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-2 shadow-xl animate-in slide-in-from-bottom-2 duration-200 z-50">
                     <button 
                         onClick={() => {
                             setIsMoreOpen(false);
                             router.push('/profile');
                         }}
                         className="w-full flex items-center gap-3 p-3 rounded-xl text-sm font-bold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-left"
                     >
                         <Settings size={18} />
                         <span>Settings</span>
                     </button>
                     <div className="h-px bg-neutral-200 dark:bg-neutral-800 my-1"></div>
                     <button 
                         onClick={() => {
                             setIsMoreOpen(false);
                             api.auth.logout();
                             router.push('/login');
                         }}
                         className="w-full flex items-center gap-3 p-3 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors text-left"
                     >
                         <LogOut size={18} />
                         <span>Log Out</span>
                     </button>
                 </div>
             )}
             <button 
                 onClick={() => setIsMoreOpen(!isMoreOpen)}
                 className={`w-full p-3 xl:px-5 rounded-[20px] flex items-center gap-4 transition-all duration-300 ${isMoreOpen ? 'bg-neutral-100 dark:bg-neutral-900/50 text-black dark:text-white' : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-900/50'}`}
             >
                 <Share2 size={26} />
                 <span className="hidden xl:block font-medium">More</span>
             </button>
         </div>
      </aside>
      <CreatePostModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </>
  );
}