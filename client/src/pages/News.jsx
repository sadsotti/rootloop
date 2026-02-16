import { useState, useEffect } from 'react';
import axios from 'axios';
import { Newspaper, Clock, Heart, Share2, ExternalLink, Hash, Zap } from 'lucide-react';

export default function News() {
    const [news, setNews] = useState([]);
    const [tag, setTag] = useState('javascript');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchNews = async () => {
            setLoading(true);
            try {
                const publicAxios = axios.create();
                const res = await publicAxios.get(`https://dev.to/api/articles?tag=${tag}&per_page=10`);
                setNews(res.data);
            } catch (error) {
                console.error("Error fetching news", error);
            }
            setLoading(false);
        };
        fetchNews();
    }, [tag]);

    const tags = ['javascript', 'react', 'node', 'python', 'css', 'devops'];

    return (
        <div className="max-w-5xl mx-auto pb-20">
            <div className="mb-10 text-center md:text-left">
                <h1 className="text-4xl font-black text-white uppercase tracking-tighter flex items-center justify-center md:justify-start gap-3">
                    <div className="p-2 bg-accent rounded-xl">
                        <Newspaper className="text-main" size={28} />
                    </div>
                    Dev <span className="text-accent">News</span>
                </h1>
                <p className="text-textMuted text-xs font-bold uppercase tracking-[0.3em] mt-3 ml-1 opacity-60">
                    Real-time technical feed from dev.to
                </p>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-10">
                {tags.map(t => (
                    <button 
                        key={t}
                        onClick={() => setTag(t)}
                        className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all border flex items-center gap-2 ${
                            tag === t 
                            ? 'bg-accent text-main border-accent shadow-glow scale-105' 
                            : 'bg-white/5 text-textMuted border-white/5 hover:border-accent/50 hover:text-white'
                        }`}
                    >
                        <Hash size={14} className={tag === t ? 'text-main' : 'text-accent'} />
                        {t}
                    </button>
                ))}
            </div>

            <div className="space-y-6">
                {loading ? (
                    <div className="flex flex-col items-center py-20 opacity-30">
                        <Zap className="animate-bounce text-accent mb-4" size={40} />
                        <p className="text-xs font-black uppercase tracking-[0.5em]">Synchronizing Feed...</p>
                    </div>
                ) : (
                    news.map(article => (
                        <div key={article.id} className="group glass-card p-4 rounded-[2rem] border border-white/5 hover:border-accent/30 transition-all duration-500 flex flex-col md:flex-row gap-6 relative overflow-hidden">
                            
                            {article.cover_image && (
                                <div className="relative w-full md:w-48 h-32 shrink-0 overflow-hidden rounded-2xl border border-white/10">
                                    <img 
                                        src={article.cover_image} 
                                        alt="" 
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100" 
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-main/80 to-transparent"></div>
                                </div>
                            )}

                            <div className="flex flex-col justify-between flex-1 py-1">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-[10px] font-black text-accent bg-accent/10 px-2 py-0.5 rounded border border-accent/20 uppercase tracking-tighter">
                                            #{tag}
                                        </span>
                                    </div>
                                    <a 
                                        href={article.url} 
                                        target="_blank" 
                                        rel="noreferrer" 
                                        className="text-xl font-black text-white group-hover:text-accent transition-colors leading-tight block mb-2"
                                    >
                                        {article.title}
                                    </a>
                                    <p className="text-textMuted text-sm line-clamp-2 font-medium opacity-80">
                                        {article.description}
                                    </p>
                                </div>

                                <div className="flex items-center gap-5 mt-5">
                                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-textMuted uppercase tracking-wider">
                                        <Clock size={12} className="text-accent" />
                                        {new Date(article.published_at).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-textMuted uppercase tracking-wider">
                                        <Heart size={12} className="text-accent" />
                                        {article.positive_reactions_count}
                                    </div>

                                    <div className="ml-auto flex items-center gap-2">
                                        <button 
                                            onClick={() => {
                                                navigator.clipboard.writeText(article.url);
                                                alert('Source URL copied to clipboard.');
                                            }}
                                            className="p-2 bg-white/5 border border-white/10 text-textMuted hover:text-accent hover:border-accent/50 rounded-xl transition-all"
                                            title="Copy Link"
                                        >
                                            <Share2 size={16} />
                                        </button>
                                        <a 
                                            href={article.url} 
                                            target="_blank" 
                                            rel="noreferrer"
                                            className="p-2 bg-accent/10 border border-accent/20 text-accent hover:bg-accent hover:text-main rounded-xl transition-all"
                                            title="Read Original"
                                        >
                                            <ExternalLink size={16} />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}