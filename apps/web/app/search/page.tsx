'use client';
import { Search as SearchIcon, Heart } from 'lucide-react';
import { useState } from 'react';

export default function SearchPage() {
  const [activeCategory, setActiveCategory] = useState('For You');
  const categories = ['For You', 'Design', 'Photography', 'Art', 'Travel', 'Tech'];

  return (
    <div className="max-w-4xl mx-auto w-full pt-6 pb-32 px-4 animate-in fade-in zoom-in duration-300">
      {/* Sticky Header */}
      <div className="sticky top-0 z-30 pt-2 pb-4 bg-[#FAFAFA]/95 dark:bg-[#050505]/95 backdrop-blur-xl -mx-4 px-4">
        <div className="relative mb-4">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
            <input 
                type="text"
                placeholder="Search ideas, people, or tags..."
                className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl py-3.5 pl-12 pr-4 outline-none dark:text-white focus:ring-2 focus:ring-purple-500/20 transition-all shadow-sm"
            />
        </div>
        
        {/* Categories Horizontal Scroll */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {categories.map(cat => (
                <button 
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                        activeCategory === cat 
                        ? 'bg-black dark:bg-white text-white dark:text-black shadow-lg' 
                        : 'bg-white dark:bg-neutral-900 text-neutral-500 border border-neutral-200 dark:border-neutral-800'
                    }`}
                >
                    {cat}
                </button>
            ))}
        </div>
      </div>

      {/* Masonry Grid */}
      <div className="columns-2 md:columns-3 gap-4 space-y-4">
         {/* Placeholder logic for masonry grid items */}
         {[...Array(12)].map((_, i) => (
            <div key={i} className="break-inside-avoid rounded-2xl overflow-hidden relative group cursor-pointer bg-neutral-200 dark:bg-neutral-800">
               <div className="w-full h-64 bg-gray-300 dark:bg-gray-700 animate-pulse"></div>
            </div>
         ))}
      </div>
    </div>
  );
}