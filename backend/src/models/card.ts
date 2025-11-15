import { User } from './user';

export type CardPriority = 'high' | 'medium' | 'low';

export interface Card {
  id: string;
  listId: string;
  title: string;
  description?: string;
  priority?: CardPriority;
  position: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CardWithDetails extends Card {
  assignedUsers?: User[];
  commentCount?: number;
}

export interface CreateCardDto {
  listId: string;
  title: string;
  description?: string;
  priority?: CardPriority;
}

export interface UpdateCardDto {
  title?: string;
  description?: string;
  priority?: CardPriority;
}

export interface MoveCardDto {
  targetListId: string;
  position: number;
}
