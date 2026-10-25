import React, { createContext, useContext, useState, useEffect } from 'react';
import { StudentUser } from '../types';
import { DEFAULT_STUDENT } from '../data/mockData';

interface AuthContextType {
  user: StudentUser | null;
  isAuthenticated: boolean;
  login: (email: string, rollNumber?: string) => boolean;
  signup: (userData: Partial<StudentUser>) => void;
  logout: () => void;
  updateProfile: (updatedData: Partial<StudentUser>) => void;
  resetDemoUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'career_twin_student_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<StudentUser | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to parse stored user from localStorage', e);
    }
    return DEFAULT_STUDENT;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const login = (email: string, rollNumber?: string): boolean => {
    // If logging into demo student or existing stored account
    if (user && (user.email.toLowerCase() === email.toLowerCase() || user.rollNumber === rollNumber)) {
      return true;
    }
    // Simple registration/login for testing
    const newUser: StudentUser = {
      ...DEFAULT_STUDENT,
      id: 'student-' + Date.now(),
      email: email,
      fullName: email.split('@')[0].replace('.', ' ').toUpperCase(),
      rollNumber: rollNumber || '23891A66' + Math.floor(10 + Math.random() * 89),
    };
    setUser(newUser);
    return true;
  };

  const signup = (userData: Partial<StudentUser>) => {
    const newUser: StudentUser = {
      ...DEFAULT_STUDENT,
      id: 'student-' + Date.now(),
      fullName: userData.fullName || 'Student Name',
      email: userData.email || 'student@vignanits.ac.in',
      rollNumber: userData.rollNumber || '23891A6699',
      college: userData.college || 'Vignan Institute of Technology and Science, Deshmukhi',
      department: userData.department || 'CSM',
      academicYear: userData.academicYear || '2026–2027',
      semester: userData.semester || 'VI Semester',
      cgpa: userData.cgpa || 8.5,
      skills: userData.skills || ['Python', 'SQL', 'React'],
      interests: userData.interests || ['Artificial Intelligence', 'Software Development'],
      targetRole: userData.targetRole || 'Software Development Engineer',
      createdAt: new Date().toISOString(),
    };
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (updatedData: Partial<StudentUser>) => {
    setUser((prev) => (prev ? { ...prev, ...updatedData } : null));
  };

  const resetDemoUser = () => {
    setUser(DEFAULT_STUDENT);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_STUDENT));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        login,
        signup,
        logout,
        updateProfile,
        resetDemoUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
