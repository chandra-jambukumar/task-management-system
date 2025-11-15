export interface List {
  id: string;
  boardId: string;
  name: string;
  position: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateListDto {
  boardId: string;
  name: string;
}

export interface UpdateListDto {
  name?: string;
  position?: number;
}

export interface ReorderListDto {
  listId: string;
  newPosition: number;
}
