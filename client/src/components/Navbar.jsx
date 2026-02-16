import { Link } from 'react-router-dom';
import { useContext, useState, useEffect, useRef, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import logoImg from '../assets/logo.png';
import { Code2, Newspaper, LogOut, Users, Bell, Menu, X, Zap, ArrowLeft, ChevronRight } from 'lucide-react';

const NavLinks = ({ mobile = false, closeMenu }) => (
    <>
        <Link to="/" onClick={closeMenu} className={`flex items-center justify-between transition-all font-black uppercase tracking-tighter ${mobile ? "py-6 text-3xl border-b border-white/10 text-white" : "text-textMuted text-[11px] hover:text-accent"}`}>
            <span className="flex items-center gap-4"><Zap size={mobile ? 28 : 14} className="text-accent"/> Snippets</span>
            {mobile && <ChevronRight size={24} className="text-accent" />}
        </Link>
        <Link to="/news" onClick={closeMenu} className={`flex items-center justify-between transition-all font-black uppercase tracking-tighter ${mobile ? "py-6 text-3xl border-b border-white/10 text-white" : "text-textMuted text-[11px] hover:text-accent"}`}>
            <span className="flex items-center gap-4"><Newspaper size={mobile ? 24 : 14} className="text-accent"/> News</span>
            {mobile && <ChevronRight size={24} className="text-accent" />}
        </Link>
        <Link to="/social" onClick={closeMenu} className={`flex items-center justify-between transition-all font-black uppercase tracking-tighter ${mobile ? "py-6 text-3xl border-b border-white/10 text-white" : "text-textMuted text-[11px] hover:text-accent"}`}>
            <span className="flex items-center gap-4"><Users size={mobile ? 28 : 14} className="text-accent"/> Network</span>
            {mobile && <ChevronRight size={24} className="text-accent" />}
        </Link>
    </>
);

export default function Navbar() {
    const { user, logout } = useContext(AuthContext);
    const [notifications, setNotifications] = useState([]);
    const [showNotifs, setShowNotifs] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const desktopNotifRef = useRef(null);
    
    const fetchData = useCallback(async () => {
        if (!user) return;
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/notifications`);
            setNotifications(res.data);
        } catch (err) { 
            console.error("Fetch error:", err); 
        }
    }, [user]);

    useEffect(() => {
        document.body.style.overflow = (isMenuOpen || (showNotifs && window.innerWidth < 768)) ? 'hidden' : 'unset';
    }, [isMenuOpen, showNotifs]);

    useEffect(() => {
        let isMounted = true;

        const initializeData = async () => {
            if (isMounted) {
                await fetchData();
            }
        };

        initializeData(); 

        const interval = setInterval(() => {
            if (isMounted) fetchData();
        }, 10000);

        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, [fetchData]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (desktopNotifRef.current && !desktopNotifRef.current.contains(event.target)) {
                setShowNotifs(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (!user) return null;
    const unreadCount = notifications.filter(n => !n.is_read).length;

    const markAsRead = async (id) => {
        setNotifications(prev => 
            prev.map(n => n.id === id ? { ...n, is_read: 1 } : n)
        );

        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/notifications/${id}/read`);
        } catch (err) { 
            console.error("Read update failed:", err);
            fetchData(); 
        }
    };

    return (
        <nav className="sticky top-0 z-[100] bg-[#09090b] border-b border-white/10 shadow-2xl">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                
                <Link to="/" className="flex items-center gap-3">
                    <img src={logoImg} alt="RootLoop" className="h-8 w-auto" />
                    <span className="text-xl font-black text-white tracking-tighter uppercase hidden xs:block">
                        ROOT<span className="text-accent">LOOP</span>
                    </span>
                </Link>

                <div className="flex md:hidden items-center gap-3">
                    <button onClick={() => { setIsMenuOpen(false); setShowNotifs(!showNotifs); }} className="relative p-2 text-accent">
                        <Bell size={26} className={unreadCount > 0 ? "fill-accent/20" : ""} />
                        {unreadCount > 0 && <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-accent rounded-full shadow-glow animate-pulse"></span>}
                    </button>
                    <button onClick={() => { setShowNotifs(false); setIsMenuOpen(!isMenuOpen); }} className="p-2 text-accent bg-accent/10 rounded-xl border border-accent/20">
                        {isMenuOpen ? <X size={28}/> : <Menu size={28}/>}
                    </button>
                </div>

                <div className="hidden md:flex items-center gap-6">
                    <NavLinks closeMenu={() => setIsMenuOpen(false)} />
                    <div className="h-6 w-px bg-white/10 mx-2"></div>
                    
                    <div className="relative" ref={desktopNotifRef}>
                        <button onClick={() => setShowNotifs(!showNotifs)} className="relative p-2 text-textMuted hover:text-accent transition-colors">
                            <Bell size={22} className={unreadCount > 0 ? "text-accent" : ""} />
                            {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full shadow-glow"></span>}
                        </button>

                        {showNotifs && (
                            <div className="absolute right-0 mt-4 w-80 bg-[#0c0c0e] border border-white/10 rounded-3xl shadow-2xl overflow-hidden z-[110] animate-in fade-in zoom-in-95 duration-200">
                                <div className="p-4 border-b border-white/5 bg-white/5">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white">System Logs ({unreadCount})</span>
                                </div>
                                <div className="max-h-80 overflow-y-auto scrollbar-hide">
                                    {notifications.length === 0 ? (
                                        <p className="p-10 text-center text-textMuted text-[10px] uppercase font-bold tracking-widest">No active logs</p>
                                    ) : (
                                        notifications.map(n => (
                                            <div 
                                                key={n.id} 
                                                onClick={() => !n.is_read && markAsRead(n.id)} 
                                                className={`p-4 border-b border-white/5 hover:bg-white/5 transition cursor-pointer flex gap-3 ${n.is_read ? 'opacity-30' : 'bg-accent/5'}`}
                                            >
                                                <div className="flex-1">
                                                    <p className="text-xs text-white leading-relaxed">{n.message}</p>
                                                    <p className="text-[9px] text-accent mt-1 font-black uppercase">{new Date(n.created_at).toLocaleTimeString()}</p>
                                                </div>
                                                {!n.is_read && <div className="w-1.5 h-1.5 bg-accent rounded-full self-center shadow-glow"></div>}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <Link to="/profile" className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-main font-black shadow-glow uppercase">
                        {user.username[0]}
                    </Link>
                    <button onClick={logout} className="p-2 text-textMuted hover:text-red-500 transition-colors">
                        <LogOut size={20}/>
                    </button>
                </div>
            </div>

            {isMenuOpen && (
                <div className="md:hidden fixed inset-0 top-[68px] bg-[#09090b] z-[200] flex flex-col p-8 animate-in slide-in-from-right duration-300">
                    <div className="flex flex-col flex-1"><NavLinks mobile closeMenu={() => setIsMenuOpen(false)} /></div>
                    <div className="mt-auto pb-20 space-y-6">
                        <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between bg-white/5 p-6 rounded-[2rem] border border-white/10">
                            <div className="flex items-center gap-5">
                                <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center text-main font-black text-3xl shadow-glow uppercase">{user.username[0]}</div>
                                <div><p className="text-white text-xl font-black uppercase">{user.username}</p><p className="text-xs text-accent font-bold uppercase tracking-widest">Global ID: {user.id}</p></div>
                            </div>
                            <ArrowLeft className="rotate-180 text-accent" size={28} />
                        </Link>
                        <button onClick={logout} className="w-full py-6 bg-red-500 text-white rounded-3xl font-black uppercase text-sm flex items-center justify-center gap-3"><LogOut size={20}/> Terminate Session</button>
                    </div>
                </div>
            )}

            {showNotifs && (
                <div className="md:hidden fixed inset-0 top-[68px] bg-[#09090b] z-[200] flex flex-col animate-in fade-in duration-300">
                    <div className="p-6 bg-white/5 border-b border-white/10 flex justify-between items-center">
                        <span className="text-xs font-black uppercase tracking-[0.2em] text-accent flex items-center gap-2">
                            <Bell size={18}/> Active Logs ({unreadCount})
                        </span>
                        <button onClick={() => setShowNotifs(false)} className="text-accent"><X size={24}/></button>
                    </div>
                    <div className="flex-1 overflow-y-auto pb-20">
                        {notifications.length === 0 ? (
                            <p className="p-20 text-center text-textMuted text-xs uppercase font-black tracking-widest opacity-20">All systems clear</p>
                        ) : (
                            notifications.map(n => (
                                <div 
                                    key={n.id} 
                                    role="button"
                                    onClick={() => !n.is_read && markAsRead(n.id)} 
                                    className={`p-6 border-b border-white/5 flex justify-between items-start transition-all cursor-pointer active:bg-white/10 ${n.is_read ? 'opacity-20' : 'bg-accent/5'}`}
                                >
                                    <div className="flex-1 pr-4">
                                        <p className="text-white text-sm font-medium leading-relaxed">{n.message}</p>
                                        <p className="text-[10px] text-accent mt-2 font-black uppercase opacity-60">{new Date(n.created_at).toLocaleTimeString()}</p>
                                    </div>
                                    {!n.is_read && <div className="w-2.5 h-2.5 bg-accent rounded-full mt-1.5 shadow-glow shrink-0"></div>}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}