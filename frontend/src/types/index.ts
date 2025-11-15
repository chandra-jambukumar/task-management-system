export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Board {
  id: string;
  name: string;
  ownerId: string;
  memberCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface List {
  id: string;
  boardId: string;
  name: string;
  position: number;
  createdAt: string;
  updatedAt: string;
}

export type CardPriority = 'high' | 'medium' | 'low';

export interface Card {
  id: string;
  listId: string;
  title: string;
  description?: string;
  priority?: CardPriority;
  position: number;
  assignedUsers?: User[];
  commentCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  cardId: string;
  userId: string;
  user?: User;
  content: string;
  createdAt: string;
  updatedAt: string;
}
