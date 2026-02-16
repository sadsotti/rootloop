import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Search, UserPlus, MessageSquare, Send, ArrowLeft, Users, Zap, ExternalLink, Clock, Trash2, XCircle } from 'lucide-react';

export default function Social() {
    const { user } = useContext(AuthContext);
    const [friends, setFriends] = useState([]);
    const [requests, setRequests] = useState([]); 
    const [sentRequests, setSentRequests] = useState([]); 
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    
    const [activeChat, setActiveChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [mobileView, setMobileView] = useState('list');

    const [friendsRefresh, setFriendsRefresh] = useState(0);
    const [msgRefresh, setMsgRefresh] = useState(0);

    useEffect(() => {
        const getFriends = async () => {
            if (!user) return;
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/friends`);
                setFriends(res.data.filter(f => f.status === 'accepted'));
                setRequests(res.data.filter(f => f.status === 'pending' && f.sender_id !== user.id));
                setSentRequests(res.data.filter(f => f.status === 'pending' && f.sender_id === user.id));
            } catch (err) { console.error("Network fetch error", err); }
        };
        getFriends();
    }, [user, friendsRefresh]);

    useEffect(() => {
        if (!activeChat) return;
        const getMessages = async () => {
            try {
                const targetId = activeChat.id;
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/messages/${targetId}`);
                setMessages(res.data);
            } catch (err) { console.error("Messages fetch error", err); }
        };
        getMessages();
        const interval = setInterval(getMessages, 3000);
        return () => clearInterval(interval);
    }, [activeChat, msgRefresh]);

    const renderMessageContent = (content, isMe) => {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const parts = content.split(urlRegex);

        return parts.map((part, index) => {
            if (part.match(urlRegex)) {
                return (
                    <a
                        key={index}
                        href={part}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`underline font-black break-all hover:opacity-70 transition-opacity ${
                            isMe ? 'text-main' : 'text-accent'
                        }`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {part}
                    </a>
                );
            }
            return part;
        });
    };

    const handleSelectFriend = (friend) => {
        setActiveChat(friend);
        setMobileView('chat');
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/search?q=${searchQuery}`);
            setSearchResults(res.data);
        } catch (err) { console.error("Search error", err); }
    };

    const sendRequest = async (targetId) => {
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/friends/request`, { receiver_id: targetId });
            setFriendsRefresh(prev => prev + 1);
            setSearchResults([]);
            setSearchQuery('');
            alert('Connection request transmitted!');
        } catch (err) { alert(err.response?.data?.error || 'Error'); }
    };

    const acceptRequest = async (senderId) => {
        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/api/friends/accept`, { sender_id: senderId });
            setFriendsRefresh(prev => prev + 1);
        } catch (err) { console.error("Accept error", err); }
    };

    const cancelConnection = async (targetUserId) => {
        const msg = friends.some(f => f.id === targetUserId) 
            ? "Disconnect this node from your verified network?" 
            : "Abort this connection request?";
            
        if (!window.confirm(msg)) return;
        
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/friends/${targetUserId}`);
            setFriendsRefresh(prev => prev + 1);
            if (activeChat?.id === targetUserId) setActiveChat(null);
        } catch (err) { 
            console.error("Delete error", err);
            alert("Action failed.");
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if(!newMessage.trim()) return;
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/messages`, { 
                receiver_id: activeChat.id, 
                content: newMessage 
            });
            setNewMessage('');
            setMsgRefresh(prev => prev + 1);
        } catch (err) { console.error("Send error", err); }
    };

    return (
        <div className="h-[calc(100vh-140px)] flex flex-col lg:grid lg:grid-cols-3 gap-6 relative">
            
            <div className={`${mobileView === 'chat' ? 'hidden' : 'flex'} lg:flex lg:col-span-1 flex-col gap-6 overflow-hidden h-full`}>
                <div className="glass-card bg-card/95 p-5 rounded-3xl border border-white/10 shadow-2xl">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-accent mb-4 flex items-center gap-2"><Search size={14}/> Discovery</h3>
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <input type="text" placeholder="Find developers..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-accent transition-all" />
                        <button type="submit" className="bg-accent text-main p-2.5 rounded-xl shadow-glow transition-transform active:scale-90"><Zap size={18} fill="currentColor"/></button>
                    </form>

                    {searchResults.length > 0 && (
                        <div className="mt-4 space-y-2 max-h-48 overflow-y-auto pr-1 scrollbar-hide">
                            {searchResults.map(u => (
                                <div key={u.id} className="group flex justify-between items-center bg-white/5 p-3 rounded-2xl border border-white/5 hover:border-accent/30 transition-all">
                                    <Link to={`/user/${u.id}`} className="flex items-center gap-3 overflow-hidden">
                                        <div className="w-8 h-8 rounded-lg bg-main flex items-center justify-center font-black text-[10px] text-accent border border-white/5">{u.username[0].toUpperCase()}</div>
                                        <p className="font-bold text-sm truncate text-white">{u.username}</p>
                                    </Link>
                                    <button onClick={() => sendRequest(u.id)} className="text-accent hover:text-white p-2 transition-transform hover:scale-110"><UserPlus size={18}/></button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-4 overflow-y-auto pr-1 scrollbar-hide">
                    {requests.length > 0 && (
                        <div className="glass-card bg-card/95 p-4 rounded-2xl border border-accent/20 bg-accent/5 shadow-glow">
                            <h3 className="text-accent font-black text-[10px] uppercase tracking-widest mb-3 flex items-center gap-2"><span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse"></span> Incoming</h3>
                            {requests.map(req => (
                                <div key={req.id} className="flex justify-between items-center mb-2 last:mb-0 bg-black/20 p-2 rounded-xl border border-white/5">
                                    <Link to={`/user/${req.id}`} className="text-xs font-bold text-white hover:text-accent transition-colors pl-2 truncate max-w-[100px]">{req.username}</Link>
                                    <div className="flex gap-1">
                                        <button onClick={() => acceptRequest(req.id)} className="text-[9px] bg-accent text-main px-3 py-1.5 rounded-lg font-black uppercase hover:scale-105 transition-all">Accept</button>
                                        <button onClick={() => cancelConnection(req.id)} className="p-1.5 text-textMuted hover:text-red-500"><XCircle size={16}/></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {sentRequests.length > 0 && (
                        <div className="glass-card bg-card/95 p-4 rounded-2xl border border-white/5">
                            <h3 className="text-textMuted font-black text-[10px] uppercase tracking-widest mb-3 flex items-center gap-2"><Clock size={12} /> Sent Requests</h3>
                            <div className="space-y-2">
                                {sentRequests.map(req => (
                                    <div key={req.id} className="flex justify-between items-center bg-white/5 p-2 rounded-xl border border-white/5 group transition-all hover:border-red-500/30">
                                        <Link to={`/user/${req.id}`} className="text-xs font-bold text-textMuted group-hover:text-white transition-colors pl-2 truncate max-w-[120px]">{req.username}</Link>
                                        <button onClick={() => cancelConnection(req.id)} className="p-2 text-textMuted hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="glass-card bg-card/95 p-5 rounded-3xl border border-white/10 flex-1 flex flex-col overflow-hidden shadow-2xl">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-textMuted mb-4 flex items-center gap-2"><Users size={14}/> Verified Network</h3>
                    <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-hide">
                        {friends.length === 0 ? (
                            <div className="py-10 text-center opacity-20"><p className="text-[10px] font-black uppercase tracking-widest">No Active Nodes</p></div>
                        ) : friends.map(friend => (
                            <div key={friend.id} className={`group p-3 rounded-2xl cursor-pointer transition-all flex justify-between items-center border ${activeChat?.id === friend.id ? 'bg-accent/10 border-accent/40 shadow-glow' : 'bg-white/5 border-white/5 hover:border-white/20'}`}>
                                <div onClick={() => handleSelectFriend(friend)} className="flex items-center gap-3 flex-1 overflow-hidden">
                                    <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center font-black text-xs text-accent border border-white/10 shrink-0">{friend.username[0].toUpperCase()}</div>
                                    <p className="font-bold text-sm text-white truncate">{friend.username}</p>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Link to={`/user/${friend.id}`} className="p-2 text-textMuted hover:text-accent transition-colors"><ExternalLink size={16}/></Link>
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation(); 
                                            cancelConnection(friend.id);
                                        }} 
                                        className="p-2 text-textMuted hover:text-red-500 transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100"
                                    >
                                        <Trash2 size={16}/>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className={`${mobileView === 'list' ? 'hidden' : 'flex'} lg:flex lg:col-span-2 glass-card bg-card/95 rounded-3xl border border-white/10 flex flex-col overflow-hidden h-full shadow-2xl`}>
                {activeChat ? (
                    <>
                        <div className="p-4 border-b border-white/10 bg-white/5 flex items-center gap-4">
                            <button onClick={() => setMobileView('list')} className="lg:hidden p-2 text-textMuted hover:text-accent"><ArrowLeft size={20}/></button>
                            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center font-black text-main shadow-glow">{activeChat.username[0].toUpperCase()}</div>
                            <div>
                                <h3 className="text-sm font-black text-white uppercase tracking-tighter">{activeChat.username}</h3>
                                <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse"></span><span className="text-[8px] text-textMuted uppercase font-bold tracking-widest">Secure Link Active</span></div>
                            </div>
                        </div>
                        <div className="flex-1 p-6 overflow-y-auto space-y-4 flex flex-col scrollbar-hide">
                            {messages.map(msg => (
                                <div key={msg.id} className={`max-w-[85%] sm:max-w-[70%] p-4 rounded-2xl text-sm leading-relaxed shadow-lg break-words whitespace-pre-wrap ${msg.sender_id === user.id ? 'bg-accent text-main font-bold self-end rounded-tr-none shadow-glow' : 'bg-black/40 border border-white/10 text-white self-start rounded-tl-none'}`}>
                                    {renderMessageContent(msg.content, msg.sender_id === user.id)}
                                    
                                    <p className={`text-[8px] mt-2 uppercase font-black tracking-widest ${msg.sender_id === user.id ? 'text-main/70 text-right' : 'text-textMuted'}`}>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                </div>
                            ))}
                        </div>
                        <form onSubmit={sendMessage} className="p-4 bg-black/40 border-t border-white/10 flex gap-3">
                            <input type="text" placeholder="Transmit packet..." value={newMessage} onChange={e => setNewMessage(e.target.value)} className="flex-1 bg-black/20 border border-white/10 rounded-2xl px-5 py-3.5 text-sm text-white focus:outline-none focus:border-accent transition-all" />
                            <button type="submit" className="bg-accent text-main p-4 rounded-2xl hover:scale-105 active:scale-95 shadow-glow transition-all flex items-center justify-center"><Send size={20} fill="currentColor"/></button>
                        </form>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-textMuted opacity-20"><Users size={80} className="mb-4"/><p className="text-[10px] font-black uppercase tracking-[0.5em]">Select a node to begin sync</p></div>
                )}
            </div>
        </div>
    );
}