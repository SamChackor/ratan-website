export interface User {
  id: string;
  email: string;
  name: string;
  role: 'organizer' | 'participant';
  teamId?: string;
  teamName?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
  role: 'organizer' | 'participant';
}

export interface ParticipantData {
  id: string;
  name: string;
  email: string;
  teamId: string;
  teamName: string;
  progress: {
    roundsCompleted: number;
    currentRound: number;
    lastActivity: string;
  };
  decisions: Record<string, any>;
  results: Record<string, any>;
  status: 'active' | 'inactive' | 'completed';
}