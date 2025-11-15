export interface Board {
  id: string;
  name: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BoardWithMembers extends Board {
  memberCount?: number;
  members?: BoardMember[];
}

export interface BoardMember {
  userId: string;
  userName: string;
  userEmail: string;
  avatarUrl?: string;
  addedAt: Date;
}

export interface CreateBoardDto {
  name: string;
  ownerId: string;
}

export interface UpdateBoardDto {
  name?: string;
}

export interface AddBoardMemberDto {
  boardId: string;
  userId: string;
}
