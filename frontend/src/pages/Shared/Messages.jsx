import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import api from '../../api/axios';
import { ArrowLeft, Search, Send, Loader2 } from 'lucide-react';

const Messages = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user_data')) || { name: 'User', role: 'student', id: '', _id: '' };
  const currentUserId = user._id || user.id;

  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoadingContacts, setIsLoadingContacts] = useState(true);
  const [isSending, setIsSending] = useState(false);
  
  const messagesEndRef = useRef(null);

  // Fetch Contacts on mount
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await api.get('/messages/contacts');
        setContacts(res.data);
        if (res.data.length > 0) setSelectedContact(res.data[0]); // Select first contact by default
      } catch (error) {
        console.error("Error fetching contacts:", error);
      } finally {
        setIsLoadingContacts(false);
      }
    };
    fetchContacts();
  }, []);

  // Fetch messages and poll for new ones
  useEffect(() => {
    if (!selectedContact) return;

    const fetchMessages = async () => {
      try {
        const res = await api.get(`/messages/${selectedContact._id}`);
        setMessages(res.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages(); // Initial fetch
    const interval = setInterval(fetchMessages, 3000); // Poll every 3 seconds

    return () => clearInterval(interval);
  }, [selectedContact]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedContact) return;

    setIsSending(true);
    try {
      const res = await api.post('/messages', {
        receiver: selectedContact._id,
        text: newMessage
      });
      setMessages([...messages, res.data]); // Optimistically update UI
      setNewMessage('');
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=2029&auto=format&fit=crop')] bg-cover bg-center bg-fixed flex">
      <Sidebar role={user.role} user={user} />
      <div className="flex-1 p-6 overflow-y-auto h-screen flex flex-col">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate(`/${user.role}/dashboard`)} className="bg-white/80 p-2 rounded-full hover:bg-white transition shadow-sm"><ArrowLeft className="w-5 h-5 text-slate-700" /></button>
          <h1 className="text-2xl font-bold text-slate-800">Discussion & Messages</h1>
        </div>

        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-100 flex overflow-hidden max-w-5xl mx-auto w-full h-[75vh]">
          {/* Contact List */}
          <div className="w-1/3 border-r border-slate-100 flex flex-col">
            <div className="p-4 border-b border-slate-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="Search peers..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-cyan-400" 
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {isLoadingContacts ? (
                <div className="flex justify-center items-center h-20 text-cyan-500"><Loader2 className="w-6 h-6 animate-spin"/></div>
              ) : filteredContacts.length === 0 ? (
                <p className="text-center text-xs text-slate-500 mt-10">No contacts found.</p>
              ) : (
                filteredContacts.map((contact) => (
                  <div 
                    key={contact._id} 
                    onClick={() => setSelectedContact(contact)}
                    className={`p-4 border-b border-slate-50 cursor-pointer hover:bg-slate-50 transition ${
                      selectedContact?._id === contact._id ? 'bg-cyan-50/50 border-l-4 border-l-cyan-500' : ''
                    }`}
                  >
                    <p className="font-semibold text-slate-800 text-sm flex items-center justify-between">
                      {contact.name}
                      <span className="text-[10px] font-normal text-slate-400 capitalize bg-slate-100 px-1.5 py-0.5 rounded">{contact.role}</span>
                    </p>
                    {/* Removed mock text, replaced with static "Click to chat" */}
                    <p className="text-xs text-slate-500 truncate mt-1">Click to open conversation</p>
                  </div>
                ))
              )}
            </div>
          </div>
          
          {/* Chat Area */}
          <div className="flex-1 flex flex-col bg-slate-50/30">
            {selectedContact ? (
              <>
                <div className="p-4 border-b border-slate-100 bg-white flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-slate-800">{selectedContact.name}</h3>
                    <p className="text-xs text-green-500 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Online</p>
                  </div>
                </div>
                
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                  {messages.length === 0 ? (
                    <p className="text-center text-sm text-slate-400 mt-10">No messages yet. Say hi!</p>
                  ) : (
                    messages.map((msg) => {
                      const isMe = msg.sender === currentUserId;
                      return (
                        <div key={msg._id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${isMe ? 'bg-cyan-500 text-white' : 'bg-slate-300 text-slate-700'}`}>
                            {isMe ? 'Me' : selectedContact.name.charAt(0)}
                          </div>
                          <div className={`p-3 rounded-2xl border text-sm shadow-sm max-w-[70%] ${
                            isMe 
                              ? 'bg-cyan-500 text-white rounded-tr-none border-cyan-500' 
                              : 'bg-white text-slate-700 rounded-tl-none border-slate-100'
                          }`}>
                            {msg.text}
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>
                
                <div className="p-4 bg-white border-t border-slate-100">
                  <form onSubmit={handleSendMessage} className="relative">
                    <input 
                      type="text" 
                      placeholder="Type a message..." 
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="w-full pl-4 pr-12 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-cyan-400 text-sm bg-slate-50" 
                    />
                    <button 
                      type="submit" 
                      disabled={isSending || !newMessage.trim()}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-cyan-500 text-white p-1.5 rounded-lg hover:bg-cyan-600 transition disabled:opacity-50"
                    >
                      {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                <p>Select a conversation to start chatting</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Messages;