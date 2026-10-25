import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  User,
  Sparkles,
  AlertTriangle,
  RotateCcw,
  BookOpen,
  Briefcase,
  HelpCircle,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCareer } from '../../context/CareerContext';
import { sendChatMessage } from '../../services/aiService';
import { ChatMessage } from '../../types';

export const CareerChatView: React.FC = () => {
  const { user } = useAuth();
  const { serverStatus } = useCareer();

  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Update greeting and reset messages when user changes or logs out
  useEffect(() => {
    const greeting = user?.fullName
      ? `Hello ${user.fullName}!`
      : 'Welcome to Career Twin AI!';
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: `${greeting} I am your **Career Twin AI** advisor for **Vignan Institute of Technology & Science (CSM Department)**.
      
I'm here to help you navigate:
- **Campus Placements (2026–2027)**: Preparation plans for TCS Digital, Cognizant, Microsoft, and tech startups.
- **Project Selection**: Architecture, tech stacks (FastAPI, PyTorch, React, Next.js), and GitHub portfolio tips.
- **Resume & ATS Optimization**: Bullet point phrasing and quantifiable metrics.
- **Interview Tactics**: Technical deep-dives, System Design, and STAR behavioral answers.

How can I help you today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isLiveAI: serverStatus?.aiConfigured,
      },
    ]);
  }, [user, serverStatus?.aiConfigured]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: 'user-' + Date.now(),
      role: 'user',
      content: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      const history = messages.slice(-6).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const { reply, isLiveAI } = await sendChatMessage(query, history, {
        studentName: user?.fullName,
        college: user?.college,
        department: user?.department,
        academicYear: user?.academicYear,
        targetRole: user?.targetRole,
        cgpa: user?.cgpa,
      });

      const assistantMsg: ChatMessage = {
        id: 'assistant-' + Date.now(),
        role: 'assistant',
        content: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isLiveAI,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: 'error-' + Date.now(),
          role: 'assistant',
          content: 'Unable to connect to the career guidance engine at this moment. Please try again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isLiveAI: false,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        role: 'assistant',
        content: `Chat history cleared. What career guidance or placement questions can I answer for you?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isLiveAI: serverStatus?.aiConfigured,
      },
    ]);
  };

  const samplePrompts = [
    'What projects should a 3rd year CSM student build for AI/ML roles?',
    'How should I prepare for TCS NQT Digital and Cognizant GenC coding rounds?',
    'Review key resume tips to pass ATS screenings for software engineer roles.',
    'What are the most asked interview questions for fresher Machine Learning roles?',
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] max-w-5xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-900 via-indigo-900 to-indigo-600 flex items-center justify-center text-white shadow-xs">
            <Bot className="w-5 h-5 text-indigo-300" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-sm font-bold text-slate-900">Career Twin AI Mentor</h2>
              {serverStatus?.aiConfigured ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Gemini 3.8 Flash Connected</span>
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800 border border-amber-200 flex items-center space-x-1">
                  <AlertTriangle className="w-3 h-3 text-amber-600" />
                  <span>Curated CSM Advisor Mode</span>
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500">
              Vignan Institute of Tech & Science • Dept of CSM Guidance
            </p>
          </div>
        </div>

        <button
          onClick={handleClearChat}
          className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors text-xs flex items-center space-x-1"
          title="Reset conversation"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>

      {/* Info notice if demo mode */}
      {!serverStatus?.aiConfigured && (
        <div className="bg-amber-50/90 border-b border-amber-200 px-4 py-2 text-[11px] text-amber-900 flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>
              <strong>Note:</strong> Server-side Gemini API key is currently not attached. The
              chatbot operates using pre-verified VITS CSM placement and career intelligence.
            </span>
          </div>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                  isUser
                    ? 'bg-slate-900 text-white'
                    : 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[82%] sm:max-w-[75%] rounded-2xl p-4 text-xs leading-relaxed shadow-2xs ${
                  isUser
                    ? 'bg-slate-900 text-white rounded-tr-xs'
                    : 'bg-slate-50 text-slate-800 border border-slate-200/80 rounded-tl-xs'
                }`}
              >
                <div className="whitespace-pre-wrap space-y-1">{msg.content}</div>

                <div
                  className={`mt-2 pt-1 border-t flex items-center justify-between text-[10px] ${
                    isUser ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-400'
                  }`}
                >
                  <span>{msg.timestamp}</span>
                  {!isUser && (
                    <span className="font-medium">
                      {msg.isLiveAI ? '✨ Live AI' : 'Verified Knowledge'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 animate-pulse" />
            </div>
            <div className="bg-slate-50 text-slate-500 border border-slate-200/80 rounded-2xl rounded-tl-xs p-3.5 text-xs flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" />
              <div
                className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce"
                style={{ animationDelay: '0.2s' }}
              />
              <div
                className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce"
                style={{ animationDelay: '0.4s' }}
              />
              <span className="text-[11px] font-medium text-slate-500 pl-1">
                Consulting Career Twin...
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompt Chips */}
      <div className="px-4 py-2 bg-slate-50/50 border-t border-slate-200/60 overflow-x-auto flex items-center space-x-2">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
          Suggested:
        </span>
        {samplePrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            disabled={isLoading}
            className="text-[11px] px-2.5 py-1 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 shrink-0 transition-colors truncate max-w-xs"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <div className="p-4 border-t border-slate-200 bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder="Ask about careers, tech stacks, roadmaps, placement rounds, or resume advice..."
            className="flex-1 px-4 py-2.5 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={`p-2.5 rounded-xl text-white font-semibold transition-all ${
              !input.trim() || isLoading
                ? 'bg-slate-300 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 shadow-xs'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
