import { createContext, useContext, useState } from 'react';

const ProfileContext = createContext();

const STORAGE_KEY = 'mobix_profile';

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    } catch { return null; }
  });

  const save = (data) => {
    const updated = { ...profile, ...data };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setProfile(updated);
  };

  const clear = () => {
    localStorage.removeItem(STORAGE_KEY);
    setProfile(null);
  };

  const isLoggedIn = !!(profile?.firstName && profile?.email);

  return (
    <ProfileContext.Provider value={{ profile, save, clear, isLoggedIn }}>
      {children}
    </ProfileContext.Provider>
  );
}

export const useProfile = () => useContext(ProfileContext);
