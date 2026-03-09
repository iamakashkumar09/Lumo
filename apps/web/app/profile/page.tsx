'use client';

import { useState, useEffect, Suspense, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Settings, UserPlus, MessageCircle, ArrowLeft, Check, MoreHorizontal, X, Heart, Grid, LayoutList, Send, Bookmark, ChevronLeft, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import Avatar from '@/components/ui/Avatar';
import Post from '@/components/feed/Post';
import { User, Post as PostType } from '@/lib/types';

function ProfileContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const userId = searchParams.get('id');
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<PostType[]>([]);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [isFriend, setIsFriend] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'feed'>('grid');
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal State
  const [selectedPost, setSelectedPost] = useState<PostType | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<{user: string, text: string}[]>([]);
  
  const commentInputRef = useRef<HTMLInputElement>(null);

  // Helper to format time strings from database
  const formatTime = (dateString: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(dateString).getTime()) / 1000);
    if (seconds < 60) return "Just now";
    const intervals = { d: 86400, h: 3600, m: 60 };
    for (const [unit, value] of Object.entries(intervals)) {
        const res = Math.floor(seconds / value);
        if (res >= 1) return `${res}${unit} ago`;
    }
    return "Just now";
  };

  useEffect(() => {
    const loadProfileData = async () => {
      setIsLoading(true);
      try {
        const me = await api.users.getCurrentUser();
        let targetUser: User | null = null;

        // 1. Determine which user we are looking at
        if (!userId || userId === 'me' || (me && userId === me.id)) {
          targetUser = me;
          setIsOwnProfile(true);
        } else {
          targetUser = await api.users.getUserById(userId);
          setIsOwnProfile(false);
        }

        if (targetUser) {
          setUser(targetUser);
          // 2. Fetch real posts for this user from NestJS
          const userPosts = (await api.posts.getUserPosts(targetUser.id)) as PostType[];
          setPosts(userPosts);
        }
      } catch (error) {
        console.error("Profile load failed:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadProfileData();
  }, [userId]);

  // Sync modal state when a post is opened
  useEffect(() => {
    if (selectedPost) {
        setIsLiked(selectedPost.likedByMe || false);
        setLikesCount(selectedPost.likesCount);
        setCommentText("");
        // In future: Fetch real comments for this post
        // api.posts.getComments(selectedPost.id).then(setComments);
    }
  }, [selectedPost]);

  const handleUserClick = (u: User) => {
    router.push(`/profile?id=${u.id}`);
    setSelectedPost(null);
  };

  const handleLike = async () => {
    if (!selectedPost) return;
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setLikesCount(prev => newLikedState ? prev + 1 : prev - 1);

    try {
        await api.posts.toggleLike(selectedPost.id);
    } catch (error) {
        // Revert on failure
        setIsLiked(!newLikedState);
        setLikesCount(prev => !newLikedState ? prev + 1 : prev - 1);
    }
  };

  const handlePostComment = async () => {
    if (!commentText.trim() || !user || !selectedPost) return;

    const textToSend = commentText;
    setCommentText("");

    // Optimistic UI Update
    const newComment = { user: user.username, text: textToSend };
    setComments(prev => [...prev, newComment]);

    try {
        await api.posts.addComment(selectedPost.id, textToSend);
    } catch (error) {
        console.error("Failed to post comment");
    }
  };

  if (isLoading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-neutral-400" size={40} /></div>;
  if (!user) return <div className="pt-40 text-center text-neutral-400">User not found.</div>;

  return (
    <>
      <div className="w-full max-w-3xl mx-auto pt-6 pb-32 px-4 animate-in fade-in zoom-in duration-300">
          
          {/* Header Card */}
          <div className="bg-neutral-100 dark:bg-neutral-900 rounded-[32px] p-5 mb-5 relative overflow-hidden text-center shadow-sm">
              <div className="absolute top-[-50%] left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-b from-purple-500/10 via-pink-500/5 to-transparent rounded-full blur-3xl pointer-events-none"></div>
              
              {!isOwnProfile && (
                  <button 
                      onClick={() => router.back()} 
                      className="absolute top-4 left-4 p-2.5 rounded-full bg-white/60 dark:bg-black/30 hover:bg-white dark:hover:bg-black/50 transition-colors backdrop-blur-md z-20"
                  >
                      <ArrowLeft size={20} className="text-neutral-700 dark:text-white" />
                  </button>
              )}

              <button className="absolute top-4 right-4 p-2.5 rounded-full bg-white/60 dark:bg-black/30 hover:bg-white dark:hover:bg-black/50 transition-colors backdrop-blur-md z-20">
                  {isOwnProfile ? <Settings size={20} className="text-neutral-700 dark:text-white" /> : <MoreHorizontal size={20} className="text-neutral-700 dark:text-white" />}
              </button>

              {/* Stats Row */}
              <div className="flex items-center justify-center gap-8 md:gap-12 mb-4 relative z-10 pt-2">
                  <div className="flex flex-col items-center min-w-[60px]">
                      <span className="text-xl font-bold dark:text-white">{user.stats?.followersCount || 0}</span>
                      <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest mt-0.5">Followers</span>
                  </div>

                  <div className="relative group">
                      <div className="absolute -inset-1.5 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 rounded-full blur opacity-70 group-hover:opacity-100 transition duration-1000 animate-pulse"></div>
                      <Avatar 
                          src={user.avatarUrl || ""} 
                          size="lg"
                          className="w-24 h-24 md:w-32 md:h-32 border-[4px] border-white dark:border-black relative z-10 shadow-xl"
                      />
                  </div>

                  <div className="flex flex-col items-center min-w-[60px]">
                      <span className="text-xl font-bold dark:text-white">{user.stats?.followingCount || 0}</span>
                      <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest mt-0.5">Following</span>
                  </div>
              </div>

              {/* Bio Info */}
              <div className="relative z-10 flex flex-col items-center max-w-md mx-auto">
                  <h1 className="text-xl md:text-2xl font-bold dark:text-white mb-0.5">{user.name}</h1>
                  <p className="text-neutral-500 dark:text-neutral-400 font-medium mb-3 text-sm">@{user.username}</p>
                  
                  {!isOwnProfile && (
                      <div className="flex gap-2 mb-4">
                          <button 
                              onClick={() => setIsFriend(!isFriend)}
                              className={`px-5 py-2 rounded-full font-bold text-sm flex items-center gap-2 transition-all active:scale-95 ${
                                  isFriend 
                                  ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300' 
                                  : 'bg-black dark:bg-white text-white dark:text-black shadow-lg'
                              }`}
                          >
                              {isFriend ? <Check size={16} /> : <UserPlus size={16} />}
                              {isFriend ? 'Following' : 'Follow'}
                          </button>
                          
                          <button className="px-3 py-2 bg-neutral-200 dark:bg-neutral-800 text-black dark:text-white rounded-full font-bold text-sm hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors">
                              <MessageCircle size={18} />
                          </button>
                      </div>
                  )}
                  
                  <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300 whitespace-pre-line">
                      {user.bio || "No bio yet."}
                  </p>
              </div>
          </div>

          {/* View Toggle */}
          <div className="flex items-center justify-between mb-6">
              <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                {['All Vibes', 'Photos', 'Videos'].map((filter, i) => (
                    <button key={filter} className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${i === 0 ? 'bg-black dark:bg-white text-white dark:text-black' : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-500 hover:bg-neutral-200 dark:hover:bg-neutral-700'}`}>
                        {filter}
                    </button>
                ))}
              </div>
              
              <div className="flex gap-1 bg-neutral-100 dark:bg-neutral-900 p-1 rounded-full ml-2">
                  <button onClick={() => setViewMode('grid')} className={`p-2 rounded-full transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-neutral-800 shadow-sm text-black dark:text-white' : 'text-neutral-400'}`}><Grid size={16} /></button>
                  <button onClick={() => setViewMode('feed')} className={`p-2 rounded-full transition-all ${viewMode === 'feed' ? 'bg-white dark:bg-neutral-800 shadow-sm text-black dark:text-white' : 'text-neutral-400'}`}><LayoutList size={16} /></button>
              </div>
          </div>
          
          {/* Content Area */}
          {viewMode === 'grid' ? (
              <div className="columns-2 md:columns-3 gap-3 space-y-3">
                  {posts.map((post) => (
                      <div 
                        key={post.id} 
                        className="break-inside-avoid rounded-2xl overflow-hidden relative group cursor-pointer bg-neutral-200 dark:bg-neutral-800"
                        onClick={() => setSelectedPost(post)}
                      >
                          <img 
                              src={post.imageUrl}
                              className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                              loading="lazy"
                              alt="Post"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 text-white font-bold">
                              <div className="flex items-center gap-1.5"><Heart size={18} className="fill-white"/> {post.likesCount}</div>
                              <div className="flex items-center gap-1.5"><MessageCircle size={18} className="fill-white"/> {post.commentsCount}</div>
                          </div>
                      </div>
                  ))}
                  {posts.length === 0 && <p className="text-center text-neutral-500 col-span-full py-10 font-medium">No posts to show.</p>}
              </div>
          ) : (
            <div className="flex flex-col gap-8">
                {posts.map((post) => (
                    <Post key={post.id} post={post} user={user} onUserClick={handleUserClick} />
                ))}
            </div>
          )}
      </div>

      {/* Post Detail Modal */}
      {selectedPost && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-black md:bg-[#FAFAFA]/95 md:dark:bg-[#050505]/95 md:backdrop-blur-md animate-in fade-in duration-200"
            onClick={() => setSelectedPost(null)}
          >
              <button className="hidden md:block absolute top-4 right-4 p-2 text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white bg-neutral-100 dark:bg-neutral-800 rounded-full z-50" onClick={() => setSelectedPost(null)}><X size={24} /></button>

              <div className="hidden md:flex w-full max-w-5xl h-[85vh] bg-white dark:bg-black rounded-3xl overflow-hidden shadow-2xl border border-neutral-200 dark:border-neutral-800" onClick={(e) => e.stopPropagation()}>
                  <div className="flex-1 bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center relative overflow-hidden group/modal">
                      <img src={selectedPost.imageUrl} className="w-full h-full object-cover" alt="Post" />
                      <div className="absolute right-6 bottom-6 z-20 flex flex-col gap-2">
                           <div className="bg-white/30 dark:bg-black/40 backdrop-blur-xl border border-white/20 p-1.5 rounded-full flex flex-col items-center gap-2 shadow-lg">
                              <button onClick={handleLike} className={`p-2.5 rounded-full transition-all ${isLiked ? 'bg-red-500 text-white' : 'text-white hover:bg-white/20'}`}><Heart size={20} className={isLiked ? 'fill-current' : ''} /></button>
                              <button onClick={() => commentInputRef.current?.focus()} className="p-2.5 rounded-full text-white hover:bg-white/20"><MessageCircle size={20} /></button>
                              <button className="p-2.5 rounded-full text-white hover:bg-white/20"><Send size={20} /></button>
                           </div>
                      </div>
                  </div>

                  <div className="w-[350px] lg:w-[400px] flex flex-col border-l border-neutral-100 dark:border-neutral-800">
                      <div className="p-4 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleUserClick(user)}>
                              <Avatar src={user.avatarUrl || ""} size="sm" />
                              <span className="font-bold text-sm dark:text-white hover:underline">{user.username}</span>
                          </div>
                      </div>

                      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
                          <div className="flex gap-3">
                              <Avatar src={user.avatarUrl || ""} size="sm" className="w-8 h-8" />
                              <div className="flex-1">
                                  <span className="font-bold text-sm mr-2 dark:text-white">{user.username}</span>
                                  <span className="text-sm text-neutral-700 dark:text-neutral-300">{selectedPost.caption}</span>
                                  <p className="text-xs text-neutral-400 mt-1">{formatTime(selectedPost.createdAt)}</p>
                              </div>
                          </div>
                      </div>

                      <div className="p-4 border-t border-neutral-100 dark:border-neutral-800 bg-white dark:bg-black">
                          <p className="font-bold text-sm dark:text-white mb-2">{likesCount.toLocaleString()} likes</p>
                          <div className="relative">
                              <input ref={commentInputRef} type="text" placeholder="Add a comment..." value={commentText} onChange={(e) => setCommentText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handlePostComment()} className="w-full bg-transparent text-sm outline-none dark:text-white" />
                              <button disabled={!commentText.trim()} onClick={handlePostComment} className="absolute right-0 top-1/2 -translate-y-1/2 text-sm font-bold text-blue-500 disabled:opacity-50">Post</button>
                          </div>
                      </div>
                  </div>
              </div>

              {/* Mobile View */}
              <div className="md:hidden w-full h-full bg-white dark:bg-black overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                  <div className="sticky top-0 z-50 bg-white/90 dark:bg-black/90 backdrop-blur-md border-b border-neutral-100 dark:border-neutral-800 px-4 py-3 flex items-center gap-4">
                      <button onClick={() => setSelectedPost(null)}><ChevronLeft size={28} className="dark:text-white" /></button>
                      <h2 className="text-lg font-bold dark:text-white">Posts</h2>
                  </div>
                  <div className="pb-24">
                      <Post post={selectedPost} user={user} onUserClick={handleUserClick} />
                  </div>
              </div>
          </div>
      )}
    </>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading vibes...</div>}>
      <ProfileContent />
    </Suspense>
  );
}