'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import StoriesRail from '@/components/feed/StoriesRail';
import Post from '@/components/feed/Post';
import { api } from '@/lib/api';
import { Bell } from 'lucide-react';
import Link from 'next/link';
import { MOCK_USERS } from '@/lib/constants';
import { Post as PostType, User } from '@/lib/types';

export default function HomePage() {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchPosts = async () => {
      const data = await api.posts.getAll();
      setPosts(data);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  const handleUserClick = (user: User) => {
    router.push(`/profile?id=${user.id}`);
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 pt-4 pb-24 md:pb-10">
      
      {/* Header */}
      <div className="sticky top-0 z-20 bg-[#FAFAFA]/90 dark:bg-[#050505]/90 backdrop-blur-xl flex items-center justify-between py-3 mb-4 -mx-4 px-4 transition-all">
          <h1 className="text-2xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-neutral-900 to-neutral-500 dark:from-white dark:to-neutral-500">
            Feed
          </h1>
          <Link href="/notifications" className="p-2.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors active:scale-95">
             <Bell size={22} className="text-neutral-700 dark:text-white" />
          </Link>
      </div>
      
      <div className="mb-8">
        <StoriesRail onUserClick={handleUserClick} />
      </div>

      <div className="flex flex-col gap-8">
        {loading ? (
          [1, 2].map((i) => (
            <div key={i} className="w-full aspect-[4/5] bg-neutral-200 dark:bg-neutral-900 rounded-[32px] animate-pulse" />
          ))
        ) : (
          posts.map((post) => {
             const user = MOCK_USERS.find(u => u.id === post.userId);
             return <Post key={post.id} post={post} user={user} onUserClick={handleUserClick} />;
          })
        )}
      </div>
    </div>
  );
}