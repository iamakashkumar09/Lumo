'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, Phone, Video, ArrowLeft, Send, MessageCircle, PlusSquare, Settings, Info, Bell, Shield, ChevronRight, Moon, LogOut } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import { MOCK_USERS, MOCK_MESSAGES } from '@/lib/constants';
import Link from 'next/link';

export default function MessagesPage() {
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [inputText, setInputText] = useState("");
    const [messages, setMessages] = useState(MOCK_MESSAGES);
    const [showSettings, setShowSettings] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    const activeMessages = selectedUserId ? (messages[selectedUserId] || []) : [];
    const selectedUser = MOCK_USERS.find(u => u.id === selectedUserId);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [activeMessages, selectedUserId]);

    const handleSendMessage = (text: string) => {
        if (!text.trim() || !selectedUserId) return;
        const newMessage = {
            id: Date.now().toString(),
            text: text,
            sender: 'me' as const,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => ({
            ...prev,
            [selectedUserId]: [...(prev[selectedUserId] || []), newMessage]
        }));
        setInputText("");
    };

    return (
        // MAIN CONTAINER
        <div className="flex h-[100dvh] md:h-[calc(100vh-2rem)] md:mt-4 w-full max-w-6xl mx-auto overflow-hidden bg-white/50 dark:bg-neutral-900/50 backdrop-blur-xl border border-white/20 dark:border-white/5 md:rounded-[32px] shadow-2xl relative">
            
            {/* --- LIST VIEW (Left Panel) --- */}
            <div className={`
                flex-col w-full md:w-80 md:border-r border-neutral-100 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl md:bg-transparent
                ${selectedUserId ? 'hidden md:flex' : 'flex'}
            `}>
                <div className="p-5 pb-2 flex-shrink-0">
                    <div className="flex items-center justify-between mb-4 px-1">
                        <h2 className="text-xl font-bold dark:text-white">{showSettings ? 'Settings' : 'Messages'}</h2>
                        <button 
                            onClick={() => setShowSettings(!showSettings)}
                            className={`p-2 -mr-2 rounded-full transition-colors ${showSettings ? 'bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white' : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 dark:text-neutral-400'}`}
                        >
                            <Settings size={20} />
                        </button>
                    </div>
                    
                    {!showSettings && (
                        <div className="relative">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" size={18}/>
                            <input 
                                type="text" 
                                placeholder="Search..." 
                                className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-2xl py-2.5 pl-10 pr-4 text-sm outline-none dark:text-white focus:ring-2 focus:ring-purple-500/20 transition-all"
                            />
                        </div>
                    )}
                </div>

                <div className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-hide pb-24 md:pb-3">
                    {showSettings ? (
                        <div className="space-y-2 animate-in fade-in slide-in-from-left-4 duration-300">
                            {/* Settings Options */}
                            <div className="p-3 rounded-2xl hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full">
                                        <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                                    </div>
                                    <span className="text-sm font-medium dark:text-white">Active Status</span>
                                </div>
                                <div className="w-10 h-5 bg-black dark:bg-white rounded-full p-1 flex justify-end">
                                    <div className="w-3 h-3 bg-white dark:bg-black rounded-full"></div>
                                </div>
                            </div>
                            
                            <div className="p-3 rounded-2xl hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full"><Bell size={18}/></div>
                                    <span className="text-sm font-medium dark:text-white">Notifications</span>
                                </div>
                                <ChevronRight size={18} className="text-neutral-400" />
                            </div>

                            <div className="p-3 rounded-2xl hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-full"><Shield size={18}/></div>
                                    <span className="text-sm font-medium dark:text-white">Privacy</span>
                                </div>
                                <ChevronRight size={18} className="text-neutral-400" />
                            </div>

                            <div className="p-3 rounded-2xl hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded-full"><Moon size={18}/></div>
                                    <span className="text-sm font-medium dark:text-white">Appearance</span>
                                </div>
                                <ChevronRight size={18} className="text-neutral-400" />
                            </div>

                            <div className="h-px bg-neutral-100 dark:bg-neutral-800 my-2"></div>

                            <div className="p-3 rounded-2xl hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer flex items-center gap-3 text-red-500">
                                <LogOut size={18} />
                                <span className="text-sm font-medium">Log Out</span>
                            </div>
                        </div>
                    ) : (
                        MOCK_USERS.map(user => (
                            <div key={user.id} onClick={() => setSelectedUserId(user.id)} className={`p-3 rounded-2xl flex items-center gap-3 cursor-pointer transition-all duration-300 group ${selectedUserId === user.id ? 'bg-black dark:bg-white text-white dark:text-black shadow-lg' : 'hover:bg-white/50 dark:hover:bg-neutral-800/50'}`}>
                                <Avatar src={user.avatar} size="sm" isOnline={user.status === 'online'} />
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center mb-0.5">
                                        <h4 className="font-bold text-sm truncate">{user.name}</h4>
                                        <span className="text-[10px] opacity-60">2m</span>
                                    </div>
                                    <p className="text-xs truncate opacity-70">Start a conversation</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* --- CHAT VIEW (Right Panel / Full Screen Mobile) --- */}
            <div className={`
                flex-col flex-1 relative bg-white/40 dark:bg-neutral-900/40
                ${!selectedUserId ? 'hidden md:flex' : 'flex fixed inset-0 z-[60] md:static'} 
            `}>
                {selectedUser ? (
                    <>
                        {/* Chat Header */}
                        <div className="absolute top-0 left-0 right-0 p-3 md:p-4 z-20 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                            <div className="flex items-center gap-2 overflow-hidden flex-1 mr-2">
                                <button onClick={() => setSelectedUserId(null)} className="md:hidden p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full flex-shrink-0 -ml-1 mr-1">
                                    <ArrowLeft size={20} className="dark:text-white"/>
                                </button>
                                
                                {/* User Info Link - Takes to Profile with query param */}
                                <Link href={`/profile?id=${selectedUser.id}`} className="flex items-center gap-3 bg-white/50 dark:bg-black/20 p-1.5 pr-4 rounded-full border border-white/20 hover:bg-white/60 dark:hover:bg-black/30 transition-colors min-w-0 max-w-full">
                                    <Avatar src={selectedUser.avatar} size="sm" isOnline={selectedUser.status === 'online'} />
                                    <div className="min-w-0 flex-1 flex flex-col justify-center">
                                        <h3 className="font-bold text-sm dark:text-white truncate pr-1">{selectedUser.name}</h3>
                                        <p className="text-[10px] text-green-500 font-bold uppercase tracking-wider truncate">Online</p>
                                    </div>
                                </Link>
                            </div>
                            <div className="flex items-center gap-1 flex-shrink-0">
                                <button className="p-2 rounded-full bg-white/50 dark:bg-black/20 hover:bg-white dark:hover:bg-neutral-800 transition-colors"><Phone size={18} /></button>
                                <button className="p-2 rounded-full bg-white/50 dark:bg-black/20 hover:bg-white dark:hover:bg-neutral-800 transition-colors"><Video size={18} /></button>
                                <button className="p-2 rounded-full bg-white/50 dark:bg-black/20 hover:bg-white dark:hover:bg-neutral-800 transition-colors md:hidden"><Info size={18} /></button>
                            </div>
                        </div>

                        {/* Messages List */}
                        <div className="flex-1 overflow-y-auto pt-20 pb-4 px-4 scrollbar-hide flex flex-col gap-3" ref={chatContainerRef}>
                            <div className="mt-auto"></div> {/* Spacer to push messages down */}
                            {activeMessages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
                                    <div className={`max-w-[75%] p-3 px-4 text-sm rounded-2xl shadow-sm ${msg.sender === 'me' ? 'bg-black dark:bg-white text-white dark:text-black rounded-tr-sm' : 'bg-white dark:bg-neutral-800 text-black dark:text-white rounded-tl-sm'}`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl border-t border-neutral-100 dark:border-neutral-800 md:bg-transparent md:border-none">
                            <div className="flex items-end gap-2 bg-white dark:bg-neutral-800 rounded-[26px] p-1.5 pr-2 shadow-xl border border-neutral-100 dark:border-neutral-700">
                                <button className="p-2.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-400 transition-colors">
                                    <PlusSquare size={20} />
                                </button>
                                <input 
                                    value={inputText} 
                                    onChange={(e) => setInputText(e.target.value)} 
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputText)} 
                                    placeholder="Message..." 
                                    className="flex-1 bg-transparent outline-none py-2.5 text-sm dark:text-white max-h-32 resize-none"
                                />
                                <button onClick={() => handleSendMessage(inputText)} className="p-2.5 bg-black dark:bg-white text-white dark:text-black rounded-full hover:scale-105 transition-transform shadow-lg">
                                    <Send size={18} className="ml-0.5" />
                                </button>
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