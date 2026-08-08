import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Code, AlertCircle } from 'lucide-react';
import { AuthService } from '../../services/authService';

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await AuthService.login(username, password);
      setLoading(false);
      if (res.success) {
        navigate('/admin/dashboard');
      } else {
        setError(res.error || 'Authentication failed');
      }
    } catch (err) {
      setLoading(false);
      setError('An error occurred during authentication.');
    }
  };

  return (
    <div className="min-h-screen bg-[#04060A] text-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Glow ambient background */}
      <div className="glow-ambient-blue top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30" />

      <div className="w-full max-w-md card-dark rounded-3xl p-8 border border-white/10 shadow-2xl relative z-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-brand-blue to-brand-cyan p-[1px] flex items-center justify-center mx-auto shadow-glow-blue">
            <div className="w-full h-full bg-[#080B12] rounded-full flex items-center justify-center">
              <Code className="w-6 h-6 text-brand-cyan" />
            </div>
          </div>
          <h1 className="text-2xl font-heading font-bold text-white">CodeRush CMS Admin</h1>
          <p className="text-xs text-text-muted">Enter administrative credentials to access the dashboard</p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-secondary">Admin Username</label>
            <div className="relative">
              <User className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter admin username"
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-text-muted focus:outline-none focus:border-brand-blue"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-secondary">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-text-muted focus:outline-none focus:border-brand-blue"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-full text-xs font-semibold bg-gradient-to-r from-brand-blue to-brand-cyan text-white shadow-glow-blue hover:shadow-glow-cyan transition-all disabled:opacity-50 mt-2"
          >
            {loading ? <span>Verifying...</span> : <span>Login to Dashboard</span>}
          </button>
        </form>
      </div>
    </div>
  );
};
