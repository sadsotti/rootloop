import { Heart, Zap } from 'lucide-react';
import logoImg from '../assets/logo.png';


export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full mt-auto py-10 px-6 bg-[#09090b]/98 border-t border-white/10 relative z-50">
            <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-10 text-sm">
                <div className="flex flex-col items-center md:items-start gap-4">
                    <div className="flex items-center gap-3 group">
                        <img src={logoImg} alt="RootLoop" className="h-7 w-auto opacity-80 group-hover:opacity-100 transition-opacity" />
                        <span className="text-xl font-black text-white tracking-tighter uppercase">
                            ROOT<span className="text-accent">LOOP</span>
                        </span>
                    </div>
                    <div className="text-center md:text-left">
                        <p className="text-textMuted font-medium uppercase tracking-widest text-[10px]">
                            © {currentYear} <span className="text-white">All rights reserved</span>.
                        </p>
                    </div>
                </div>
                <div className="flex flex-col items-center md:items-end gap-3 text-center md:text-right">
                     <p className="text-textMuted leading-relaxed max-w-xs font-medium">
                        Final project developed for <span className="text-white">start2impact</span> 
                        <br className="hidden md:block" /> Full Stack Dev & AI Agents Master.
                    </p>
                    
                    <div className="flex flex-col md:flex-row items-center gap-4 mt-2">
                        <span className="flex items-center gap-1.5 px-3 py-1 bg-accent/10 border border-accent/20 rounded-full text-[10px] font-black text-accent uppercase tracking-tighter">
                            <Zap size={10} fill="currentColor" /> System Online
                        </span>
                        <p className="flex items-center gap-2 text-xs font-bold text-textMuted">
                        Made by 
  <a 
    href="https://www.lorenzosottile.it" 
    target="_blank" 
    rel="noopener noreferrer"
    className="text-accent hover:text-white transition-colors border-b border-accent/30 pb-0.5"
  >
    Lorenzo Sottile
  </a>
  <Heart size={14} className="text-red-500 fill-red-500 animate-pulse" />
</p>
                    </div>
                </div>

            </div>
        </footer>
    );
}