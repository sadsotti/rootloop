import { useEffect, useContext } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import { AuthContext } from '../context/AuthContext';
import ChangePassword from '../components/ChangePassword';
import DangerZone from '../components/DangerZone';
import { Settings as SettingsIcon, Shield, UserX, Loader2 } from 'lucide-react'; 

export default function Settings() {
    const { user, loading } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !user) {
            navigate('/login');
        }
    }, [user, loading, navigate]);

    if (loading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <Loader2 className="animate-spin text-accent" size={48} />
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20 animate-in fade-in duration-500 px-4">
            <div className="flex items-center gap-4 mb-10">
                <div className="p-3 bg-accent/10 border border-accent/20 rounded-2xl text-accent shadow-glow">
                    <SettingsIcon size={24} />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-white uppercase tracking-tighter">
                        System <span className="text-accent">Config</span>
                    </h1>
                    <p className="text-[10px] text-textMuted uppercase font-bold tracking-[0.2em]">
                        Manage node credentials and termination protocols
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-2">
                    <button className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl bg-accent/10 border border-accent/40 text-accent font-black uppercase text-[10px] tracking-widest shadow-glow transition-all cursor-default">
                        <Shield size={16} /> Security
                    </button>

                    <button 
                        onClick={() => document.getElementById('danger-zone').scrollIntoView({ behavior: 'smooth' })}
                        className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl bg-red-500/5 border border-red-500/10 text-red-500/50 hover:text-red-500 hover:bg-red-500/10 font-black uppercase text-[10px] tracking-widest transition-all"
                    >
                        <UserX size={16} /> Danger Zone
                    </button>
                </div>

                <div className="lg:col-span-2 space-y-8">
                    <div className="glass-card bg-card/80 p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                            <Shield size={120} />
                        </div>
                        
                        <div className="relative z-10">
                            <h2 className="text-lg font-black text-white uppercase tracking-tighter mb-2">Access Security</h2>
                            <p className="text-xs text-textMuted mb-8 font-medium leading-relaxed">
                                Regularly update password to maintain your account's integrity within the RootLoop network.
                            </p>
                            
                            <ChangePassword />
                        </div>
                    </div>

                    <div id="danger-zone" className="pt-4">
                        <DangerZone />
                    </div>

                </div>
            </div>
        </div>
    );
}