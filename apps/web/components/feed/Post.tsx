'use client';
import { useState } from 'react';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Smile, Loader2 } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import { Post as PostType, User } from '@/lib/types';

interface PostProps {
  post: PostType;
  user?: User;
  onUserClick?: (user: User) => void;
}

// Mock initial comments to simulate backend data
const INITIAL_COMMENTS = [
    { 
        id: 1, 
        username: "alex_visuals", 
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop", 
        text: "This lighting is incredible! 📸", 
        time: "2h" 
    },
    { 
        id: 2, 
        username: "sarah.lens", 
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop", 
        text: "Where was this taken? 😍", 
        time: "45m" 
    }
];

export default function Post({ post, user, onUserClick }: PostProps) {
  const [isLiked, setIsLiked] = useState(post.liked);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [showHeartAnimation, setShowHeartAnimation] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState(INITIAL_COMMENTS);
  const [isPosting, setIsPosting] = useState(false);

  if (!user) return null; 

  const handleLike = () => {
    if (!isLiked) {
      setShowHeartAnimation(true);
      setTimeout(() => setShowHeartAnimation(false), 1000);
      setLikesCount(prev => prev + 1);
    } else {
        setLikesCount(prev => prev - 1);
    }
    setIsLiked(!isLiked);
  };

  const handleUserClick = () => {
      if (onUserClick) {
          onUserClick(user);
      }
  }

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  const handlePostComment = async () => {
    if (!commentText.trim()) return;
    
    setIsPosting(true);
    
    // Simulate Backend API Call
    // await api.comments.create({ postId: post.id, text: commentText });
    await new Promise(resolve => setTimeout(resolve, 600));

    const newComment = {
        id: Date.now(),
        username: "You", // In real app, use currentUser.username
        avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop", // use currentUser.avatar
        text: commentText,
        time: "Just now"
    };

    setComments(prev => [...prev, newComment]);
    setCommentText("");
    setIsPosting(false);
    if (!showComments) setShowComments(true);
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
                onClick={handleUserClick}
            >
                <Avatar src={user.avatar} size="sm" />
                <div>
                    <p className="text-sm font-bold text-white drop-shadow-md">{user.username}</p>
                    <p className="text-[10px] text-white/80 uppercase tracking-wider">{post.time}</p>
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
                    onClick={toggleComments}
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
            <img src={post.image} alt="Post" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
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
        {/* Like Count */}
        <div className="mb-2 px-1">
             <p className="text-sm font-bold dark:text-white">{likesCount.toLocaleString()} likes</p>
        </div>

        <div className="mb-2 px-1">
             <p className="text-neutral-800 dark:text-neutral-200 leading-relaxed text-sm">
                <span 
                    className="font-bold mr-2 text-black dark:text-white cursor-pointer hover:underline"
                    onClick={handleUserClick}
                >
                    {user.username}
                </span>
                {post.caption}
             </p>
        </div>

        {/* Comments Toggle & List */}
        <div className="px-1 mb-4">
            {comments.length > 0 && (
                <button 
                    onClick={toggleComments}
                    className="text-xs text-neutral-500 dark:text-neutral-400 font-medium hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors mb-3"
                >
                    {showComments ? 'Hide comments' : `View all ${comments.length} comments`}
                </button>
            )}

            {showComments && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300 mb-4 pl-1 max-h-60 overflow-y-auto scrollbar-hide">
                    {comments.map((comment) => (
                        <div key={comment.id} className="flex items-start gap-3 group">
                            <Avatar src={comment.avatar} size="sm" className="w-6 h-6 mt-0.5" />
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-0.5">
                                    <span className="font-bold text-neutral-900 dark:text-white text-xs">{comment.username}</span>
                                    <span className="text-[10px] text-neutral-400">{comment.time}</span>
                                </div>
                                <p className="text-neutral-700 dark:text-neutral-300 text-xs leading-relaxed">{comment.text}</p>
                            </div>
                            <Heart size={12} className="text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:text-red-500 hover:fill-red-500" />
                        </div>
                    ))}
                </div>
            )}
        </div>

        {/* Comment Input with Post Button */}
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
                className="w-full bg-white dark:bg-neutral-800/50 border border-transparent focus:border-neutral-300 dark:focus:border-neutral-700 rounded-2xl py-2.5 pl-9 pr-14 text-xs sm:text-sm focus:outline-none focus:ring-4 focus:ring-neutral-100 dark:focus:ring-neutral-800 transition-all shadow-sm disabled:opacity-60" 
            />
            {commentText.length > 0 && (
                <button 
                    onClick={handlePostComment}
                    disabled={isPosting}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-blue-500 hover:text-blue-600 transition-colors animate-in fade-in disabled:opacity-50"
                >
                    {isPosting ? <Loader2 size={14} className="animate-spin" /> : 'Post'}
                </button>
            )}
        </div>
      </div>
    </div>
  );
}