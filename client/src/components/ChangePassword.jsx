import { useState } from 'react';
import axios from 'axios';
import { Lock, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';

export default function ChangePassword() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', msg: '' });

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setStatus({ type: '', msg: '' });

        if (newPassword !== confirmPassword) {
            return setStatus({ type: 'error', msg: 'New passwords do not match' });
        }
        if (newPassword.length < 6) {
            return setStatus({ type: 'error', msg: 'Minimum 6 characters required for encryption' });
        }

        setLoading(true);
        try {
            const res = await axios.put(`${import.meta.env.VITE_API_URL}/api/user/change-password`, {
                currentPassword,
                newPassword
            });
            setStatus({ type: 'success', msg: res.data.message });
            setCurrentPassword(''); 
            setNewPassword(''); 
            setConfirmPassword('');
        } catch (err) {
            setStatus({ 
                type: 'error', 
                msg: err.response?.data?.error || 'Critical system error during override' 
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
                <label className="text-[9px] uppercase font-black text-textMuted ml-2 mb-1 block tracking-widest">
                    Current Access Password
                </label>
                <input 
                    type="password" 
                    required 
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-accent transition-all placeholder:text-white/10"
                    placeholder="••••••••"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="text-[9px] uppercase font-black text-textMuted ml-2 mb-1 block tracking-widest">
                        New Security Password
                    </label>
                    <input 
                        type="password" 
                        required 
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-accent transition-all placeholder:text-white/10"
                        placeholder="••••••••"
                    />
                </div>
                <div>
                    <label className="text-[9px] uppercase font-black text-textMuted ml-2 mb-1 block tracking-widest">
                        Confirm New Password
                    </label>
                    <input 
                        type="password" 
                        required 
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-accent transition-all placeholder:text-white/10"
                        placeholder="••••••••"
                    />
                </div>
            </div>

            {status.msg && (
                <div className={`p-3 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-tighter animate-in slide-in-from-top-1 duration-300 ${
                    status.type === 'success' 
                        ? 'bg-accent/10 text-accent border border-accent/20' 
                        : 'bg-red-500/10 text-red-500 border border-red-500/20'
                }`}>
                    {status.type === 'success' ? <ShieldCheck size={14}/> : <AlertCircle size={14}/>}
                    {status.msg}
                </div>
            )}

            <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-accent text-main font-black py-4 rounded-xl shadow-glow hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2 uppercase text-[10px] tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? (
                    <Loader2 size={18} className="animate-spin" />
                ) : (
                    <>
                        <Lock size={16}/> 
                        <span>Override Access Credentials</span>
                    </>
                )}
            </button>
        </form>
    );
}