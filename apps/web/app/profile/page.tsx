'use client';

import { useState, useEffect, Suspense, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Settings, UserPlus, MessageCircle, ArrowLeft, Check, MoreHorizontal, X, Heart, Grid, LayoutList, Send, Bookmark, ChevronLeft } from 'lucide-react';
import { api } from '@/lib/api';
import Avatar from '@/components/ui/Avatar';
import Post from '@/components/feed/Post'; // Import Post component
import { User, Post as PostType } from '@/lib/types';
import { MOCK_USERS } from '@/lib/constants';

function ProfileContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const userId = searchParams.get('id');
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<PostType[]>([]); // Dynamic Posts State
  const [isOwnProfile, setIsOwnProfile] = useState(true);
  const [isFriend, setIsFriend] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'feed'>('grid');
  
  // Modal State
  const [selectedPost, setSelectedPost] = useState<PostType | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [commentText, setCommentText] = useState("");
  // Comments State for dynamic updates
  const [comments, setComments] = useState<{user: string, text: string}[]>([
      { user: "alex_visuals", text: "This lighting is incredible! 📸" },
      { user: "design_daily", text: "Super clean composition." },
      { user: "sarah.lens", text: "Where was this taken? 😍" },
  ]);
  
  const commentInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadUser = async () => {
      const me = await api.users.getCurrentUser();
      
      let currentUser = me;
      if (!userId || userId === 'me' || userId === me.id) {
        setUser(me);
        setIsOwnProfile(true);
      } else {
        const foundUser = MOCK_USERS.find(u => u.id === userId);
        if (foundUser) {
            setUser(foundUser);
            currentUser = foundUser;
            setIsOwnProfile(false);
        } else {
            setUser(me);
            setIsOwnProfile(true);
        }
      }

      // Simulate fetching dynamic posts for this user from Backend
      // In future: const userPosts = await api.posts.getUserPosts(currentUser.id);
      const generatedPosts: PostType[] = Array.from({ length: 9 }).map((_, i) => ({
        id: `profile-post-${i}-${currentUser?.id}`,
        userId: currentUser?.id || 'unknown',
        image: `https://images.unsplash.com/photo-${1500000000000 + i * 999}?w=500&h=${i % 2 === 0 ? '600' : '400'}&fit=crop`,
        caption: i % 2 === 0 ? "Just another day in paradise 🌴" : "Creating something new ✨",
        likes: 120 + i * 45,
        comments: 5 + i * 2,
        time: `${i + 1}d ago`,
        liked: false
      }));
      setPosts(generatedPosts);
    };
    loadUser();
  }, [userId]);

  // Reset local state when a new post is selected
  useEffect(() => {
    if (selectedPost) {
        setIsLiked(selectedPost.liked);
        setLikesCount(selectedPost.likes);
        setCommentText("");
        // In real backend, you would fetch comments for this specific post here
        // api.posts.getComments(selectedPost.id).then(setComments);
    }
  }, [selectedPost]);

  const handleUserClick = (u: User) => {
    router.push(`/profile?id=${u.id}`);
    setSelectedPost(null); // Close modal on navigation
  };

  const handleLike = async () => {
    // 1. Optimistic UI Update (Immediate)
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setLikesCount(prev => newLikedState ? prev + 1 : prev - 1);

    // 2. Backend Call (Placeholder)
    try {
        // await api.posts.toggleLike(selectedPost!.id);
        console.log(`Synced like for post ${selectedPost?.id} to backend`);
    } catch (error) {
        // Revert on failure
        setIsLiked(!newLikedState);
        setLikesCount(prev => !newLikedState ? prev + 1 : prev - 1);
    }
  };

  const handlePostComment = async () => {
    if (!commentText.trim() || !user) return;

    // 1. Optimistic UI Update
    const newComment = { user: user.username, text: commentText };
    setComments(prev => [...prev, newComment]);
    setCommentText("");

    // 2. Backend Call (Placeholder)
    try {
        // await api.posts.addComment(selectedPost!.id, newComment.text);
        console.log(`Sent comment "${newComment.text}" to backend`);
    } catch (error) {
        // Handle error (e.g. show toast)
    }
  };

  const handleFocusComment = () => {
    if (commentInputRef.current) {
        commentInputRef.current.focus();
    }
  };

  if (!user) return <div className="pt-40 text-center text-neutral-400 animate-pulse">Loading vibes...</div>;

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

              {isOwnProfile ? (
                  <button className="absolute top-4 right-4 p-2.5 rounded-full bg-white/60 dark:bg-black/30 hover:bg-white dark:hover:bg-black/50 transition-colors backdrop-blur-md z-20">
                      <Settings size={20} className="text-neutral-700 dark:text-white" />
                  </button>
              ) : (
                  <button className="absolute top-4 right-4 p-2.5 rounded-full bg-white/60 dark:bg-black/30 hover:bg-white dark:hover:bg-black/50 transition-colors backdrop-blur-md z-20">
                      <MoreHorizontal size={20} className="text-neutral-700 dark:text-white" />
                  </button>
              )}

              {/* Stats Row */}
              <div className="flex items-center justify-center gap-8 md:gap-12 mb-4 relative z-10 pt-2">
                  <div className="flex flex-col items-center min-w-[60px]">
                      <span className="text-xl font-bold dark:text-white">{user.stats.friends}</span>
                      <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest mt-0.5">Friends</span>
                  </div>

                  <div className="relative group">
                      <div className="absolute -inset-1.5 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 rounded-full blur opacity-70 group-hover:opacity-100 transition duration-1000 animate-pulse"></div>
                      <img 
                          src={user.avatar} 
                          className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-[4px] border-white dark:border-black relative z-10 shadow-xl"
                      />
                  </div>

                  <div className="flex flex-col items-center min-w-[60px]">
                      <span className="text-xl font-bold dark:text-white">{user.stats.following}</span>
                      <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest mt-0.5">Following</span>
                  </div>
              </div>

              {/* Bio Info */}
              <div className="relative z-10 flex flex-col items-center max-w-md mx-auto">
                  <h1 className="text-xl md:text-2xl font-bold dark:text-white mb-0.5">{user.name}</h1>
                  <p className="text-neutral-500 dark:text-neutral-400 font-medium mb-3 text-sm">@{user.username}</p>
                  
                  {!isOwnProfile ? (
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
                              {isFriend ? 'Friends' : 'Add Friend'}
                          </button>
                          
                          <button className="px-3 py-2 bg-neutral-200 dark:bg-neutral-800 text-black dark:text-white rounded-full font-bold text-sm hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors">
                              <MessageCircle size={18} />
                          </button>
                      </div>
                  ) : (
                      <div className="flex flex-wrap justify-center gap-2 mb-4">
                          <span className="px-3 py-1 rounded-full bg-white dark:bg-black/40 text-[10px] font-bold border border-neutral-200 dark:border-neutral-800 uppercase tracking-wide shadow-sm text-neutral-600 dark:text-neutral-300">Photographer</span>
                          <span className="px-3 py-1 rounded-full bg-white dark:bg-black/40 text-[10px] font-bold border border-neutral-200 dark:border-neutral-800 uppercase tracking-wide shadow-sm text-neutral-600 dark:text-neutral-300">Digital Art</span>
                      </div>
                  )}
                  
                  <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300 whitespace-pre-line">
                      {user.bio}
                  </p>
              </div>
          </div>

          {/* Filter / View Toggle */}
          <div className="flex items-center justify-between mb-6">
              <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                {['All Vibes', 'Photos', 'Videos'].map((filter, i) => (
                    <button key={filter} className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${i === 0 ? 'bg-black dark:bg-white text-white dark:text-black' : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-500 hover:bg-neutral-200 dark:hover:bg-neutral-700'}`}>
                        {filter}
                    </button>
                ))}
              </div>
              
              <div className="flex gap-1 bg-neutral-100 dark:bg-neutral-900 p-1 rounded-full ml-2">
                  <button 
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-full transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-neutral-800 shadow-sm text-black dark:text-white' : 'text-neutral-400'}`}
                  >
                      <Grid size={16} />
                  </button>
                  <button 
                    onClick={() => setViewMode('feed')}
                    className={`p-2 rounded-full transition-all ${viewMode === 'feed' ? 'bg-white dark:bg-neutral-800 shadow-sm text-black dark:text-white' : 'text-neutral-400'}`}
                  >
                      <LayoutList size={16} />
                  </button>
              </div>
          </div>
          
          {/* Content Area - Uses dynamic 'posts' state */}
          {viewMode === 'grid' ? (
              <div className="columns-2 md:columns-3 gap-3 space-y-3">
                  {posts.map((post) => (
                      <div 
                        key={post.id} 
                        className="break-inside-avoid rounded-2xl overflow-hidden relative group cursor-pointer bg-neutral-200 dark:bg-neutral-800"
                        onClick={() => setSelectedPost(post)}
                      >
                          <img 
                              src={post.image}
                              className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                              loading="lazy"
                              alt="User post"
                          />
                          {/* Hover Overlay with Counts */}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 text-white font-bold">
                              <div className="flex items-center gap-1.5"><Heart size={18} className="fill-white"/> {post.likes}</div>
                              <div className="flex items-center gap-1.5"><MessageCircle size={18} className="fill-white"/> {post.comments}</div>
                          </div>
                      </div>
                  ))}
              </div>
          ) : (
            <div className="flex flex-col gap-8">
                {posts.map((post) => (
                    <Post key={post.id} post={post} user={user} onUserClick={handleUserClick} />
                ))}
            </div>
          )}
      </div>

      {/* Post Detail View */}
      {selectedPost && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-black md:bg-[#FAFAFA]/95 md:dark:bg-[#050505]/95 md:backdrop-blur-md animate-in fade-in duration-200"
            onClick={() => setSelectedPost(null)}
          >
              {/* Close Button (Desktop Only) */}
              <button 
                className="hidden md:block absolute top-4 right-4 p-2 text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white transition-colors bg-neutral-100 dark:bg-neutral-800 rounded-full z-50"
                onClick={() => setSelectedPost(null)}
              >
                  <X size={24} />
              </button>

              {/* Desktop View: Split Layout */}
              <div 
                  className="hidden md:flex w-full max-w-5xl h-[85vh] bg-white dark:bg-black rounded-3xl overflow-hidden shadow-2xl border border-neutral-200 dark:border-neutral-800"
                  onClick={(e) => e.stopPropagation()} 
              >
                  {/* Left Side: Image with Floating Actions (Feed Style) */}
                  <div className="flex-1 bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center relative overflow-hidden group/modal">
                      <img 
                          src={selectedPost.image} 
                          className="w-full h-full object-cover"
                          alt="Post Content"
                      />
                      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

                      {/* Floating Actions on Image */}
                      <div className="absolute right-6 bottom-6 z-20 flex flex-col gap-2">
                           <div className="bg-white/30 dark:bg-black/40 backdrop-blur-xl border border-white/20 p-1.5 rounded-full flex flex-col items-center gap-2 shadow-lg">
                              <button 
                                onClick={handleLike} 
                                className={`p-2.5 rounded-full transition-all duration-200 active:scale-90 ${isLiked ? 'bg-red-500/90 text-white' : 'text-white hover:bg-white/20'}`}
                              >
                                <Heart size={20} className={isLiked ? 'fill-current' : ''} />
                              </button>
                              <button onClick={handleFocusComment} className="p-2.5 rounded-full text-white hover:bg-white/20 transition-all active:scale-90">
                                <MessageCircle size={20} />
                              </button>
                              <button className="p-2.5 rounded-full text-white hover:bg-white/20 transition-all active:scale-90">
                                <Send size={20} />
                              </button>
                           </div>
                      </div>
                  </div>

                  {/* Right Side: Details */}
                  <div className="w-[350px] lg:w-[400px] flex flex-col border-l border-neutral-100 dark:border-neutral-800">
                      {/* Header */}
                      <div className="p-4 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleUserClick(user)}>
                              <Avatar src={user.avatar} size="sm" />
                              <span className="font-bold text-sm dark:text-white hover:underline">{user.username}</span>
                          </div>
                          <button className="text-neutral-500 hover:text-black dark:hover:text-white">
                              <MoreHorizontal size={20} />
                          </button>
                      </div>

                      {/* Comments */}
                      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
                          <div className="flex gap-3">
                              <Avatar src={user.avatar} size="sm" className="w-8 h-8" />
                              <div className="flex-1">
                                  <span className="font-bold text-sm mr-2 dark:text-white">{user.username}</span>
                                  <span className="text-sm text-neutral-700 dark:text-neutral-300">{selectedPost.caption}</span>
                                  <p className="text-xs text-neutral-400 mt-1">{selectedPost.time}</p>
                              </div>
                          </div>
                          {comments.map((comment, idx) => (
                              <div key={idx} className="flex gap-3 animate-in fade-in slide-in-from-bottom-1">
                                  <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-800 flex-shrink-0" />
                                  <div className="flex-1">
                                      <span className="font-bold text-sm mr-2 dark:text-white">{comment.user}</span>
                                      <span className="text-sm text-neutral-700 dark:text-neutral-300">{comment.text}</span>
                                  </div>
                                  <Heart size={12} className="text-neutral-400 hover:text-red-500 cursor-pointer mt-1" />
                              </div>
                          ))}
                      </div>

                      {/* Footer */}
                      <div className="p-4 border-t border-neutral-100 dark:border-neutral-800 bg-white dark:bg-black">
                          <div className="flex items-center justify-between mb-2">
                             <p className="font-bold text-sm dark:text-white">{likesCount.toLocaleString()} likes</p>
                             <button className="text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white">
                                  <Bookmark size={20} />
                              </button>
                          </div>
                          <div className="relative">
                              <input 
                                  ref={commentInputRef}
                                  type="text" 
                                  placeholder="Add a comment..." 
                                  value={commentText}
                                  onChange={(e) => setCommentText(e.target.value)}
                                  onKeyDown={(e) => e.key === 'Enter' && handlePostComment()}
                                  className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-400 dark:text-white"
                              />
                              <button 
                                  disabled={!commentText} 
                                  onClick={handlePostComment}
                                  className="absolute right-0 top-1/2 -translate-y-1/2 text-sm font-bold text-blue-500 disabled:opacity-50 hover:text-blue-600"
                              >
                                  Post
                              </button>
                          </div>
                      </div>
                  </div>
              </div>

              {/* Mobile View: Full Screen "Instagram Style" Page */}
              <div 
                  className="md:hidden w-full h-full bg-white dark:bg-black overflow-y-auto"
                  onClick={(e) => e.stopPropagation()} 
              >
                  {/* Sticky Header */}
                  <div className="sticky top-0 z-50 bg-white/90 dark:bg-black/90 backdrop-blur-md border-b border-neutral-100 dark:border-neutral-800 px-4 py-3 flex items-center gap-4">
                      <button onClick={() => setSelectedPost(null)}>
                          <ChevronLeft size={28} className="text-black dark:text-white" />
                      </button>
                      <h2 className="text-lg font-bold dark:text-white">Posts</h2>
                  </div>

                  {/* Post Content */}
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
    <Suspense fallback={<div className="pt-20 text-center">Loading...</div>}>
      <ProfileContent />
    </Suspense>
  );
}