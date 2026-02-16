import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
    User, AtSign, Cpu, FileText, Save, 
    Zap, Settings 
} from 'lucide-react';

export default function Profile() {
    const { user } = useContext(AuthContext);

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center py-20 opacity-50">
                <Zap className="animate-bounce text-accent mb-4" size={40} />
                <p className="text-xs font-black uppercase tracking-[0.5em] text-accent">Accessing Node...</p>
            </div>
        );
    }

    return <ProfileForm key={user.id} user={user} />;
}

function ProfileForm({ user }) {
    const [bio, setBio] = useState(user.bio || '');
    const [username, setUsername] = useState(user.username || '');
    const [skills, setSkills] = useState(user.skills || '');

    const handleUpdate = async () => {
        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/api/user/update`, { bio, username, skills });
            alert('Profile configuration synced!');
        } catch (err) {
            console.error(err);
            alert('Update failed.');
        }
    };

    const inputClass = "w-full bg-black/40 border border-white/10 rounded-2xl p-3 pl-12 text-white focus:outline-none focus:border-accent focus:bg-white/5 transition-all placeholder:text-textMuted/40 text-sm";
    const labelClass = "text-[9px] uppercase tracking-[0.2em] text-accent font-black mb-2 flex items-center gap-2 ml-1";

    return (
        <div className="max-w-2xl mx-auto pb-20 animate-in fade-in duration-500 px-4">
            
            <div className="mb-10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-accent rounded-2xl shadow-glow">
                        <User className="text-main" size={28} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-white uppercase tracking-tighter">
                            Profile <span className="text-accent">Node</span>
                        </h1>
                        <p className="text-textMuted text-[10px] font-bold uppercase tracking-widest mt-1">
                            ID: {user.id.toString().padStart(4, '0')}
                        </p>
                    </div>
                </div>

                <Link 
                    to="/settings" 
                    className="p-3 bg-white/5 border border-white/10 rounded-2xl text-textMuted hover:text-accent hover:border-accent/30 transition-all group"
                    title="System Settings"
                >
                    <Settings size={20} className="group-hover:rotate-90 transition-transform duration-500" />
                </Link>
            </div>

            <div className="space-y-8">
                
                <div className="glass-card p-8 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden">
                    <div className="absolute -top-24 -left-24 w-48 h-48 bg-accent/5 blur-[80px] rounded-full"></div>
                    
                    <h3 className="text-[11px] font-black text-white uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                        <Cpu size={16} className="text-accent" /> Identity & Stack
                    </h3>

                    <div className="space-y-6 relative">
                        <div>
                            <label className={labelClass}><AtSign size={12} /> Global Alias</label>
                            <div className="relative">
                                <User className="absolute left-4 top-3 text-textMuted" size={16} />
                                <input 
                                    type="text" 
                                    value={username} 
                                    onChange={e => setUsername(e.target.value)} 
                                    className={inputClass} 
                                    placeholder="Enter handle..." 
                                />
                            </div>
                        </div>

                        <div>
                            <label className={labelClass}><Cpu size={12} /> Tech Stack</label>
                            <div className="relative">
                                <Cpu className="absolute left-4 top-3 text-textMuted" size={16} />
                                <input 
                                    type="text" 
                                    value={skills} 
                                    onChange={e => setSkills(e.target.value)} 
                                    className={inputClass} 
                                    placeholder="React, Node, SQL..." 
                                />
                            </div>
                        </div>

                        <div>
                            <label className={labelClass}><FileText size={12} /> Developer Bio</label>
                            <div className="relative">
                                <FileText className="absolute left-4 top-4 text-textMuted" size={16} />
                                <textarea 
                                    value={bio} 
                                    onChange={e => setBio(e.target.value)} 
                                    className={`${inputClass} h-32 resize-none pt-3`} 
                                    placeholder="Describe your mission..." 
                                />
                            </div>
                        </div>

                        <button 
                            onClick={handleUpdate} 
                            className="w-full py-4 bg-accent text-main font-black rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-glow flex items-center justify-center gap-3 uppercase text-xs tracking-widest"
                        >
                            <Save size={18} /> Sync Identity
                        </button>
                    </div>
                </div>

                <p className="text-[10px] text-center text-textMuted uppercase font-bold tracking-[0.2em] opacity-30">
                    RootLoop Core System • Secure Connection Active
                </p>

            </div>
        </div>
    );
}