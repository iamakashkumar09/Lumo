import { User, Post, Message, Notification } from './types';

export const MOCK_USERS: User[] = [
  { 
    id: 'u1', 
    username: 'alex_visuals', 
    name: 'Alex Chen', 
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop', 
    bio: 'Visual Storyteller 🎥\nTokyo based.', 
    status: 'online',
    stats: { friends: '12.4k', following: '842' } 
  },
  { 
    id: 'u2', 
    username: 'sarah.lens', 
    name: 'Sarah Miller', 
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', 
    bio: ' minimalist living 🌿\ncoffee & code', 
    status: 'offline',
    stats: { friends: '8.9k', following: '320' } 
  },
  { 
    id: 'u3', 
    username: 'urban_drifter', 
    name: 'Marcus J.', 
    avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop', 
    bio: 'Street Photographer 📸\nCapturing the unseen.', 
    status: 'online',
    stats: { friends: '24k', following: '1.1k' } 
  },
  { 
    id: 'u4', 
    username: 'luma_official', 
    name: 'Luma Team', 
    avatar: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=100&h=100&fit=crop', 
    bio: 'Official account.\nBuilding the future of social.', 
    status: 'online',
    stats: { friends: '1M', following: '5' } 
  },
  { 
    id: 'u5', 
    username: 'design_daily', 
    name: 'Design Daily', 
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop', 
    bio: 'Curated design inspiration.\nTag us to be featured.', 
    status: 'offline',
    stats: { friends: '560k', following: '24' } 
  },
];

export const MOCK_POSTS: Post[] = [
  {
    id: 'p1',
    userId: 'u1',
    image: 'https://images.unsplash.com/photo-1706059639556-9e9006c40c31?q=80&w=1000&auto=format&fit=crop',
    caption: 'Chasing the golden hour in Tokyo. 🌇 The light hit differently today.',
    likes: 1240,
    comments: 45,
    time: '2h ago',
    liked: false
  },
  {
    id: 'p2',
    userId: 'u2',
    image: 'https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?q=80&w=1000&auto=format&fit=crop',
    caption: 'Minimalist mornings. Coffee and coding. ☕️💻 #setup #workspace',
    likes: 892,
    comments: 23,
    time: '4h ago',
    liked: true
  },
  {
    id: 'p3',
    userId: 'u3',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000&auto=format&fit=crop',
    caption: 'New perspective. Shot on 35mm.',
    likes: 3500,
    comments: 112,
    time: '6h ago',
    liked: false
  },
];

export const MOCK_MESSAGES: Record<string, Message[]> = {
  'u1': [
    { id: '1', text: "Hey! Saw your latest post. The lighting is insane! 📸", sender: 'them', time: '10:30 AM' },
    { id: '2', text: "Thanks Alex! It was purely accidental haha.", sender: 'me', time: '10:32 AM' },
    { id: '3', text: "Sometimes those are the best shots.", sender: 'them', time: '10:33 AM' },
    { id: '4', text: "Are you going to the creator meetup this weekend?", sender: 'them', time: '10:33 AM' },
  ],
  'u2': [
    { id: '1', text: "Did you check the design files?", sender: 'me', time: 'Yesterday' },
    { id: '2', text: "Yes! They look great. Just left a few comments.", sender: 'them', time: 'Yesterday' },
  ]
};

export const MOCK_NOTIFICATIONS: Notification[] = [
    { id: 1, type: 'like', user: MOCK_USERS[2], postImage: MOCK_POSTS[0].image, time: '2m', read: false },
    { id: 2, type: 'follow', user: MOCK_USERS[0], time: '15m', read: false },
    { id: 3, type: 'comment', user: MOCK_USERS[1], postImage: MOCK_POSTS[1].image, text: 'Love this setup! 🔥', time: '1h', read: true },
    { id: 4, type: 'like', user: MOCK_USERS[3], postImage: MOCK_POSTS[2].image, time: '3h', read: true },
    { id: 5, type: 'follow', user: MOCK_USERS[4], time: '1d', read: true },
    { id: 6, type: 'like', user: MOCK_USERS[1], postImage: MOCK_POSTS[0].image, time: '2d', read: true },
];