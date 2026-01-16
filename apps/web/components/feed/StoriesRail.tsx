'use client';
import { PlusSquare } from 'lucide-react';
import { MOCK_USERS } from '@/lib/constants';
import Avatar from '@/components/ui/Avatar';
import { User } from '@/lib/types';

const STORIES = MOCK_USERS.map((user, i) => ({ id: `s${i}`, user, viewed: i > 2 }));

interface StoriesRailProps {
  onUserClick: (user: User) => void;
}

export default function StoriesRail({ onUserClick }: StoriesRailProps) {
  return (
    <div className="mb-8 overflow-x-auto scrollbar-hide py-2 -mx-4 px-4 md:mx-0 md:px-0">
        <div className="flex gap-3">
            <div className="flex-shrink-0 w-16 h-24 rounded-2xl bg-neutral-100 dark:bg-neutral-800 border-2 border-dashed border-neutral-300 dark:border-neutral-700 flex flex-col items-center justify-center cursor-pointer hover:bg-neutral-200 transition-colors group">
                <div className="p-1.5 bg-white dark:bg-neutral-900 rounded-full shadow-sm group-hover:scale-110 transition-transform">
                    <PlusSquare size={16} className="text-neutral-500" />
                </div>
            </div>
            {STORIES.map((story) => (
                <div 
                    key={story.id} 
                    onClick={() => onUserClick(story.user)} 
                    className="flex-shrink-0 w-16 h-24 rounded-2xl relative overflow-hidden cursor-pointer group shadow-sm hover:shadow-md transition-all"
                >
                    <img src={story.user.avatar} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-90 group-hover:opacity-100" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className={`absolute inset-0 border-[2px] rounded-2xl ${story.viewed ? 'border-neutral-300/30' : 'border-pink-500'} pointer-events-none`} />
                    <div className="absolute bottom-1.5 left-0 right-0 text-center">
                        <p className="text-[9px] font-bold text-white truncate px-1">{story.user.username}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
}