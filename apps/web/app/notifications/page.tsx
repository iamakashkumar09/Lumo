'use client';
import { Heart, MessageCircle, UserPlus, UserCheck } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import { MOCK_NOTIFICATIONS } from '@/lib/constants';

export default function NotificationsPage() {
    const today = MOCK_NOTIFICATIONS.filter(n => n.time.includes('m') || n.time.includes('h'));
    const week = MOCK_NOTIFICATIONS.filter(n => n.time.includes('d'));

    const NotificationItem = ({ item }: any) => (
        <div className="flex items-center gap-4 p-4 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-all cursor-pointer group">
            <div className="relative">
                <Avatar src={item.user.avatar} size="md" />
                {item.type === 'like' && <div className="absolute -bottom-1 -right-1 bg-red-500 rounded-full p-1 border-2 border-white dark:border-neutral-900"><Heart size={10} className="text-white fill-white"/></div>}
                {item.type === 'comment' && <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1 border-2 border-white dark:border-neutral-900"><MessageCircle size={10} className="text-white fill-white"/></div>}
                {item.type === 'follow' && <div className="absolute -bottom-1 -right-1 bg-purple-500 rounded-full p-1 border-2 border-white dark:border-neutral-900"><UserPlus size={10} className="text-white fill-white"/></div>}
            </div>
            
            <div className="flex-1 min-w-0">
                <p className="text-sm dark:text-white">
                    <span className="font-bold hover:underline">{item.user.username}</span>
                    <span className="text-neutral-600 dark:text-neutral-400">
                        {item.type === 'like' && ' liked your post.'}
                        {item.type === 'follow' && ' added you as a friend.'}
                        {item.type === 'comment' && ` commented: "${item.text}"`}
                    </span>
                </p>
                <span className="text-xs text-neutral-400">{item.time} ago</span>
            </div>

            {item.type === 'follow' ? (
                <button className="px-4 py-1.5 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-xs font-bold rounded-full transition-colors dark:text-white flex items-center gap-1">
                    <UserCheck size={14} /> Friends
                </button>
            ) : (
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-neutral-200 dark:bg-neutral-800">
                    <img src={item.postImage} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                </div>
            )}
            
            {!item.read && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
        </div>
    );

    return (
        <div className="max-w-2xl mx-auto w-full pt-6 pb-32 px-4 animate-in fade-in zoom-in duration-300">
            <h1 className="text-2xl font-bold dark:text-white mb-6 px-2">Activity</h1>
            
            <div className="mb-6">
                <h3 className="text-sm font-bold text-neutral-500 mb-3 px-2 uppercase tracking-wider">New</h3>
                <div className="flex flex-col gap-2">
                    {today.map(item => <NotificationItem key={item.id} item={item} />)}
                </div>
            </div>

            <div>
                <h3 className="text-sm font-bold text-neutral-500 mb-3 px-2 uppercase tracking-wider">This Week</h3>
                <div className="flex flex-col gap-2">
                    {week.map(item => <NotificationItem key={item.id} item={item} />)}
                </div>
            </div>
        </div>
    );
}