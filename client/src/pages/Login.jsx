import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import logoImg from '../assets/logo.png'; 
import { Mail, Lock, LogIn, ArrowRight } from 'lucide-react';

export default function Login() {
    const [formData, setForm] = useState({ email: '', password: '' });
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, formData);
            login(res.data.token, res.data.user);
            navigate('/');
        } catch (err) { 
            alert('Error: ' + (err.response?.data?.error || 'Login failed')); 
        }
    };

    const inputClass = "w-full bg-white/5 border border-white/10 text-white p-4 pl-12 rounded-2xl focus:outline-none focus:border-accent focus:bg-white/10 transition-all placeholder:text-textMuted/40";

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
            
            <div className="w-full max-w-md glass-card p-8 md:p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent/10 blur-[80px] rounded-full"></div>
                <div className="flex flex-col items-center mb-10 relative">
                    <img src={logoImg} alt="RootLoop" className="h-16 w-auto mb-6 drop-shadow-[0_0_15px_rgba(250,204,21,0.2)]" />
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter">
                        Welcome <span className="text-accent">Back</span>
                    </h2>
                    <p className="text-textMuted text-xs font-bold uppercase tracking-[0.2em] mt-2">
                        Initialize Session
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 relative">
                    <div className="relative">
                        <Mail className="absolute left-4 top-4 text-textMuted" size={20} />
                        <input 
                            type="email" 
                            placeholder="Developer Email" 
                            className={inputClass}
                            value={formData.email}
                            onChange={e => setForm({...formData, email: e.target.value})} 
                            required
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-4 top-4 text-textMuted" size={20} />
                        <input 
                            type="password" 
                            placeholder="Password" 
                            className={inputClass}
                            value={formData.password}
                            onChange={e => setForm({...formData, password: e.target.value})} 
                            required
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="group w-full bg-accent text-main font-black py-4 rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-glow flex items-center justify-center gap-2 uppercase tracking-tighter"
                    >
                        Execute Login
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>

                <div className="mt-8 text-center relative">
                    <p className="text-sm text-textMuted font-medium">
                        New developer? 
                        <Link to="/register" className="text-accent hover:underline ml-2 font-bold tracking-tight">
                            Register Node
                        </Link>
                    </p>
                </div>
            </div>

            <p className="mt-8 text-[10px] text-textMuted uppercase tracking-[0.3em] opacity-40">
                RootLoop Secure Authentication
            </p>
        </div>
    );
}