// 1. The User Type
export interface User {
  id: string;
  username: string;
  name: string;
  avatarUrl: string;
  bio?: string;
  lastSeenAt: string | Date; // Backend sends string, we can convert to Date
  // We keep these in the Frontend type because the Backend 
  // will calculate these and send them as "virtual fields"
  stats?: {
    followersCount: number;
    followingCount: number;
    postsCount: number;
  };
}

// 2. The Post Type
export interface Post {
  id: string;
  userId: string;
  user?: User; // Joined user data (for avatar/name on feed)
  imageUrl: string;
  caption: string;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  likedByMe?: boolean; // The backend will tell us if the CURRENT user liked it
}

// 3. The Message Type
export interface Message {
  id: string;
  text: string;
  senderId: string;
  receiverId: string;
  createdAt: string;
}

// 4. The Notification Type
export interface Notification {
  id: string;
  userId: string;    // Person getting notified
  actorId: string;   // Person who performed the action
  actor?: User;      // Joined user data to show who liked/followed
  type: 'like' | 'follow' | 'comment';
  postId?: string;
  postImage?: string; 
  text?: string;
  isRead: boolean;
  createdAt: string;
}