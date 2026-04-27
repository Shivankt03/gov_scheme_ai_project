import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../i18n/index.js';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || t('auth.loginFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#07090F] text-white font-sans">
      {/* Left Side: Testimonial & Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#12141D] flex-col justify-between p-10 relative overflow-hidden border-r border-white/5 shadow-[inset_-10px_0_30px_rgba(0,0,0,0.5)]">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg overflow-hidden bg-white/5 flex items-center justify-center border border-white/10">
            <img src="/ChatGPT%20Image%20Apr%2026,%202026,%2008_13_47%20PM.png" alt="JanSuvidha Logo" className="w-full h-full object-contain scale-110" />
          </div>
          <span className="font-bold text-lg tracking-wide text-white">JanSuvidha</span>
        </Link>
        
        {/* Testimonial */}
        <div className="max-w-[480px] mx-auto text-center flex flex-col items-center justify-center -mt-16">
          <p className="text-3xl leading-snug font-medium mb-10 text-gray-100/90 tracking-tight">
            "We've been using JanSuvidha to kick start every scheme application and can't imagine working without it."
          </p>
          
          <div className="flex flex-col items-center">
            {/* Avatar */}
  
            
            <p className="font-bold text-[15px] text-gray-100">Shivank Tiwari</p>
            <p className="text-sm text-gray-400 mt-0.5 mb-4 font-medium">Gram Panchayat, Phulera</p>
            
            {/* 5 Stars */}
            <div className="flex gap-1.5 text-[#fbbf24]">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
                </svg>
              ))}
            </div>
          </div>
        </div>
        
        {/* Empty div for flex spacing to keep content centered */}
        <div></div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative">
        {/* Back Button */}
        <Link to="/" className="absolute top-6 left-6 sm:top-8 sm:left-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-medium group z-10">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 group-hover:-translate-x-1 transition-transform">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back
        </Link>

        <div className="w-full max-w-[380px] mt-8 lg:mt-0">
          {/* Mobile Logo */}
          <div className="flex lg:hidden items-center gap-2 mb-8 mt-4">
            <div className="w-8 h-8 rounded-lg overflow-hidden bg-white/5 flex items-center justify-center border border-white/10">
              <img src="/ChatGPT%20Image%20Apr%2026,%202026,%2008_13_47%20PM.png" alt="JanSuvidha Logo" className="w-full h-full object-contain scale-110" />
            </div>
            <span className="font-bold text-lg tracking-wide">JanSuvidha</span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2.5 text-white tracking-tight">Welcome back</h1>
            <p className="text-gray-400 text-[15px]">Welcome back! Please enter your details.</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 flex-shrink-0">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5 tracking-wide" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="w-full bg-[#111421] border border-white/10 rounded-xl px-4 py-3 text-white text-[15px] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/50 focus:border-[#7c3aed] transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5 tracking-wide" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  className="w-full bg-[#111421] border border-white/10 rounded-xl px-4 py-3 text-white text-[15px] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/50 focus:border-[#7c3aed] transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-300 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between mt-2 pt-1 pb-2">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-600 bg-transparent text-[#7c3aed] focus:ring-[#7c3aed] focus:ring-offset-0 cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm font-medium text-gray-300 cursor-pointer">
                  Remember for 30 days
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-semibold text-gray-300 hover:text-white transition-colors">
                  Forgot password
                </a>
              </div>
            </div>

            <div className="space-y-3 pt-1">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-[0_4px_14px_0_rgba(124,58,237,0.39)] text-[15px] font-semibold text-white bg-[#7c3aed] hover:bg-[#6d28d9] hover:shadow-[0_6px_20px_rgba(124,58,237,0.23)] hover:-translate-y-px focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7c3aed] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all duration-200"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </button>

            </div>
          </form>

          <p className="mt-8 text-center text-[15px] text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-white hover:text-gray-300 transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
