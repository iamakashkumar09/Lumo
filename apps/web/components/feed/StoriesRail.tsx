'use client';

import { useState, useEffect } from 'react';
import { PlusSquare, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { User } from '@/lib/types';

interface StoriesRailProps {
  onUserClick: (user: User) => void;
}

export default function StoriesRail({ onUserClick }: StoriesRailProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPotentialStories = async () => {
      try {
        // Fetching users to represent potential stories for now
        const fetchedUsers = await api.users.getAll();
        setUsers(fetchedUsers);
      } catch (error) {
        console.error("Failed to load stories:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadPotentialStories();
  }, []);

  return (
    <div className="mb-8 overflow-x-auto scrollbar-hide py-2 -mx-4 px-4 md:mx-0 md:px-0">
        <div className="flex gap-3">
            {/* Create Story Placeholder */}
            <div className="flex-shrink-0 w-16 h-24 rounded-2xl bg-neutral-100 dark:bg-neutral-900 border-2 border-dashed border-neutral-300 dark:border-neutral-800 flex flex-col items-center justify-center cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-all group">
                <div className="p-1.5 bg-white dark:bg-black rounded-full shadow-sm group-hover:scale-110 transition-transform border border-neutral-100 dark:border-neutral-800">
                    <PlusSquare size={16} className="text-neutral-500" />
                </div>
                <span className="text-[9px] font-bold text-neutral-400 mt-2">Vibe</span>
            </div>

            {isLoading ? (
                <div className="flex items-center px-4">
                    <Loader2 size={16} className="animate-spin text-neutral-300" />
                </div>
            ) : (
                users.map((user) => (
                    <div 
                        key={user.id} 
                        onClick={() => onUserClick(user)} 
                        className="flex-shrink-0 w-16 h-24 rounded-2xl relative overflow-hidden cursor-pointer group shadow-sm hover:shadow-md transition-all border border-neutral-100 dark:border-neutral-800"
                    >
                        {/* Updated to use user.avatarUrl */}
                        <img 
                            src={user.avatarUrl || 'https://via.placeholder.com/150'} 
                            alt={user.username}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-90 group-hover:opacity-100" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        
                        {/* Border logic - defaults to colorful if they have a story, neutral if viewed */}
                        <div className="absolute inset-0 border-[2px] rounded-2xl border-pink-500 pointer-events-none group-hover:border-white transition-colors" />
                        
                        <div className="absolute bottom-1.5 left-0 right-0 text-center">
                            <p className="text-[9px] font-bold text-white truncate px-1">
                                {user.username}
                            </p>
                        </div>
                    </div>
                ))
            )}
        </div>
    </div>
  );
}