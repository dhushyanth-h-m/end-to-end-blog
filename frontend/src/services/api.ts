// Base API URL - replace with your actual backend URL
const API_BASE_URL = 'http://localhost:5000/api';

// Interface for API response
interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

// Reusable fetch function with error handling
async function fetchFromAPI<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        // Add authentication if needed
        // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// User related API calls
export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  postsCount: number;
  followersCount: number;
  followingCount: number;
}

export async function getCurrentUser(): Promise<User> {
  const response = await fetchFromAPI<User>('/users/me');
  return response.data;
}

export async function getUserToFollow(): Promise<User[]> {
  const response = await fetchFromAPI<User[]>('/users/recommended');
  return response.data;
}

// Blog post related API calls
export interface Post {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  author: User;
  publishedAt: string;
  readTime: string;
  likes: number;
  comments: number;
  hasImage: boolean;
  imageUrl?: string;
  tags: string[];
}

export async function getPosts(type: 'for-you' | 'following' | 'latest', page = 1): Promise<Post[]> {
  const response = await fetchFromAPI<Post[]>(`/posts?type=${type}&page=${page}`);
  return response.data;
}

export async function getPostById(id: string): Promise<Post> {
  const response = await fetchFromAPI<Post>(`/posts/${id}`);
  return response.data;
}

export async function likePost(id: string): Promise<void> {
  await fetchFromAPI(`/posts/${id}/like`, { method: 'POST' });
}

export async function bookmarkPost(id: string): Promise<void> {
  await fetchFromAPI(`/posts/${id}/bookmark`, { method: 'POST' });
}

// Topics related API calls
export interface Topic {
  name: string;
  postsCount: number;
  trending: boolean;
}

export async function getTrendingTopics(): Promise<Topic[]> {
  const response = await fetchFromAPI<Topic[]>('/topics/trending');
  return response.data;
}

// Notifications
export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention';
  read: boolean;
  createdAt: string;
  actor: User;
  post?: {
    id: string;
    title: string;
  };
}

export async function getNotifications(): Promise<Notification[]> {
  const response = await fetchFromAPI<Notification[]>('/notifications');
  return response.data;
}

export async function markNotificationAsRead(id: string): Promise<void> {
  await fetchFromAPI(`/notifications/${id}/read`, { method: 'POST' });
}

// Search
export async function searchContent(query: string, filter: 'posts' | 'people'): Promise<{posts?: Post[], users?: User[]}> {
  const response = await fetchFromAPI(`/search?q=${encodeURIComponent(query)}&filter=${filter}`);
  return response.data;
} 