'use client';

import { useState, useEffect } from 'react';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Smile, Loader2 } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import { Post as PostType, User } from '@/lib/types';
import { api } from '@/lib/api';

interface PostProps {
  post: PostType;
  user?: User;
  onUserClick?: (user: User) => void;
}

export default function Post({ post, user, onUserClick }: PostProps) {
  // 1. Initialize state from real PostType properties
  const [isLiked, setIsLiked] = useState(post.likedByMe || false);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [showHeartAnimation, setShowHeartAnimation] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<any[]>([]); // Will be fetched from backend later
  const [isPosting, setIsPosting] = useState(false);

  if (!user) return null; 

  // Helper to format real backend timestamps
  const formatTime = (dateString: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(dateString).getTime()) / 1000);
    if (seconds < 60) return "now";
    if (seconds < 3600) return Math.floor(seconds / 60) + "m";
    if (seconds < 86400) return Math.floor(seconds / 3600) + "h";
    return Math.floor(seconds / 86400) + "d";
  };

  const handleLike = async () => {
    const newLikedState = !isLiked;
    
    // Optimistic UI Update
    if (!isLiked) {
      setShowHeartAnimation(true);
      setTimeout(() => setShowHeartAnimation(false), 1000);
      setLikesCount(prev => prev + 1);
    } else {
      setLikesCount(prev => prev - 1);
    }
    setIsLiked(newLikedState);

    // Real API Call
    try {
      await api.posts.toggleLike(post.id);
    } catch (error) {
      // Revert if API fails
      setIsLiked(!newLikedState);
      setLikesCount(prev => newLikedState ? prev - 1 : prev + 1);
    }
  };

  const handlePostComment = async () => {
    if (!commentText.trim()) return;
    setIsPosting(true);

    try {
      // Real API Call
      const savedComment = await api.posts.addComment(post.id, commentText);
      
      // Update local state with the saved comment
      setComments(prev => [...prev, savedComment]);
      setCommentText("");
      if (!showComments) setShowComments(true);
    } catch (error) {
      console.error("Failed to post comment");
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="group relative mb-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* Main Card Container */}
      <div 
        className="relative rounded-[30px] overflow-hidden bg-neutral-100 dark:bg-neutral-900 shadow-xl shadow-neutral-200/50 dark:shadow-black/50 transition-all duration-500"
        onDoubleClick={handleLike}
      >
        {/* Floating Header (Glass) */}
        <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between">
            <div 
                className="flex items-center gap-3 bg-white/20 dark:bg-black/40 backdrop-blur-md p-1.5 pr-4 rounded-full border border-white/10 shadow-lg cursor-pointer hover:bg-white/30 transition-colors"
                onClick={() => onUserClick?.(user)}
            >
                <Avatar src={user.avatarUrl || ""} size="sm" />
                <div>
                    <p className="text-sm font-bold text-white drop-shadow-md">{user.username}</p>
                    <p className="text-[10px] text-white/80 uppercase tracking-wider">{formatTime(post.createdAt)}</p>
                </div>
            </div>
            <button className="p-2 rounded-full bg-white/20 dark:bg-black/40 backdrop-blur-md text-white hover:bg-white/30 transition-colors border border-white/10">
                <MoreHorizontal size={20} />
            </button>
        </div>

        {/* Floating Actions (Glass Pill) */}
        <div className="absolute right-4 bottom-4 z-20 flex flex-col gap-3">
             <div className="bg-white/20 dark:bg-black/40 backdrop-blur-xl border border-white/10 p-1.5 rounded-full flex flex-col items-center gap-3 shadow-xl">
                <button onClick={handleLike} className={`p-2 rounded-full transition-all duration-300 hover:scale-110 ${isLiked ? 'bg-red-500/20 text-red-500' : 'text-white hover:bg-white/20'}`}>
                  <Heart size={22} className={isLiked ? 'fill-red-500' : ''} />
                </button>
                <button 
                    onClick={() => setShowComments(!showComments)}
                    className="p-2 rounded-full text-white hover:bg-white/20 transition-all hover:scale-110"
                >
                  <MessageCircle size={22} />
                </button>
                <button className="p-2 rounded-full text-white hover:bg-white/20 transition-all hover:scale-110">
                  <Send size={22} />
                </button>
             </div>
             <div className="bg-white/20 dark:bg-black/40 backdrop-blur-xl border border-white/10 p-2.5 rounded-full flex justify-center text-white shadow-xl hover:bg-white/30 cursor-pointer">
                 <Bookmark size={20} />
             </div>
        </div>

        {/* Image */}
        <div className="aspect-[4/5] w-full relative">
            <img src={post.imageUrl} alt="Post" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
            <div className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-300 ${showHeartAnimation ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
                <div className="bg-white/20 backdrop-blur-md p-8 rounded-full border border-white/30 shadow-2xl">
                    <Heart size={80} className="text-white fill-white animate-bounce" />
                </div>
            </div>
        </div>
      </div>

      {/* Caption & Comments Section */}
      <div className="px-3 mt-4">
        <div className="mb-2 px-1">
             <p className="text-sm font-bold dark:text-white">{likesCount.toLocaleString()} likes</p>
        </div>

        <div className="mb-2 px-1">
             <p className="text-neutral-800 dark:text-neutral-200 leading-relaxed text-sm">
                <span 
                    className="font-bold mr-2 text-black dark:text-white cursor-pointer hover:underline"
                    onClick={() => onUserClick?.(user)}
                >
                    {user.username}
                </span>
                {post.caption}
             </p>
        </div>

        {/* Comments Section */}
        <div className="px-1 mb-4">
            {(comments.length > 0 || post.commentsCount > 0) && (
                <button 
                    onClick={() => setShowComments(!showComments)}
                    className="text-xs text-neutral-500 dark:text-neutral-400 font-medium hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors mb-3"
                >
                    {showComments ? 'Hide comments' : `View all ${post.commentsCount} comments`}
                </button>
            )}

            {showComments && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300 mb-4 pl-1 max-h-60 overflow-y-auto scrollbar-hide">
                    {comments.map((comment, idx) => (
                        <div key={idx} className="flex items-start gap-3 group">
                            <div className="w-6 h-6 rounded-full bg-neutral-200 dark:bg-neutral-800 flex-shrink-0" />
                            <div className="flex-1">
                                <span className="font-bold text-neutral-900 dark:text-white text-xs mr-2">{comment.username || 'You'}</span>
                                <p className="text-neutral-700 dark:text-neutral-300 text-xs leading-relaxed inline">{comment.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

        {/* Comment Input */}
        <div className="relative group/input">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Smile size={16} className="text-neutral-400" />
            </div>
            <input 
                type="text" 
                placeholder="Add a comment..." 
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handlePostComment()}
                disabled={isPosting}
                className="w-full bg-white dark:bg-neutral-800/50 border border-transparent focus:border-neutral-300 dark:focus:border-neutral-700 rounded-2xl py-2.5 pl-9 pr-14 text-xs sm:text-sm focus:outline-none transition-all shadow-sm disabled:opacity-60" 
            />
            {commentText.length > 0 && (
                <button 
                    onClick={handlePostComment}
                    disabled={isPosting}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-blue-500 hover:text-blue-600 transition-colors disabled:opacity-50"
                >
                    {isPosting ? <Loader2 size={14} className="animate-spin" /> : 'Post'}
                </button>
            )}
        </div>
      </div>
    </div>
  );
}