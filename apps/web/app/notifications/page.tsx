'use client';

import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, UserPlus, UserCheck, Loader2 } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import { api } from '@/lib/api';
import { Notification } from '@/lib/types';

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
            const loadNotifications = async () => {
                try {
                    // 1. Explicitly type the result variable first
                    const response: any = await api.notifications.getAll();
                    
                    // 2. Map or Cast it safely
                    const validatedData: Notification[] = Array.isArray(response) ? response : [];
                    
                    setNotifications(validatedData);
                } catch (error) {
                    console.error("Failed to load notifications", error);
                    setNotifications([]); 
                } finally {
                    setIsLoading(false);
                }
            };
            loadNotifications();
        }, [api.notifications]); 

    const isToday = (dateString: string) => {
        const date = new Date(dateString);
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    const todayItems = notifications.filter(n => isToday(n.createdAt));
    const olderItems = notifications.filter(n => !isToday(n.createdAt));

    const formatTime = (dateString: string) => {
        const seconds = Math.floor((new Date().getTime() - new Date(dateString).getTime()) / 1000);
        if (seconds < 60) return "Just now";
        const intervals = {
            y: 31536000,
            mo: 2592000,
            d: 86400,
            h: 3600,
            m: 60
        };
        for (const [unit, value] of Object.entries(intervals)) {
            const res = Math.floor(seconds / value);
            if (res >= 1) return `${res}${unit} ago`;
        }
        return "Just now";
    };

    const NotificationItem = ({ item }: { item: Notification }) => (
        <div className={`flex items-center gap-4 p-4 rounded-[24px] transition-all cursor-pointer group border ${
            item.isRead 
            ? 'bg-transparent border-transparent hover:bg-neutral-100/50 dark:hover:bg-neutral-800/30' 
            : 'bg-white dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800 shadow-sm'
        }`}>
            <div className="relative">
                {/* FIX: Use an empty string fallback for 'src' to satisfy the Avatar component */}
                <Avatar src={item.actor?.avatarUrl || ""} size="md" />
                
                <div className="absolute -bottom-1 -right-1 rounded-full p-1 border-2 border-white dark:border-neutral-950">
                    {item.type === 'like' && <div className="bg-red-500 rounded-full p-0.5"><Heart size={8} className="text-white fill-white"/></div>}
                    {item.type === 'comment' && <div className="bg-blue-500 rounded-full p-0.5"><MessageCircle size={8} className="text-white fill-white"/></div>}
                    {item.type === 'follow' && <div className="bg-purple-500 rounded-full p-0.5"><UserPlus size={8} className="text-white fill-white"/></div>}
                </div>
            </div>
            
            <div className="flex-1 min-w-0">
                <p className="text-sm dark:text-neutral-200 leading-snug">
                    <span className="font-bold text-black dark:text-white hover:underline">
                        {item.actor?.username || 'Someone'}
                    </span>
                    <span className="ml-1 text-neutral-600 dark:text-neutral-400">
                        {item.type === 'like' && 'liked your post.'}
                        {item.type === 'follow' && 'started following you.'}
                        {item.type === 'comment' && `commented: "${item.text}"`}
                    </span>
                </p>
                <span className="text-[11px] font-medium text-neutral-400 uppercase tracking-tight">
                    {formatTime(item.createdAt)}
                </span>
            </div>

            {item.type === 'follow' ? (
                <button className="flex-shrink-0 px-4 py-1.5 bg-black dark:bg-white text-white dark:text-black text-xs font-bold rounded-full hover:opacity-80 transition-opacity flex items-center gap-1.5">
                    <UserCheck size={14} /> <span>Friends</span>
                </button>
            ) : item.postImage && (
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-neutral-200 dark:bg-neutral-800 flex-shrink-0 border border-neutral-100 dark:border-neutral-800">
                    <img src={item.postImage} alt="Post" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                </div>
            )}
            
            {!item.isRead && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full ring-4 ring-blue-500/10 flex-shrink-0"></div>}
        </div>
    );

    if (isLoading) return (
        <div className="flex h-64 items-center justify-center">
            <Loader2 className="animate-spin text-neutral-400" size={32} />
        </div>
    );

    return (
        <div className="max-w-xl mx-auto w-full pt-8 pb-32 px-4">
            <header className="flex items-center justify-between mb-8 px-2">
                <h1 className="text-3xl font-black dark:text-white tracking-tight">Activity</h1>
                {notifications.some(n => !n.isRead) && (
                    <button className="text-xs font-bold text-blue-500 hover:text-blue-600 transition-colors">
                        Mark all as read
                    </button>
                )}
            </header>
            
            <div className="space-y-8">
                {todayItems.length > 0 && (
                    <section>
                        <h3 className="text-xs font-black text-neutral-400 mb-4 px-2 uppercase tracking-[0.15em]">New</h3>
                        <div className="flex flex-col gap-1">
                            {todayItems.map(item => <NotificationItem key={item.id} item={item} />)}
                        </div>
                    </section>
                )}

                <section>
                    <h3 className="text-xs font-black text-neutral-400 mb-4 px-2 uppercase tracking-[0.15em]">Earlier</h3>
                    <div className="flex flex-col gap-1">
                        {olderItems.length > 0 ? (
                            olderItems.map(item => <NotificationItem key={item.id} item={item} />)
                        ) : (
                            notifications.length === 0 && (
                                <div className="text-center py-20 bg-neutral-50 dark:bg-neutral-900/50 rounded-[32px] border border-dashed border-neutral-200 dark:border-neutral-800">
                                    <p className="text-neutral-500 font-medium">No activity to show yet.</p>
                                </div>
                            )
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}