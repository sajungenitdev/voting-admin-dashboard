import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { login } from '../store/slices/authSlice'
import toast from 'react-hot-toast'
import { EyeIcon, EyeSlashIcon, EnvelopeIcon, KeyIcon, ArrowRightIcon } from '@heroicons/react/24/outline'

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isLoading } = useSelector((state) => state.auth)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [focusedField, setFocusedField] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await dispatch(login(formData))
    if (result.payload?.user) {
      toast.success('Welcome back! Redirecting...')
      navigate('/')
    } else {
      toast.error('Invalid email or password')
    }
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-black">
      {/* Animated Red Blobs Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute rounded-full -top-40 -right-40 w-96 h-96 bg-red-600/30 blur-3xl animate-pulse"></div>
        <div className="absolute delay-1000 rounded-full -bottom-40 -left-40 w-96 h-96 bg-red-500/20 blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-400/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-red-500/20 animate-float"
            style={{
              width: Math.random() * 4 + 2 + 'px',
              height: Math.random() * 4 + 2 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animationDelay: Math.random() * 5 + 's',
              animationDuration: Math.random() * 10 + 5 + 's',
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-md px-4">
        {/* Card Container */}
        <div className="overflow-hidden transition-all duration-500 transform border shadow-2xl bg-black/40 backdrop-blur-xl rounded-2xl border-red-500/30 hover:shadow-red-500/10 hover:shadow-2xl">
          {/* Header with Red Gradient */}
          <div className="relative h-32 bg-gradient-to-r from-red-600 to-red-800">
            <div className="absolute inset-0 bg-black/30"></div>
            <div className="absolute transform -translate-x-1/2 -bottom-6 left-1/2">
              <div className="flex items-center justify-center w-16 h-16 transform shadow-lg bg-gradient-to-br from-red-500 to-red-700 rounded-2xl shadow-red-500/30 rotate-12">
                <span className="text-3xl filter drop-shadow-lg">🗳️</span>
              </div>
            </div>
          </div>

          <div className="p-8 pt-10">
            {/* Welcome Text */}
            <div className="mb-8 text-center">
              <h2 className="mb-2 text-2xl font-bold text-white">Welcome Back</h2>
              <p className="text-sm text-white/50">Sign in to access your admin dashboard</p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div className="relative">
                <div className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200 ${focusedField === 'email' || formData.email ? 'text-red-400' : 'text-white/40'}`}>
                  <EnvelopeIcon className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  className={`w-full pl-10 pr-4 py-3 bg-black/50 border rounded-xl text-white placeholder-white/30 outline-none transition-all duration-200
                    ${focusedField === 'email' ? 'border-red-500 ring-2 ring-red-500/20' : 'border-red-500/30 hover:border-red-500/50'}`}
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  required
                />
              </div>

              {/* Password Field */}
              <div className="relative">
                <div className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200 ${focusedField === 'password' || formData.password ? 'text-red-400' : 'text-white/40'}`}>
                  <KeyIcon className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={`w-full pl-10 pr-12 py-3 bg-black/50 border rounded-xl text-white placeholder-white/30 outline-none transition-all duration-200
                    ${focusedField === 'password' ? 'border-red-500 ring-2 ring-red-500/20' : 'border-red-500/30 hover:border-red-500/50'}`}
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute transition-colors -translate-y-1/2 right-3 top-1/2 text-white/40 hover:text-red-400"
                >
                  {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="w-4 h-4 transition-colors border rounded border-red-500/30 bg-red-500/5 group-hover:border-red-500/50"></div>
                  <span className="text-xs text-white/50 group-hover:text-white/70">Remember me</span>
                </label>
                <button
                  type="button"
                  className="text-xs text-red-400 transition-colors hover:text-red-300"
                  onClick={() => toast.error('Password reset feature coming soon')}
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="relative w-full py-3 overflow-hidden font-semibold text-white transition-all duration-300 bg-gradient-to-r from-red-500 to-red-700 rounded-xl group hover:shadow-lg hover:shadow-red-500/25 disabled:opacity-70"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <svg className="w-5 h-5 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </span>
                <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-r from-red-600 to-red-800 group-hover:opacity-100"></div>
              </button>
            </form>

            {/* Demo Credentials */}
            <div className="pt-6 mt-8 border-t border-red-500/20">
              <p className="mb-3 text-xs text-center text-white/40">Demo Credentials</p>
              <div className="p-3 space-y-1 border rounded-lg bg-red-500/5 border-red-500/20">
                <p className="flex justify-between text-xs text-white/50">
                  <span>Email:</span>
                  <span className="font-mono text-red-400">dev3.ngenit@gmail.com</span>
                </p>
                <p className="flex justify-between text-xs text-white/50">
                  <span>Password:</span>
                  <span className="font-mono text-red-400">newpassword123</span>
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-xs text-white/20">
                © 2024 Voting Platform. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); opacity: 0; }
          50% { transform: translateY(-20px); opacity: 0.5; }
        }
        .animate-float {
          animation: float linear infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.05); }
        }
        .animate-pulse {
          animation: pulse 4s ease-in-out infinite;
        }
        .delay-1000 {
          animation-delay: 1s;
        }
        .delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  )
}

export default Login