import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  Building2,
  Lock,
  Mail,
  Eye,
  EyeOff,
  CheckCircle2,
  Clock,
  IndianRupee,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('admin@stjudeschool.edu.in');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      await login(email, password);
      showToast('Welcome back, Admin! Session authenticated.');
      navigate('/dashboard');
    } catch (err) {
      setErrorMessage(err.message || 'Login failed. Please verify credentials.');
      showToast(err.message || 'Login failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoFill = () => {
    setEmail('admin@stjudeschool.edu.in');
    setPassword('password123');
    showToast('Demo admin credentials populated!', 'info');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center">
      <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
          {/* Left Column: Visual & Trust Showcase */}
          <div className="lg:col-span-5 bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-950 p-8 lg:p-10 text-white flex flex-col justify-between relative overflow-hidden">
            {/* Subtle background decoration */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-indigo-400/10 blur-3xl pointer-events-none" />

            <div className="relative z-10">
              {/* Brand mark */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-inner">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-lg tracking-tight font-display text-white">
                    SchoolERP
                  </span>
                  <div className="text-[11px] text-indigo-200">
                    Institutional Cloud • AY 2026–27
                  </div>
                </div>
              </div>

              {/* Tagline */}
              <div className="mt-8">
                <h2 className="text-2xl font-bold font-display text-white leading-tight">
                  Modern, unified administration for academies.
                </h2>
                <p className="mt-3 text-xs text-indigo-200 leading-relaxed">
                  Engineered specifically for early childhood and primary schools
                  to streamline admissions, fee counter collections, and daily attendance.
                </p>
              </div>

              {/* Feature highlights */}
              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-indigo-700/50 border border-indigo-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-indigo-200" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">
                      60-Second Daily Attendance
                    </h4>
                    <p className="text-[11px] text-indigo-300">
                      Rapid roll call with 1-click batch marking and historical logs.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-indigo-700/50 border border-indigo-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <IndianRupee className="w-3.5 h-3.5 text-indigo-200" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">
                      Real-Time Arrears & Receipts
                    </h4>
                    <p className="text-[11px] text-indigo-300">
                      Counter fee logging, auto-sequential receipts, and zero-overpayment guard.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-indigo-700/50 border border-indigo-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-200" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">
                      Verified Guardian Directory
                    </h4>
                    <p className="text-[11px] text-indigo-300">
                      Linked parent-student contacts, medical notes, and class rosters.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Campus Badge */}
            <div className="relative z-10 pt-6 mt-6 border-t border-indigo-700/60 flex items-center justify-between text-[11px] text-indigo-300">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Live Demo Instance
              </span>
              <span>v1.0.4 Production</span>
            </div>
          </div>

          {/* Right Column: Clean Form */}
          <div className="lg:col-span-7 p-8 lg:p-12 flex flex-col justify-between">
            <div className="max-w-md w-full mx-auto">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900 font-display">
                  Welcome to SchoolERP
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Enter your administrative credentials to access St. Jude Academy portal.
                </p>
              </div>

              {errorMessage && (
                <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-medium">
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Admin Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@stjudeschool.edu.in"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                    />
                    <span className="text-xs text-slate-600 select-none">
                      Remember this browser
                    </span>
                  </label>
                  <span className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer">
                    Default: password123
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-indigo-100 flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Sign In to Administration</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Demo One-Click Access Button */}
              <div className="mt-5 p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-800">
                      Need quick demo credentials?
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Auto-fill preconfigured school administrator account.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleDemoFill}
                    className="px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-white border border-indigo-200 rounded-lg hover:bg-indigo-50 shadow-2xs transition-colors shrink-0"
                  >
                    Auto-Fill
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100 text-center text-xs text-slate-400">
              St. Jude Early Learners Academy • Managed by SchoolERP
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
