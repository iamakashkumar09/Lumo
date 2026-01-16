export interface User {
  id: string;
  username: string;
  name: string;
  avatar: string;
  bio?: string;
  status: 'online' | 'offline';
  stats: {
    friends: string;
    following: string;
  };
}

export interface Post {
  id: string;
  userId: string;
  image: string;
  caption: string;
  likes: number;
  comments: number;
  time: string;
  liked: boolean;
}

export interface Message {
  id: string;
  text: string;
  sender: 'me' | 'them';
  time: string;
}

export interface Notification {
  id: number;
  type: 'like' | 'follow' | 'comment';
  user: User;
  postImage?: string;
  text?: string;
  time: string;
  read: boolean;
}