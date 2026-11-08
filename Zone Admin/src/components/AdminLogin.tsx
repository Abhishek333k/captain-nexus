import React, { useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  signOut
} from 'firebase/auth';
import { auth } from '../firebase';

// Strictly enforced list of authorized administrative emails
const AUTHORIZED_ADMIN_EMAILS = [
  'mabhishekramesh1@gmail.com'
];

function isAuthorizedAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  const cleanEmail = email.toLowerCase().trim();
  if (AUTHORIZED_ADMIN_EMAILS.includes(cleanEmail)) return true;
  if (cleanEmail.endsWith('@silenvault.com')) return true;
  return false;
}

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Handle redirect result if signInWithRedirect was triggered
  useEffect(() => {
    let isMounted = true;
    getRedirectResult(auth)
      .then(async (credential) => {
        if (!isMounted || !credential) return;
        const userEmail = credential.user?.email;
        if (!isAuthorizedAdmin(userEmail)) {
          await signOut(auth);
          setErrorMsg(`Access Denied: ${userEmail} is not an authorized administrator.`);
          return;
        }
        onLoginSuccess();
      })
      .catch((err) => {
        if (isMounted && err?.code !== 'auth/popup-closed-by-user') {
          setErrorMsg(err.message || 'Authentication error.');
        }
      });
    return () => {
      isMounted = false;
    };
  }, [onLoginSuccess]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userEmail = userCredential.user?.email;

      // HARD GATE: Verify email authorization immediately
      if (!isAuthorizedAdmin(userEmail)) {
        await signOut(auth);
        setErrorMsg(`Access Denied: ${userEmail} is not authorized to access the operations control plane.`);
        setIsLoading(false);
        return;
      }

      onLoginSuccess();
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMsg('');
    setIsLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });

      let userCredential;
      try {
        userCredential = await signInWithPopup(auth, provider);
      } catch (popupErr: any) {
        // If popup is blocked, cancelled, or prevented by COOP, fallback to redirect seamlessly
        if (
          popupErr?.code === 'auth/popup-blocked' ||
          popupErr?.code === 'auth/popup-closed-by-user' ||
          popupErr?.code === 'auth/cancelled-popup-request' ||
          popupErr?.message?.includes('Cross-Origin-Opener-Policy')
        ) {
          await signInWithRedirect(auth, provider);
          return;
        }
        throw popupErr;
      }

      const userEmail = userCredential.user?.email;

      // HARD GATE: Verify email authorization immediately
      if (!isAuthorizedAdmin(userEmail)) {
        await signOut(auth);
        setErrorMsg(`Access Denied: ${userEmail} is not an authorized administrator. Database access blocked.`);
        setIsLoading(false);
        return;
      }

      onLoginSuccess();
    } catch (err: any) {
      setErrorMsg(err.message || 'Google sign-in failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-slate-950 flex flex-col justify-center items-center p-4 selection:bg-rose-500 selection:text-white font-sans">
      <div className="fixed inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#f43f5e_1px,transparent_1px)] [background-size:24px_24px]"></div>

      <div className="relative z-10 w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl backdrop-blur">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-11 h-11 rounded-xl bg-slate-950 border border-slate-700/80 p-2 flex items-center justify-center shadow-lg shadow-rose-500/10">
            <img src="/silenvault-logo.svg" alt="SilenVault" className="w-full h-full object-contain" />
          </div>
          <div>
            <h2 className="font-bold text-base text-white tracking-wide">SILENVAULT CONTROL PLANE</h2>
            <p className="text-xs text-slate-400 font-mono">admin.taxi.silenvault.com</p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-medium leading-relaxed">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Authorized Administrator Email</label>
            <input
              type="email"
              required
              placeholder="admin@silenvault.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 focus:border-rose-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 focus:border-rose-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs transition-colors shadow-lg shadow-rose-600/20 disabled:opacity-50"
          >
            {isLoading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800"></div>
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-bold text-slate-500">
            <span className="bg-slate-900 px-2">Authorized Accounts</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full py-2.5 bg-slate-950 border border-slate-700 hover:border-slate-500 text-slate-200 font-semibold rounded-xl text-xs transition-colors flex items-center justify-center space-x-2"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
            />
            <path
              fill="#4285F4"
              d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
            />
            <path
              fill="#FBBC05"
              d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.1-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.2s.7 5.5 1.9 7.9l3.7-2.9z"
            />
            <path
              fill="#34A853"
              d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16.5C3.7 20.2 7.5 23.5 12 23.5z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        <div className="mt-6 pt-4 border-t border-slate-800/80 text-center">
          <p className="text-[11px] text-slate-500">
            Strict Gate: Only <span className="text-slate-400 font-mono">mabhishekramesh1@gmail.com</span> or <span className="text-slate-400 font-mono">@silenvault.com</span> are permitted.
          </p>
        </div>
      </div>
    </div>
  );
};
