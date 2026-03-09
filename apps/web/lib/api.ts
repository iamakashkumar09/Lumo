import { LoginFormValues, SignupFormValues } from '@/lib/schemas';
import { User, Post, Notification } from '@/lib/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Helper to add JWT token to requests safely
const getHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
};

export const api = {
  auth: {
    login: async (data: LoginFormValues) => {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Login failed');
      }
      
      const json = await res.json();
      localStorage.setItem('token', json.access_token); 
      return json.user;
    },

    signup: async (data: Omit<SignupFormValues, 'confirmPassword'>) => {
      try {
        const res = await fetch(`${API_URL}/user`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Signup failed');
        }

        return await res.json();
      } catch (error: any) {
        console.error("Signup Error:", error.message);
        throw error;
      }
    }
  },

  posts: {
    getAll: async (): Promise<Post[]> => {
      try {
        const res = await fetch(`${API_URL}/posts`, { cache: 'no-store' });
        if (!res.ok) return []; 
        const data = await res.json();
        return Array.isArray(data) ? data : []; 
      } catch (error) {
        console.warn("Backend offline or posts route missing");
        return [];
      }
    },
    
    // Fetch posts for a specific user (Required for Profile Page)
    getUserPosts: async (userId: string): Promise<Post[]> => {
      try {
        const res = await fetch(`${API_URL}/posts/user/${userId}`, { 
          headers: getHeaders(),
          cache: 'no-store' 
        });
        if (!res.ok) return [];
        const data = await res.json();
        return Array.isArray(data) ? data : [];
      } catch (error) {
        console.warn(`Could not fetch posts for user ${userId}`);
        return [];
      }
    },

    toggleLike: async (postId: string) => {
      try {
        const res = await fetch(`${API_URL}/posts/${postId}/like`, {
          method: 'POST',
          headers: getHeaders(),
        });
        if (!res.ok) throw new Error("Like failed");
      } catch (error) {
        console.warn("Backend not ready for likes yet!");
      }
    },

    addComment: async (postId: string, text: string) => {
      try {
        const res = await fetch(`${API_URL}/posts/${postId}/comments`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify({ text }),
        });
        if (!res.ok) throw new Error("Comment failed");
        return await res.json();
      } catch (error) {
        throw new Error("Failed to post comment");
      }
    },
    
    create: async (formData: any) => {
       console.warn("Post creation endpoint not yet implemented");
    }
  },

  messages: {
    getConversation: async (userId: string) => {
      try {
        const res = await fetch(`${API_URL}/messages/${userId}`, { headers: getHeaders() });
        if (!res.ok) return [];
        return await res.json();
      } catch (error) {
        return [];
      }
    },
    send: async (userId: string, text: string) => {
      try {
        const res = await fetch(`${API_URL}/messages/${userId}`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify({ text }),
        });
        if (!res.ok) throw new Error("Failed to send");
        return await res.json();
      } catch (error) {
        return null;
      }
    }
  },

  notifications: {
    getAll: async (): Promise<Notification[]> => {
      try {
        const res = await fetch(`${API_URL}/notifications`, { headers: getHeaders() });
        if (!res.ok) return [];
        const data = await res.json();
        return Array.isArray(data) ? data : [];
      } catch (error) {
        return [];
      }
    }
  },

  users: {
    getAll: async (): Promise<User[]> => {
      try {
        const res = await fetch(`${API_URL}/users`, { headers: getHeaders() });
        if (!res.ok) return [];
        const data = await res.json();
        return Array.isArray(data) ? data : [];
      } catch (error) {
        return [];
      }
    },

    // Fetch any user by their ID (Required for Profile Page)
    getUserById: async (userId: string): Promise<User | null> => {
      try {
        const res = await fetch(`${API_URL}/users/${userId}`, { headers: getHeaders() });
        if (!res.ok) return null;
        return await res.json();
      } catch (error) {
        return null;
      }
    },

    getCurrentUser: async (): Promise<User | null> => {
      try {
        const res = await fetch(`${API_URL}/users/me`, {
          headers: getHeaders(),
        });
        if (!res.ok) return null;
        return await res.json();
      } catch (error) {
        return null;
      }
    },
  }
};