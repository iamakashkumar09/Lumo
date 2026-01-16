import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Sidebar from '@/components/layout/Sidebar';
import MobileNav from '@/components/layout/MobileNav';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Luma',
  description: 'Connect with friends.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#FAFAFA] dark:bg-[#050505] text-slate-900 dark:text-slate-100 antialiased overflow-x-hidden`}>
        {/* Ambient Background */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-400/10 rounded-full blur-[120px] animate-pulse dark:bg-purple-900/20" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-400/10 rounded-full blur-[120px] animate-pulse dark:bg-blue-900/20 delay-1000" />
        </div>

        {/* Layout Strategy: 
           - Flexbox row for Desktop columns.
           - Main content takes remaining space but respects left sidebar width.
        */}
        <div className="flex min-h-screen w-full">
          
          {/* Desktop Sidebar (Fixed Left) */}
          <div className="hidden md:block fixed left-0 top-0 h-screen w-[80px] xl:w-[280px] z-40 border-r border-transparent">
            <div className="h-full p-4">
               <Sidebar />
            </div>
          </div>
          
          {/* Main Content (Flexible Center) */}
          {/* Removed xl:mr-[320px] since the right sidebar is gone */}
          <main className="flex-1 min-w-0 md:ml-[80px] xl:ml-[280px] transition-all duration-300">
            {children}
          </main>

          {/* Desktop Right Sidebar REMOVED */}
        </div>

        {/* Mobile Bottom Navigation (Fixed Bottom) */}
        <div className="md:hidden z-50">
          <MobileNav />
        </div>
      </body>
    </html>
  );
}