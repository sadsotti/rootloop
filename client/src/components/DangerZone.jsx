import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserX, AlertTriangle, Trash2, Loader2 } from 'lucide-react';

export default function DangerZone() {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate(); 
    const [confirmText, setConfirmText] = useState('');
    const [loading, setLoading] = useState(false);

    const handleTerminate = async () => {
        if (confirmText !== 'TERMINATE') return;
        
        const warning = "WARNING: This action is irreversible. All data will be permanently purged. Continue?";
        if (!window.confirm(warning)) return;

        setLoading(true);
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/user/terminate`);
            
            logout(); 
            navigate('/login'); 
            
            alert('Node disconnected. Your data has been wiped from the grid.');
        } catch (err) {
            console.error("Termination protocol failed:", err);
            alert('Critical Error: Termination protocol failed.');
            setLoading(false);
        }
    };

    return (
        <div className="glass-card bg-red-500/5 border border-red-500/20 p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] relative overflow-hidden transition-all">
            <div className="absolute top-0 right-0 p-4 sm:p-8 opacity-10 pointer-events-none">
                <AlertTriangle size={60} className="text-red-500 sm:w-20 sm:h-20" />
            </div>

            <div className="relative z-10 space-y-6">
                <div>
                    <h2 className="text-lg font-black text-red-500 uppercase tracking-tighter mb-2 flex items-center gap-2">
                        <UserX size={20} /> Node Termination
                    </h2>
                    <p className="text-xs text-textMuted font-medium leading-relaxed max-w-md">
                        Once the node is terminated, all your snippets, messages, and connections will be permanently deleted. This action cannot be undone.
                    </p>
                </div>

                <div className="bg-black/40 border border-red-500/20 p-4 rounded-2xl">
                    <p className="text-[10px] font-black text-red-500/70 uppercase tracking-widest mb-3">
                        Type <span className="text-red-500 underline">TERMINATE</span> to confirm
                    </p>
                    <input 
                        type="text" 
                        value={confirmText}
                        onChange={e => setConfirmText(e.target.value)}
                        placeholder="TERMINATE"
                        className="w-full bg-black/60 border border-white/5 rounded-xl px-4 py-3 text-sm text-red-500 placeholder:text-red-900/30 focus:outline-none focus:border-red-500/50 transition-all font-mono"
                    />
                </div>

                <button 
                    onClick={handleTerminate}
                    disabled={confirmText !== 'TERMINATE' || loading}
                    className={`w-full py-4 rounded-xl font-black uppercase text-[10px] tracking-[0.2em] transition-all flex items-center justify-center gap-2
                        ${confirmText === 'TERMINATE' 
                            ? 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:scale-[1.01] active:scale-95' 
                            : 'bg-white/5 text-textMuted cursor-not-allowed opacity-50'}`}
                >
                    {loading ? (
                        <Loader2 size={18} className="animate-spin" />
                    ) : (
                        <>
                            <Trash2 size={16}/> 
                            <span>Initialize Self-Destruct</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}