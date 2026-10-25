import React, { useState } from 'react';
import {
  GraduationCap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  Info,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface LoginPageProps {
  onNavigate: (view: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { login, authConfig, logoutNotice, clearLogoutNotice } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    clearLogoutNotice();

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrorMessage('Please enter your registered email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setErrorMessage('Please enter a valid email address (e.g., student@vignanits.ac.in).');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your account password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await login(trimmedEmail, password);
      if (res.success) {
        setSuccessMessage(res.message || 'Login verified! Redirecting to student dashboard...');
        setTimeout(() => {
          onNavigate('dashboard');
        }, 600);
      } else {
        setErrorMessage(res.error || 'Invalid credentials. Please verify and try again.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFillDemoStudent = () => {
    setEmail('student.csm26@vignanits.ac.in');
    setPassword('Vignan@2026');
    setErrorMessage('');
  };

  return (
    <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Header Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-7 text-white text-center relative">
          <div className="inline-flex p-3 rounded-2xl bg-indigo-500/20 text-indigo-300 mb-3 border border-indigo-400/30">
            <GraduationCap className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black tracking-tight">Student Sign In</h2>
          <p className="text-xs text-indigo-200 mt-1">
            Vignan Institute of Technology & Science • CSM Department
          </p>
          <div className="mt-3 inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-[10px] text-slate-300 border border-white/10">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Secure Password Protection (scrypt)</span>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8 space-y-5">
          {logoutNotice && (
            <div
              className={`p-3.5 rounded-xl border text-xs flex items-center space-x-2.5 animate-in fade-in duration-200 ${
                logoutNotice.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}
            >
              {logoutNotice.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              )}
              <span className="font-semibold flex-1">{logoutNotice.message}</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1">{errorMessage}</div>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span className="font-semibold">{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                College or Personal Email *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="student.csm26@vignanits.ac.in"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden bg-white"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-slate-700">Password *</label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md shadow-slate-900/10 flex items-center justify-center space-x-2 transition-all mt-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Pre-fill */}
          <div className="pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={handleFillDemoStudent}
              className="w-full py-2.5 px-3 rounded-xl bg-indigo-50/80 hover:bg-indigo-100/80 border border-indigo-200/80 text-indigo-700 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Use Verified Demo Student (Arjun Vardhan - CSM)</span>
            </button>
          </div>

          {/* Switch to Register */}
          <div className="text-center pt-2">
            <p className="text-xs text-slate-500">
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => onNavigate('register')}
                className="font-bold text-indigo-600 hover:text-indigo-800 underline underline-offset-2 ml-1"
              >
                Register Student Account
              </button>
            </p>
          </div>

          {/* Configuration Note */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500 flex items-start space-x-2">
            <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <span>Backend Auth: </span>
              <strong className="text-slate-700 font-semibold">{authConfig.provider}</strong>.
              <span className="block text-[10px] text-slate-400 mt-0.5">
                Passwords are cryptographically hashed; user profiles and authentication records are
                isolated.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
