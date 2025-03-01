import { mockUsers } from './mockData';
import { User } from '../types';

// Simulate API calls with promises and timeouts
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const authService = {
  login: async (email: string, password: string): Promise<User> => {
    await delay(800); // Simulate network delay
    
    const user = mockUsers.find(u => u.email === email);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    // In a real app, we would verify the password hash here
    // For this mock, we'll just return the user
    return user;
  },
  
  register: async (username: string, email: string, password: string): Promise<User> => {
    await delay(1000); // Simulate network delay
    
    // Check if user already exists
    if (mockUsers.some(u => u.email === email)) {
      throw new Error('User with this email already exists');
    }
    
    if (mockUsers.some(u => u.username === username)) {
      throw new Error('Username already taken');
    }
    
    // Create new user
    const newUser: User = {
      id: mockUsers.length + 1,
      username,
      email,
      created_at: new Date().toISOString(),
    };
    
    // In a real app, we would hash the password and save to DB
    mockUsers.push(newUser);
    
    return newUser;
  },
  
  logout: async (): Promise<void> => {
    await delay(300); // Simulate network delay
    // In a real app, we would invalidate the token on the server
  },
  
  resetPassword: async (email: string): Promise<void> => {
    await delay(1000); // Simulate network delay
    
    const user = mockUsers.find(u => u.email === email);
    
    if (!user) {
      throw new Error('No account found with this email');
    }
    
    // In a real app, we would send a password reset email
  }
};