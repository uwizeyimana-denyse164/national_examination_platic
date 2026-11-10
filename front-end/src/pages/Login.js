import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login, register } = useAuth();
  const [form,    setForm]    = useState({ username: '', password: '' });
  const [error,   setError]   = useState('');
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);
  const [creatingAccount, setCreatingAccount] = useState(false);

  const validateUsername = (val) => {
    if (!val) return 'Username is required';
    if (!/^[A-Za-z0-9_]{3,100}$/.test(val)) return 'Use 3-100 letters, digits, or _';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validateUsername(form.username);
    if (err) { setErrors({ username: err }); return; }
    setErrors({}); setError(''); setLoading(true);
    try {
      if (creatingAccount) {
        await register(form.username, form.password);
      } else {
        await login(form.username, form.password);
      }
    } catch (err) {
      if (creatingAccount) {
        setError(err.response?.data?.message
          || 'Cannot reach the server. Make sure the backend is running on port 5000.');
      } else {
        setError(err.response ? 'Invalid username or password' : 'Cannot reach the server. Make sure the backend is running on port 5000.');
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleAccountMode = () => {
    setCreatingAccount(!creatingAccount);
    setError('');
    setErrors({});
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 sm:p-8 md:p-10 border border-gray-100">

        <div className="text-center mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent-500 mb-2">SwiftWheel Enterprise</p>
          <h1 className="text-2xl md:text-3xl font-extrabold text-blue-900">Promotion and  Marketing SubSystem(PMS)</h1>
          <p className="text-sm text-gray-500 mt-2">Huye, Rwanda</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-300 text-red-800 rounded-xl px-4 py-3 text-sm mb-4">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-blue-900 mb-1.5">
              Username
            </label>
            <input
              type="text"
              placeholder="3-100 letters, digits, or _"
              value={form.username}
              onChange={e => {
                const val = e.target.value;
                if (val && !/^[A-Za-z0-9_]*$/.test(val)) return;
                setForm({ ...form, username: val });
                setErrors(p => ({ ...p, username: validateUsername(val) }));
              }}
              onKeyDown={e => {
                if (!/[A-Za-z0-9_]/.test(e.key) && !['Backspace','Delete','ArrowLeft','ArrowRight','Tab'].includes(e.key))
                  e.preventDefault();
              }}
              required
              className={`w-full rounded-xl border text-gray-900 text-sm px-4 py-2.5 shadow-sm focus:outline-none focus:ring-2 transition ${
                errors.username ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:ring-accent-400 focus:border-accent-400'
              }`}
            />
            {errors.username && <p className="text-xs text-red-500 mt-1">{errors.username}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-blue-900 mb-1.5">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              minLength={creatingAccount ? 8 : undefined}
              maxLength={creatingAccount ? 72 : undefined}
              required
              className="w-full rounded-xl border border-gray-300 text-gray-900 text-sm px-4 py-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-accent-400 transition"
            />
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full py-3 rounded-xl bg-accent-500 hover:bg-accent-600 text-white font-semibold text-sm transition-all duration-200 shadow-md disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:ring-offset-2"
          >
            {loading ? (creatingAccount ? 'Creating account...' : 'Signing in...') : (creatingAccount ? 'Create Account' : 'Sign In')}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-5">
          {creatingAccount ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button type="button" onClick={toggleAccountMode} className="font-semibold text-blue-900 hover:underline">
            {creatingAccount ? 'Sign in' : 'Create account'}
          </button>
        </p>
      </div>
    </div>
  );
}
