import db from '../config/database';
import { Board, BoardWithMembers, CreateBoardDto, UpdateBoardDto, BoardMember } from '../models/board';

const generateId = (): string => {
  return Array.from({ length: 32 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
};

const mapBoard = (row: any): Board => ({
  id: row.id,
  name: row.name,
  ownerId: row.owner_id,
  createdAt: new Date(row.created_at),
  updatedAt: new Date(row.updated_at)
});

export class BoardRepository {
  async findById(id: string): Promise<Board | null> {
    const result = db.query(
      `SELECT id, name, owner_id, created_at, updated_at
       FROM boards WHERE id = ?`,
      [id]
    );
    return result.rows[0] ? mapBoard(result.rows[0]) : null;
  }

  async findByIdWithMembers(id: string): Promise<BoardWithMembers | null> {
    const result = db.query(
      `SELECT b.id, b.name, b.owner_id, b.created_at, b.updated_at,
              COUNT(DISTINCT bm.user_id) as memberCount
       FROM boards b
       LEFT JOIN board_members bm ON b.id = bm.board_id
       WHERE b.id = ?
       GROUP BY b.id`,
      [id]
    );
    if (!result.rows[0]) return null;
    const row = result.rows[0];
    return {
      ...mapBoard(row),
      memberCount: row.memberCount
    };
  }

  async findAllByUser(userId: string): Promise<BoardWithMembers[]> {
    const result = db.query(
      `SELECT DISTINCT b.id, b.name, b.owner_id, b.created_at, b.updated_at,
              COUNT(DISTINCT bm.user_id) as memberCount
       FROM boards b
       LEFT JOIN board_members bm ON b.id = bm.board_id
       WHERE b.owner_id = ? OR b.id IN (
         SELECT board_id FROM board_members WHERE user_id = ?
       )
       GROUP BY b.id
       ORDER BY b.updated_at DESC`,
      [userId, userId]
    );
    return result.rows.map((row: any) => ({
      ...mapBoard(row),
      memberCount: row.memberCount
    }));
  }

  async create(boardData: CreateBoardDto): Promise<Board> {
    const id = generateId();
    
    db.query(
      `INSERT INTO boards (id, name, owner_id)
       VALUES (?, ?, ?)`,
      [id, boardData.name, boardData.ownerId]
    );

    db.query(
      `INSERT INTO board_members (board_id, user_id) VALUES (?, ?)`,
      [id, boardData.ownerId]
    );

    return this.findById(id) as Promise<Board>;
  }

  async update(id: string, boardData: UpdateBoardDto): Promise<Board | null> {
    db.query(
      `UPDATE boards 
       SET name = COALESCE(?, name), updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [boardData.name, id]
    );
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = db.query('DELETE FROM boards WHERE id = ?', [id]);
    return result.rowCount !== null && result.rowCount > 0;
  }

  async isOwner(boardId: string, userId: string): Promise<boolean> {
    const result = db.query(
      'SELECT 1 FROM boards WHERE id = ? AND owner_id = ?',
      [boardId, userId]
    );
    return result.rows.length > 0;
  }

  async hasMemberAccess(boardId: string, userId: string): Promise<boolean> {
    const result = db.query(
      `SELECT 1 FROM boards b
       WHERE b.id = ? AND (
         b.owner_id = ? OR 
         EXISTS (SELECT 1 FROM board_members WHERE board_id = ? AND user_id = ?)
       )`,
      [boardId, userId, boardId, userId]
    );
    return result.rows.length > 0;
  }

  async getBoardMembers(boardId: string): Promise<BoardMember[]> {
    const result = db.query(
      `SELECT bm.user_id as userId, u.name as userName, u.email as userEmail,
              u.avatar_url as avatarUrl, bm.added_at as addedAt
       FROM board_members bm
       JOIN users u ON bm.user_id = u.id
       WHERE bm.board_id = ?
       ORDER BY bm.added_at ASC`,
      [boardId]
    );
    return result.rows.map((row: any) => ({
      userId: row.userId,
      userName: row.userName,
      userEmail: row.userEmail,
      avatarUrl: row.avatarUrl,
      addedAt: new Date(row.addedAt)
    }));
  }

  async addMember(boardId: string, userId: string): Promise<void> {
    try {
      db.query(
        `INSERT INTO board_members (board_id, user_id) VALUES (?, ?)`,
        [boardId, userId]
      );
    } catch (error: any) {
      if (!error.message?.includes('UNIQUE constraint')) {
        throw error;
      }
    }
  }

  async removeMember(boardId: string, userId: string): Promise<boolean> {
    const result = db.query(
      'DELETE FROM board_members WHERE board_id = ? AND user_id = ?',
      [boardId, userId]
    );
    return result.rowCount !== null && result.rowCount > 0;
  }
}

export default new BoardRepository();
