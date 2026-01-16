export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#FAFAFA] dark:bg-[#050505] relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-400/20 rounded-full blur-[120px] animate-pulse dark:bg-purple-900/30" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-400/20 rounded-full blur-[120px] animate-pulse dark:bg-blue-900/30 delay-1000" />
      
      <div className="relative z-10 w-full max-w-md p-6">
        <div className="mb-8 text-center">
           <h1 className="text-4xl font-bold tracking-tighter bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 bg-clip-text text-transparent inline-block">
                Luma
            </h1>
        </div>
        {children}
      </div>
    </div>
  );
}