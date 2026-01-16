import { X, CloudUpload, Sparkles, Loader2 } from 'lucide-react';
import { useState } from 'react';

// Use environment variable or empty string for API key
const apiKey = ""; 

export default function CreatePostModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [caption, setCaption] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handleMagicCaption = async () => {
    if (!caption) return;
    setIsGenerating(true);
    try {
        const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: `Write a creative, engaging, and aesthetic social media caption for a post about: "${caption}". Include 3 relevant hashtags. Keep it under 200 characters.` }] }] }),
        }
        );
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) setCaption(text.trim());
    } catch (e) {
        console.error("Gemini Error", e);
    }
    setIsGenerating(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-xl p-4 animate-in fade-in duration-300">
      <div className="bg-white/90 dark:bg-neutral-900/90 w-full max-w-lg rounded-[30px] overflow-hidden shadow-2xl border border-white/20 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 flex-shrink-0">
          <button onClick={onClose} className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors"><X size={20}/></button>
          <h3 className="font-bold text-base dark:text-white">New Post</h3>
          <button className="text-blue-500 font-bold text-sm px-4 py-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-full hover:bg-blue-100 transition-colors">Share</button>
        </div>
        
        <div className="overflow-y-auto p-4 md:p-6">
            {/* Upload Area - Fixed Height */}
            <div className="relative group cursor-pointer mb-6">
                <div className="h-52 md:h-64 rounded-[30px] border-2 border-dashed border-neutral-300 dark:border-neutral-700 flex flex-col items-center justify-center text-neutral-400 bg-neutral-50/50 dark:bg-neutral-800/50 transition-all duration-300 group-hover:border-purple-500/50">
                    <div className="w-16 h-16 bg-white dark:bg-neutral-800 rounded-full flex items-center justify-center shadow-xl mb-3">
                        <CloudUpload size={32} className="text-neutral-400 group-hover:text-purple-500 transition-colors" />
                    </div>
                    <p className="font-bold text-base text-neutral-600 dark:text-neutral-300 mb-1">Upload your vibes</p>
                    <p className="text-xs text-neutral-400 dark:text-neutral-500">Drag & drop or tap</p>
                </div>
            </div>

            {/* Caption Input */}
            <div className="relative pb-2">
                <textarea 
                    className="w-full h-24 bg-transparent outline-none dark:text-white resize-none text-base font-light placeholder:text-neutral-400" 
                    placeholder="Write a caption... (or type a topic and click ✨)"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                />
                 <button 
                    onClick={handleMagicCaption}
                    disabled={!caption || isGenerating}
                    className="absolute right-0 bottom-0 p-2 text-purple-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-xl transition-all disabled:opacity-50"
                >
                    {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <div className="flex items-center gap-1 text-xs font-bold bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded-lg"><Sparkles size={14} /> AI Magic</div>}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}