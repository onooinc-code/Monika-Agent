import React from 'react';
import { useAuth } from '../../contexts/hooks/auth/useAuth.tsx';

interface UserMenuProps {
  onLoginClick: () => void;
}

export const UserMenu: React.FC<UserMenuProps> = ({ onLoginClick }) => {
  const { user, signOut, loading } = useAuth();

  if (loading) {
    return <div className="w-24 h-8 bg-gray-800 rounded animate-pulse"></div>;
  }

  if (!user) {
    return (
      <button 
        onClick={onLoginClick} 
        className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition"
      >
        Login
      </button>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      <span className="text-sm text-gray-300 hidden md:block">{user.email}</span>
      <button 
        onClick={signOut} 
        className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition"
      >
        Logout
      </button>
    </div>
  );
};
