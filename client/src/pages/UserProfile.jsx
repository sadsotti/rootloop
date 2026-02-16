import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Code2, Terminal, Calendar, ArrowLeft, Cpu, Zap, Layers } from 'lucide-react';

export default function UserProfile() {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id || id === 'undefined' || id === null) {
            console.error("DEBUG: ID utente non pervenuto dall'URL.");
            setLoading(false);
            return;
        }

        const fetchUserProfile = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/users/${id}`);
                setData(res.data);
            } catch (err) { 
                console.error("Errore nel recupero del profilo ID " + id, err);
                setData(null); 
            } finally {
                setLoading(false);
            }
        };
        fetchUserProfile();
    }, [id]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-20 opacity-40">
            <Zap className="animate-bounce text-accent mb-4" size={40} />
            <p className="text-xs font-black uppercase tracking-[0.5em] text-accent">Accessing Node Data...</p>
        </div>
    );

    if (!data || !data.user) return (
        <div className="text-center py-20 flex flex-col items-center gap-4">
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
                <p className="text-red-500 font-black uppercase tracking-widest">Error: Node not found in network.</p>
                <p className="text-textMuted text-xs mt-1 uppercase font-bold opacity-50">L'ID utente "{id}" non è valido o inesistente.</p>
            </div>
            <Link to="/social" className="text-accent hover:underline text-sm uppercase font-black tracking-tighter flex items-center gap-2">
                <ArrowLeft size={16} /> Return to Network
            </Link>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-20 animate-in fade-in duration-700 px-4">
            <Link to="/social" className="inline-flex items-center gap-2 text-textMuted hover:text-accent transition-colors mb-4 group font-bold uppercase text-xs tracking-widest">
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Network
            </Link>

            <div className="glass-card rounded-[2.5rem] border border-white/10 overflow-hidden relative shadow-2xl">
                <div className="h-40 bg-gradient-to-b from-accent/10 to-transparent w-full absolute top-0"></div>
                <div className="relative pt-20 px-8 pb-10 flex flex-col md:flex-row gap-8 items-start md:items-end">
                    <div className="w-32 h-32 rounded-[2rem] bg-main border-4 border-card flex items-center justify-center text-5xl font-black text-accent shadow-glow relative z-10">
                        {data.user.username ? data.user.username[0].toUpperCase() : '?'}
                    </div>
                    <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                            <h1 className="text-4xl font-black text-white tracking-tighter uppercase">{data.user.username}</h1>
                            <span className="px-2 py-0.5 bg-accent/10 border border-accent/20 rounded text-[10px] text-accent font-black uppercase tracking-tighter">Verified Node</span>
                        </div>
                        <div className="flex flex-wrap gap-5 text-[10px] text-textMuted font-black uppercase tracking-[0.15em]">
                            <span className="flex items-center gap-1.5"><Calendar size={12} className="text-accent"/> Deployed: {new Date(data.user.created_at).toLocaleDateString()}</span>
                            <span className="text-accent/40">Sequence: #{String(data.user.id).padStart(4, '0')}</span>
                        </div>
                    </div>
                </div>

                <div className="px-8 pb-10 grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10">
                    <div className="md:col-span-2 space-y-4">
                        <h3 className="text-[10px] font-black text-accent uppercase tracking-[0.3em] flex items-center gap-2"><Zap size={14} /> System Bio</h3>
                        <p className="text-textMain/80 leading-relaxed font-medium italic text-sm border-l-2 border-accent/20 pl-4">"{data.user.bio || "No bio available."}"</p>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-[10px] font-black text-accent uppercase tracking-[0.3em] flex items-center gap-2"><Cpu size={14} /> Technology Stack</h3>
                        <div className="flex flex-wrap gap-2">
                            {data.user.skills ? data.user.skills.split(',').map(s => (
                                <span key={s} className="px-3 py-1.5 bg-accent/5 border border-accent/20 rounded-xl text-[9px] font-black uppercase text-accent hover:bg-accent hover:text-main transition-all cursor-default">{s.trim()}</span>
                            )) : <span className="text-textMuted text-[10px] uppercase font-bold opacity-40 italic font-mono">None Indexed</span>}
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                    <h2 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3"><Layers size={22} className="text-accent" /> Public Repository</h2>
                    <span className="text-[10px] font-black text-textMuted uppercase tracking-widest">{data.snippets ? data.snippets.length : 0} Modules Found</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {!data.snippets || data.snippets.length === 0 ? (
                        <div className="md:col-span-2 glass-card p-20 rounded-[2.5rem] border border-dashed border-white/5 text-center opacity-40"><Terminal size={40} className="mx-auto mb-4" /><p className="text-xs font-black uppercase tracking-widest">No public snippets committed.</p></div>
                    ) : data.snippets.map(snip => (
                        <div key={snip.id} className="group glass-card p-6 rounded-3xl border border-white/5 hover:border-accent/40 transition-all duration-500 shadow-xl hover:shadow-glow">
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-main rounded-xl border border-white/5 text-accent group-hover:scale-110 transition-transform"><Code2 size={18} /></div>
                                    <div><h4 className="font-black text-white uppercase text-sm tracking-tight group-hover:text-accent transition-colors">{snip.title}</h4><span className="text-[9px] font-black text-textMuted uppercase tracking-widest">{snip.language}</span></div>
                                </div>
                            </div>
                            <div className="relative">
                                <pre className="bg-[#050505] p-5 rounded-2xl text-[13px] overflow-x-auto border border-white/5 font-mono leading-relaxed text-yellow-50/70 scrollbar-hide"><code>{snip.code}</code></pre>
                                <div className="absolute bottom-2 right-3 text-[8px] font-black text-accent/20 uppercase tracking-widest">Source Protocol</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}