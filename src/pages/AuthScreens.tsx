import { useAuth } from '@/context/AuthContext';
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // ✅ add these

export default function AuthScreens() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const { login, register } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from || '/'; // default to home

  const toggleMode = () => {
    setApiError('');
    setErrors({});
    setMode((m) => (m === 'login' ? 'register' : 'login'));
  };

  function validate(form: HTMLFormElement) {
    const data = Object.fromEntries(new FormData(form).entries());
    const errs: Record<string, string> = {};
    const req = (key: string, label: string) => {
      if (!String(data[key] || '').trim()) errs[key] = `${label} is required`;
    };

    if (mode === 'register') {
      req('fullName', 'Full name');
      req('email', 'Email');
      req('password', 'Password');
      req('confirmPassword', 'Confirm password');
      const email = String(data.email || '');
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Enter a valid email';
      const pass = String(data.password || '');
      if (pass && pass.length < 8) errs.password = 'Password must be at least 8 characters';
      if (String(data.confirmPassword || '') !== pass) errs.confirmPassword = 'Passwords do not match';
      if (String(data.terms) !== 'on') errs.terms = 'You must accept the Terms';
    } else {
      req('email', 'Email');
      req('password', 'Password');
    }

    setErrors(errs);
    return { ok: Object.keys(errs).length === 0, data };
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setApiError('');
    const form = e.currentTarget;
    const { ok, data } = validate(form);
    if (!ok) return;

    setSubmitting(true);
    try {
      if (mode === 'login') {
        await login(String(data.email), String(data.password));
        navigate(from, { replace: true }); // ✅ go back to previous page
      } else {
        await register(String(data.fullName), String(data.email), String(data.password));
        navigate(from, { replace: true }); // ✅ same for register
      }
    } catch (err: any) {
      const msg =
        err?.message ||
        err?.data?.message ||
        err?.data?.error ||
        'Something went wrong. Please try again.';
      setApiError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    // <div className="min-h-screen grid lg:grid-cols-2 bg-white text-[hsl(var(--ff-dark,220_15%_15%))]">
    <div className="min-h-screen grid lg:grid-cols-[3fr_2fr] bg-white text-[hsl(var(--ff-dark,220_15%_15%))]">

      {/* Left panel */}
      <div className="relative hidden lg:block overflow-hidden">
        {/* <img
          src="/lovable-uploads/testimonailBg.png"
          alt="Background"
          // className="absolute inset-0 h-full w-full object-cover"
            className="absolute inset-0 w-full h-full object-cover"

        /> */}
      
          <img
            src="/lovable-uploads/testimonailBg.png"
            alt="Background"
            className="absolute inset-0 w-full h-full object-contain"
          />
      
        <div className="absolute inset-0 bg-[hsl(var(--ff-navy,220_65%_18%))]/70" />
        <div className="relative z-10 h-full w-full flex flex-col justify-between p-10">
          <div className="flex items-center gap-3">
            <img src="/lovable-uploads/logo.png" alt="Logo" className="h-20 w-20 rounded-lg shadow" />
          </div>
          <div className="text-white/90 max-w-xl">
            <h2 className="text-4xl font-bold leading-tight">Welcome back!</h2>
            <p className="mt-4 text-white/80 text-lg">
              Sign in or create an account to continue. Your progress syncs securely across devices.
            </p>
          </div>
          <div className="text-white/70 text-sm">© {new Date().getFullYear()} futurefoodz. All rights reserved.</div>
        </div>
      </div>

      {/* Right panel / Forms */}
      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8 text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl font-bold">
              {mode === 'login' ? 'Sign in' : 'Create account'}
            </h1>
            <p className="mt-2 text-gray-500">
              {mode === 'login' ? <>Welcome back! Please enter your details.</> : <>Join us in a minute. No credit card required.</>}
            </p>
          </div>

          {apiError && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-red-700 text-sm">
              {apiError}
            </div>
          )}

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-sm font-medium">Full name</label>
                <input
                  name="fullName"
                  className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 outline-none focus:ring-4 focus:ring-[#ef4354]/20 focus:border-[#ef4354]"
                  placeholder="Jane Doe"
                />
                {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                name="email"
                className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 outline-none focus:ring-4 focus:ring-[#ef4354]/20 focus:border-[#ef4354]"
                placeholder="you@example.com"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 pr-12 outline-none focus:ring-4 focus:ring-[#ef4354]/20 focus:border-[#ef4354]"
                  placeholder={mode === 'login' ? 'Your password' : 'At least 8 characters'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    // eye-off
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                      strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a21.77 21.77 0 0 1 5.06-6.94" />
                      <path d="M1 1l22 22" />
                      <path d="M9.88 9.88A3 3 0 0 0 12 15a3 3 0 0 0 2.12-.88" />
                      <path d="M4.22 4.22A21.77 21.77 0 0 1 12 4c7 0 11 8 11 8a21.94 21.94 0 0 1-3.06 4.94" />
                    </svg>
                  ) : (
                    // eye
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                      strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-sm font-medium">Confirm password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 outline-none focus:ring-4 focus:ring-[#ef4354]/20 focus:border-[#ef4354]"
                  placeholder="Re-enter password"
                />
                {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
              </div>
            )}

            {mode === 'login' ? (
              <div className="flex items-center justify-between">
                <label className="inline-flex items-center gap-2 text-sm">
                  <input type="checkbox" name="remember" className="h-4 w-4 rounded border-gray-300" />
                  Remember me
                </label>
                {/* <a href="#" className="text-sm text-[hsl(var(--ff-navy,220_65%_18%))] hover:underline">
                  Forgot password?
                </a> */}
              </div>
            ) : (
              <label className="mt-2 inline-flex items-center gap-2 text-sm">
                <input type="checkbox" name="terms" className="h-4 w-4 rounded border-gray-300" />
                I agree to the{' '}
                <a className="text-[hsl(var(--ff-navy,220_65%_18%))] underline" href="#">
                  Terms
                </a>{' '}
                and{' '}
                <a className="text-[hsl(var(--ff-navy,220_65%_18%))] underline" href="#">
                  Privacy
                </a>
              </label>
            )}
            {errors.terms && <p className="mt-1 text-sm text-red-600">{errors.terms}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-[#ef4354] text-white font-medium py-2.5 hover:brightness-95 active:scale-[.99] transition disabled:opacity-70"
            >
              {submitting ? (mode === 'login' ? 'Signing in...' : 'Creating account...') : (mode === 'login' ? 'Sign in' : 'Create account')}
            </button>
          </form>

          {/* Switch mode */}
          <p className="mt-6 text-center text-sm text-gray-600">
            {mode === 'login' ? (
              <>
                Don’t have an account?{' '}
                <button onClick={toggleMode} className="font-medium text-[hsl(var(--ff-navy,220_65%_18%))] hover:underline">
                  Create one
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button onClick={toggleMode} className="font-medium text-[hsl(var(--ff-navy,220_65%_18%))] hover:underline">
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
