import boardRepository from '../repositories/boardRepository';
import { Board, BoardWithMembers, CreateBoardDto, UpdateBoardDto, BoardMember } from '../models/board';

export class BoardService {
  async getAllBoards(userId: string): Promise<BoardWithMembers[]> {
    return boardRepository.findAllByUser(userId);
  }

  async getBoardById(boardId: string, userId: string): Promise<BoardWithMembers | null> {
    const hasAccess = await boardRepository.hasMemberAccess(boardId, userId);
    if (!hasAccess) {
      throw new Error('Access denied to this board');
    }
    return boardRepository.findByIdWithMembers(boardId);
  }

  async createBoard(boardData: CreateBoardDto): Promise<Board> {
    return boardRepository.create(boardData);
  }

  async updateBoard(boardId: string, userId: string, boardData: UpdateBoardDto): Promise<Board> {
    const hasAccess = await boardRepository.hasMemberAccess(boardId, userId);
    if (!hasAccess) {
      throw new Error('Access denied to this board');
    }

    const board = await boardRepository.update(boardId, boardData);
    if (!board) {
      throw new Error('Board not found');
    }
    return board;
  }

  async deleteBoard(boardId: string, userId: string): Promise<void> {
    const isOwner = await boardRepository.isOwner(boardId, userId);
    if (!isOwner) {
      throw new Error('Only the board owner can delete the board');
    }

    const deleted = await boardRepository.delete(boardId);
    if (!deleted) {
      throw new Error('Board not found');
    }
  }

  async getBoardMembers(boardId: string, userId: string): Promise<BoardMember[]> {
    const hasAccess = await boardRepository.hasMemberAccess(boardId, userId);
    if (!hasAccess) {
      throw new Error('Access denied to this board');
    }
    return boardRepository.getBoardMembers(boardId);
  }

  async addBoardMember(boardId: string, userId: string, memberUserId: string): Promise<void> {
    const isOwner = await boardRepository.isOwner(boardId, userId);
    if (!isOwner) {
      throw new Error('Only the board owner can add members');
    }

    await boardRepository.addMember(boardId, memberUserId);
  }

  async removeBoardMember(boardId: string, userId: string, memberUserId: string): Promise<void> {
    const isOwner = await boardRepository.isOwner(boardId, userId);
    if (!isOwner) {
      throw new Error('Only the board owner can remove members');
    }

    const board = await boardRepository.findById(boardId);
    if (board?.ownerId === memberUserId) {
      throw new Error('Cannot remove the board owner');
    }

    const removed = await boardRepository.removeMember(boardId, memberUserId);
    if (!removed) {
      throw new Error('Member not found on this board');
    }
  }
}

export default new BoardService();
