'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, Search, MessageCircle, Heart, PlusSquare, User, Share2 } from 'lucide-react';
import { useState } from 'react';
import CreatePostModal from '@/components/shared/CreatePostModal';

export default function Sidebar() {
  const pathname = usePathname();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  if (pathname.includes('/login') || pathname.includes('/signup')) return null;
  
  const NavIcon = ({ icon: Icon, label, href, onClick }: any) => {
    const isActive = pathname === href;
    const Component = href ? Link : 'button';
    
    return (
      <Component href={href || ''} onClick={onClick} className="block w-full">
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
         
         <div className="mt-auto">
             <button className="w-full p-3 xl:px-5 rounded-[20px] flex items-center gap-4 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-900/50 transition-colors">
                 <Share2 size={26} />
                 <span className="hidden xl:block font-medium">More</span>
             </button>
         </div>
      </aside>
      <CreatePostModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </>
  );
}