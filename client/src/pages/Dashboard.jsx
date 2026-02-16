import { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, PlusCircle, Code2, Terminal, Layers, Sparkles } from 'lucide-react';

export default function Dashboard() {
    const [snippets, setSnippets] = useState([]);
    const [form, setForm] = useState({ title: '', language: 'javascript', code: '', description: '' });
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/snippets`);
                setSnippets(res.data);
            } catch (error) {
                console.error("Error fetching snippets:", error);
            }
        };
        fetchData();
    }, [refreshKey]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/snippets`, form);
            setForm({ title: '', language: 'javascript', code: '', description: '' });
            setRefreshKey(oldKey => oldKey + 1);
        } catch (error) {
            console.error("Error saving snippet:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/snippets/${id}`);
            setRefreshKey(oldKey => oldKey + 1);
        } catch (error) {
            console.error("Error deleting snippet:", error);
        }
    };

    const inputClass = "w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-accent focus:bg-black/60 transition-all placeholder:text-textMuted/30";

    return (
        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-8 pb-10">
            
            <div className="lg:col-span-1 order-2 lg:order-1">
                <div className="glass-card bg-card/95 p-6 rounded-[2rem] border border-white/10 sticky top-24 shadow-2xl">
                    <h2 className="text-xl font-black mb-6 text-accent flex items-center gap-2 uppercase tracking-tighter">
                        <PlusCircle size={22} /> Create Snippet
                    </h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-[10px] uppercase tracking-[0.2em] text-accent font-black mb-1 block ml-1">Title</label>
                            <input type="text" placeholder="e.g. Auth logic" className={inputClass} 
                                value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
                        </div>
                        
                        <div>
                            <label className="text-[10px] uppercase tracking-[0.2em] text-accent font-black mb-1 block ml-1">Language</label>
                            <select className={inputClass} value={form.language} onChange={e => setForm({...form, language: e.target.value})}>
                                <option value="javascript">JavaScript</option>
                                <option value="python">Python</option>
                                <option value="html">HTML</option>
                                <option value="css">CSS</option>
                                <option value="sql">SQL</option>
                                <option value="bash">Bash</option>
                            </select>
                        </div>
                        
                        <div>
                            <label className="text-[10px] uppercase tracking-[0.2em] text-accent font-black mb-1 block ml-1">Description</label>
                            <textarea placeholder="Brief summary..." className={`${inputClass} h-20 resize-none`}
                                value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
                        </div>
                        
                        <div>
                            <label className="text-[10px] uppercase tracking-[0.2em] text-accent font-black mb-1 block ml-1">Source Code</label>
                            <textarea placeholder="// Write code..." className={`${inputClass} font-mono text-sm h-48 bg-black`}
                                value={form.code} onChange={e => setForm({...form, code: e.target.value})} required />
                        </div>
                        
                        <button type="submit" className="w-full py-4 bg-accent text-main font-black rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-glow flex items-center justify-center gap-2 uppercase tracking-tighter">
                          Deploy to Repo
                        </button>
                    </form>
                </div>
            </div>

            <div className="lg:col-span-2 order-1 lg:order-2 space-y-6">
                <div className="flex items-center justify-between mb-2 px-2">
                    <h2 className="text-xs font-black uppercase tracking-[0.4em] text-textMuted flex items-center gap-2">
                        <Layers size={16} className="text-accent" /> Repository Index ({snippets.length})
                    </h2>
                </div>

                {snippets.length === 0 ? (
                    <div className="glass-card bg-card/95 p-16 rounded-[2.5rem] border border-dashed border-white/5 text-center">
                        <Terminal size={48} className="mx-auto mb-4 text-accent opacity-20" />
                        <p className="text-textMuted font-black uppercase tracking-widest text-[10px]">No snippets committed yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {snippets.map(snip => (
                            <div key={snip.id} className="group glass-card bg-card/95 rounded-[2rem] border border-white/5 overflow-hidden hover:border-accent/40 transition-all duration-500 shadow-xl hover:shadow-glow">
                                <div className="p-5 bg-white/5 flex justify-between items-center border-b border-white/5">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2.5 bg-black rounded-xl border border-white/10 text-accent group-hover:rotate-6 transition-transform">
                                            <Code2 size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-black text-white uppercase tracking-tight group-hover:text-accent transition-colors">{snip.title}</h3>
                                            <span className="text-[9px] font-black text-accent bg-accent/10 px-2 py-0.5 rounded border border-accent/20 uppercase tracking-widest">{snip.language}</span>
                                        </div>
                                    </div>
                                    <button onClick={() => handleDelete(snip.id)} className="text-textMuted hover:text-red-500 p-2.5 hover:bg-red-500/10 rounded-xl transition-all">
                                        <Trash2 size={20}/>
                                    </button>
                                </div>

                                <div className="p-6">
                                    {snip.description && (
                                        <p className="text-textMuted/80 text-sm mb-5 leading-relaxed font-medium italic border-l border-accent/30 pl-4">{snip.description}</p>
                                    )}
                                    <div className="relative">
                                        <div className="absolute top-3 right-4 text-[9px] font-black text-accent/30 uppercase tracking-[0.2em] select-none">Encrypted Module</div>
                                        <pre className="bg-black p-6 rounded-2xl text-[13px] overflow-x-auto border border-white/5 font-mono leading-relaxed text-yellow-50/90 scrollbar-hide">
                                            <code className="block">{snip.code}</code>
                                        </pre>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}