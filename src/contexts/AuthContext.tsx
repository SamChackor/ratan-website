import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState, LoginCredentials, ParticipantData } from '@/types/auth';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  getAllParticipants: () => ParticipantData[];
  getParticipantData: (participantId: string) => ParticipantData | null;
  updateParticipantData: (participantId: string, data: Partial<ParticipantData>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock data for demonstration
const mockUsers: (User & { password: string })[] = [
  {
    id: 'org_1',
    email: 'admin@aegiscare.com',
    password: 'admin123',
    name: 'Dr. Sarah Johnson',
    role: 'organizer',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'part_1',
    email: 'riya@student.edu',
    password: 'student123',
    name: 'Riya Sharma',
    role: 'participant',
    teamId: 'team_1',
    teamName: 'Team Red Fox',
    createdAt: '2024-01-15T00:00:00Z'
  },
  {
    id: 'part_2',
    email: 'aditya@student.edu',
    password: 'student123',
    name: 'Aditya Kumar',
    role: 'participant',
    teamId: 'team_1',
    teamName: 'Team Red Fox',
    createdAt: '2024-01-15T00:00:00Z'
  },
  {
    id: 'part_3',
    email: 'karan@student.edu',
    password: 'student123',
    name: 'Karan Singh',
    role: 'participant',
    teamId: 'team_2',
    teamName: 'Team Blue Oak',
    createdAt: '2024-01-15T00:00:00Z'
  }
];

const mockParticipantData: ParticipantData[] = [
  {
    id: 'part_1',
    name: 'Riya Sharma',
    email: 'riya@student.edu',
    teamId: 'team_1',
    teamName: 'Team Red Fox',
    progress: {
      roundsCompleted: 1,
      currentRound: 2,
      lastActivity: '2024-01-20T14:30:00Z'
    },
    decisions: {
      round_1: {
        permHeadcount: 10,
        priceRetail: 4000,
        priceSME: 6500,
        marketingRetail: 25000,
        marketingSME: 15000
      }
    },
    results: {
      round_1: {
        revenue: 650000,
        netProfit: 125000,
        marketShare: 0.24,
        csat: 78
      }
    },
    status: 'active'
  },
  {
    id: 'part_2',
    name: 'Aditya Kumar',
    email: 'aditya@student.edu',
    teamId: 'team_1',
    teamName: 'Team Red Fox',
    progress: {
      roundsCompleted: 1,
      currentRound: 2,
      lastActivity: '2024-01-20T14:25:00Z'
    },
    decisions: {},
    results: {},
    status: 'active'
  },
  {
    id: 'part_3',
    name: 'Karan Singh',
    email: 'karan@student.edu',
    teamId: 'team_2',
    teamName: 'Team Blue Oak',
    progress: {
      roundsCompleted: 2,
      currentRound: 3,
      lastActivity: '2024-01-20T16:45:00Z'
    },
    decisions: {
      round_1: {
        permHeadcount: 12,
        priceRetail: 3800,
        priceSME: 6200,
        marketingRetail: 30000,
        marketingSME: 20000
      }
    },
    results: {
      round_1: {
        revenue: 720000,
        netProfit: 145000,
        marketShare: 0.28,
        csat: 82
      }
    },
    status: 'active'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });

  const [participantData, setParticipantData] = useState<ParticipantData[]>(mockParticipantData);

  useEffect(() => {
    // Check for stored auth state
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false
        });
      } catch (error) {
        localStorage.removeItem('auth_user');
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user = mockUsers.find(u => 
      u.email === credentials.email && 
      u.password === credentials.password &&
      u.role === credentials.role
    );

    if (user) {
      const { password, ...userWithoutPassword } = user;
      setAuthState({
        user: userWithoutPassword,
        isAuthenticated: true,
        isLoading: false
      });
      localStorage.setItem('auth_user', JSON.stringify(userWithoutPassword));
      return true;
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return false;
    }
  };

  const logout = () => {
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false
    });
    localStorage.removeItem('auth_user');
  };

  const getAllParticipants = (): ParticipantData[] => {
    return participantData;
  };

  const getParticipantData = (participantId: string): ParticipantData | null => {
    return participantData.find(p => p.id === participantId) || null;
  };

  const updateParticipantData = (participantId: string, data: Partial<ParticipantData>) => {
    setParticipantData(prev => 
      prev.map(p => p.id === participantId ? { ...p, ...data } : p)
    );
  };

  return (
    <AuthContext.Provider value={{
      ...authState,
      login,
      logout,
      getAllParticipants,
      getParticipantData,
      updateParticipantData
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};