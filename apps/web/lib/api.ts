import { Post, User } from './types';
import { MOCK_POSTS, MOCK_USERS } from './constants';
import { LoginFormValues, SignupFormValues } from './schemas';

export const api = {
  auth: {
    login: async (data: LoginFormValues) => {
      console.log("Logging in:", data);
      return Promise.resolve({ user: MOCK_USERS[0], token: 'fake-jwt-token' });
    },
    signup: async (data: SignupFormValues) => {
      console.log("Signing up:", data);
      return Promise.resolve({ user: MOCK_USERS[0], token: 'fake-jwt-token' });
    }
  },
  posts: {
    getAll: async (): Promise<Post[]> => {
      return Promise.resolve(MOCK_POSTS);
    },
    create: async (data: any) => {
      console.log("Creating post:", data);
      return Promise.resolve({ success: true });
    }
  },
  users: {
    getProfile: async (id: string): Promise<User | undefined> => {
      return Promise.resolve(MOCK_USERS.find(u => u.id === id));
    },
    getCurrentUser: async (): Promise<User> => {
      return Promise.resolve(MOCK_USERS[0]); 
    }
  }
};