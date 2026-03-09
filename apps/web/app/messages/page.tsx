'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, Phone, Video, ArrowLeft, Send, MessageCircle, PlusSquare, Settings, Info, Bell, Shield, ChevronRight, Moon, LogOut } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import Link from 'next/link';
import { api } from '@/lib/api';
import { User } from '@/lib/types';

// Temporary type until you add it to your types.ts
interface Message {
    id: string;
    text: string;
    senderId: string;
    createdAt: string;
}

export default function MessagesPage() {
    // 1. New State for Real Data
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [activeMessages, setActiveMessages] = useState<Message[]>([]);
    
    // UI State
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [inputText, setInputText] = useState("");
    const [showSettings, setShowSettings] = useState(false);
    
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const selectedUser = users.find(u => u.id === selectedUserId);

    // 2. Fetch the logged-in user and all available contacts on mount
    useEffect(() => {
        const loadInitialData = async () => {
            const me = await api.users.getCurrentUser();
            setCurrentUser(me);

            const allUsers = await api.users.getAll();
            // Filter out ourselves from the contact list if we are logged in
            if (me) {
                setUsers(allUsers.filter(u => u.id !== me.id));
            } else {
                setUsers(allUsers);
            }
        };
        loadInitialData();
    }, []);

    // 3. Fetch conversation history when a user clicks on a chat
    useEffect(() => {
        if (!selectedUserId) {
            setActiveMessages([]);
            return;
        }

        const loadMessages = async () => {
            const msgs = await api.messages.getConversation(selectedUserId);
            setActiveMessages(msgs);
        };
        loadMessages();
    }, [selectedUserId]);

    // Scroll to bottom when new messages arrive
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [activeMessages]);

    // 4. Handle sending a real message
    const handleSendMessage = async () => {
        if (!inputText.trim() || !selectedUserId || !currentUser) return;

        const textToSend = inputText;
        setInputText("");

        // Optimistic UI Update: Show the message instantly
        const tempMessage: Message = {
            id: Date.now().toString(),
            text: textToSend,
            senderId: currentUser.id, // Mark as ours
            createdAt: new Date().toISOString()
        };
        
        setActiveMessages(prev => [...prev, tempMessage]);

        // Send to backend silently
        await api.messages.send(selectedUserId, textToSend);
    };

    return (
        <div className="flex h-[100dvh] md:h-[calc(100vh-2rem)] md:mt-4 w-full max-w-6xl mx-auto overflow-hidden bg-white/50 dark:bg-neutral-900/50 backdrop-blur-xl border border-white/20 dark:border-white/5 md:rounded-[32px] shadow-2xl relative">
            
            {/* --- LIST VIEW (Left Panel) --- */}
            <div className={`flex-col w-full md:w-80 md:border-r border-neutral-100 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl md:bg-transparent ${selectedUserId ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-5 pb-2 flex-shrink-0">
                    <div className="flex items-center justify-between mb-4 px-1">
                        <h2 className="text-xl font-bold dark:text-white">{showSettings ? 'Settings' : 'Messages'}</h2>
                        <button onClick={() => setShowSettings(!showSettings)} className={`p-2 -mr-2 rounded-full transition-colors ${showSettings ? 'bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white' : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 dark:text-neutral-400'}`}>
                            <Settings size={20} />
                        </button>
                    </div>
                    
                    {!showSettings && (
                        <div className="relative">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" size={18}/>
                            <input type="text" placeholder="Search..." className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-2xl py-2.5 pl-10 pr-4 text-sm outline-none dark:text-white focus:ring-2 focus:ring-purple-500/20 transition-all" />
                        </div>
                    )}
                </div>

                <div className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-hide pb-24 md:pb-3">
                    {showSettings ? (
                        <div className="space-y-2 animate-in fade-in slide-in-from-left-4 duration-300">
                           {/* ... Keep your settings UI exactly the same ... */}
                           <div className="p-3 rounded-2xl hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full">
                                        <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                                    </div>
                                    <span className="text-sm font-medium dark:text-white">Active Status</span>
                                </div>
                            </div>
                            <div className="p-3 rounded-2xl hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer flex items-center gap-3 text-red-500">
                                <LogOut size={18} />
                                <span className="text-sm font-medium">Log Out</span>
                            </div>
                        </div>
                    ) : (
                        // Map over real fetched users
                        users.map(user => (
                            <div key={user.id} onClick={() => setSelectedUserId(user.id)} className={`p-3 rounded-2xl flex items-center gap-3 cursor-pointer transition-all duration-300 group ${selectedUserId === user.id ? 'bg-black dark:bg-white text-white dark:text-black shadow-lg' : 'hover:bg-white/50 dark:hover:bg-neutral-800/50'}`}>
                                <Avatar src={user.avatarUrl} size="sm" />
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center mb-0.5">
                                        <h4 className="font-bold text-sm truncate">{user.name}</h4>
                                    </div>
                                    <p className="text-xs truncate opacity-70">@{user.username}</p>
                                </div>
                            </div>
                        ))
                    )}
                    {users.length === 0 && !showSettings && (
                         <p className="text-center text-xs text-neutral-500 mt-10">No users found.</p>
                    )}
                </div>
            </div>

            {/* --- CHAT VIEW (Right Panel) --- */}
            <div className={`flex-col flex-1 relative bg-white/40 dark:bg-neutral-900/40 ${!selectedUserId ? 'hidden md:flex' : 'flex fixed inset-0 z-[60] md:static'}`}>
                {selectedUser ? (
                    <>
                        <div className="absolute top-0 left-0 right-0 h-16 px-4 z-20 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                            <div className="flex items-center gap-2 overflow-hidden flex-1 mr-2">
                                <button onClick={() => setSelectedUserId(null)} className="md:hidden p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full flex-shrink-0 -ml-2">
                                    <ArrowLeft size={20} className="dark:text-white"/>
                                </button>
                                
                                <Link href={`/profile?id=${selectedUser.id}`} className="flex items-center gap-3 bg-white/50 dark:bg-black/20 py-1.5 px-3 rounded-full border border-white/20 hover:bg-white/60 dark:hover:bg-black/30 transition-colors min-w-0 max-w-full">
                                    <Avatar src={selectedUser.avatarUrl} size="sm" />
                                    <div className="min-w-0 flex-1 flex flex-col justify-center">
                                        <h3 className="font-bold text-sm dark:text-white truncate">{selectedUser.name}</h3>
                                    </div>
                                </Link>
                            </div>
                        </div>

                        <div className="flex flex-col h-full pt-16 bg-[#FAFAFA] dark:bg-neutral-950 md:bg-transparent"> 
                            <div className="flex-1 overflow-y-auto px-4 scrollbar-hide flex flex-col gap-3 pb-2" ref={chatContainerRef}>
                                <div className="pt-4"></div> 
                                
                                {activeMessages.map((msg) => {
                                    // Check if the message is from the logged-in user
                                    const isMine = msg.senderId === currentUser?.id;
                                    
                                    return (
                                        <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
                                            <div className={`max-w-[75%] p-3 px-4 text-sm rounded-2xl shadow-sm ${isMine ? 'bg-black dark:bg-white text-white dark:text-black rounded-tr-sm' : 'bg-white dark:bg-neutral-800 text-black dark:text-white rounded-tl-sm'}`}>
                                                {msg.text}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            <div className="flex-shrink-0 p-3 pb-24 md:pb-3 bg-white dark:bg-neutral-950 border-t border-neutral-100 dark:border-neutral-800 z-30">
                                <div className="flex items-end gap-2 bg-neutral-100 dark:bg-neutral-900 rounded-[26px] p-1.5 pr-2 border border-transparent focus-within:border-neutral-300 dark:focus-within:border-neutral-700 transition-colors">
                                    <button className="p-2.5 rounded-full hover:bg-white dark:hover:bg-neutral-800 text-neutral-500 transition-colors">
                                        <PlusSquare size={20} />
                                    </button>
                                    <input 
                                        value={inputText} 
                                        onChange={(e) => setInputText(e.target.value)} 
                                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} 
                                        placeholder="Message..." 
                                        className="flex-1 bg-transparent outline-none py-2.5 text-sm text-black dark:text-white max-h-32 resize-none placeholder:text-neutral-500"
                                    />
                                    <button onClick={handleSendMessage} className="p-2.5 bg-black dark:bg-white text-white dark:text-black rounded-full hover:scale-105 transition-transform shadow-sm">
                                        <Send size={18} className="ml-0.5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 opacity-60">
                        <div className="w-20 h-20 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-4">
                            <MessageCircle size={40} className="text-neutral-400" />
                        </div>
                        <h3 className="text-xl font-bold dark:text-white mb-2">Your Messages</h3>
                        <p className="text-neutral-500 max-w-xs text-sm">Select a chat from the left to start messaging.</p>
                    </div>
                )}
            </div>
        </div>
    );
}