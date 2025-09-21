import React, { useState } from 'react';
import { useAuth } from '../../contexts/hooks/auth/useAuth.tsx';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { signUp, signInWithPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (isSigningUp) {
      const { error } = await signUp({ email, password });
      if (error) {
        setError(error.message);
      } else {
        onClose(); // Close on successful sign up
      }
    } else {
      const { error } = await signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
      } else {
        onClose(); // Close on successful sign in
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center">
      <div className="bg-[#1a1a2e] p-8 rounded-lg shadow-xl text-white w-full max-w-md m-4">
        <h2 className="text-2xl font-bold mb-4 text-center">{isSigningUp ? 'Create Account' : 'Sign In'}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mb-4 bg-[#0f0f1a] rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mb-4 bg-[#0f0f1a] rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded transition duration-300">
            {isSigningUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>
        <button onClick={() => setIsSigningUp(!isSigningUp)} className="w-full mt-4 text-sm text-gray-400 hover:text-white transition">
          {isSigningUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
        </button>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white">
          &times;
        </button>
      </div>
    </div>
  );
};
