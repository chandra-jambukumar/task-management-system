import db from '../config/database';
import { List, CreateListDto, UpdateListDto } from '../models/list';

const generateId = (): string => {
  return Array.from({ length: 32 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
};

const mapList = (row: any): List => ({
  id: row.id,
  boardId: row.board_id,
  name: row.name,
  position: row.position,
  createdAt: new Date(row.created_at),
  updatedAt: new Date(row.updated_at)
});

export class ListRepository {
  async findById(id: string): Promise<List | null> {
    const result = db.query(
      `SELECT id, board_id, name, position, created_at, updated_at
       FROM lists WHERE id = ?`,
      [id]
    );
    return result.rows[0] ? mapList(result.rows[0]) : null;
  }

  async findByBoardId(boardId: string): Promise<List[]> {
    const result = db.query(
      `SELECT id, board_id, name, position, created_at, updated_at
       FROM lists 
       WHERE board_id = ?
       ORDER BY position ASC`,
      [boardId]
    );
    return result.rows.map(mapList);
  }

  async getNextPosition(boardId: string): Promise<number> {
    const result = db.query(
      'SELECT COALESCE(MAX(position), -1) + 1 as next_position FROM lists WHERE board_id = ?',
      [boardId]
    );
    return result.rows[0].next_position;
  }

  async create(listData: CreateListDto): Promise<List> {
    const id = generateId();
    const position = await this.getNextPosition(listData.boardId);
    
    db.query(
      `INSERT INTO lists (id, board_id, name, position)
       VALUES (?, ?, ?, ?)`,
      [id, listData.boardId, listData.name, position]
    );
    return this.findById(id) as Promise<List>;
  }

  async update(id: string, listData: UpdateListDto): Promise<List | null> {
    const fields: string[] = [];
    const values: any[] = [];

    if (listData.name !== undefined) {
      fields.push(`name = ?`);
      values.push(listData.name);
    }

    if (listData.position !== undefined) {
      fields.push(`position = ?`);
      values.push(listData.position);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    db.query(
      `UPDATE lists SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    return this.findById(id);
  }

  async updatePosition(id: string, newPosition: number): Promise<List | null> {
    db.query(
      `UPDATE lists 
       SET position = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [newPosition, id]
    );
    return this.findById(id);
  }

  async reorderLists(boardId: string, listId: string, oldPosition: number, newPosition: number): Promise<void> {
    if (newPosition < oldPosition) {
      db.query(
        `UPDATE lists 
         SET position = position + 1, updated_at = CURRENT_TIMESTAMP
         WHERE board_id = ? AND position >= ? AND position < ? AND id != ?`,
        [boardId, newPosition, oldPosition, listId]
      );
    } else if (newPosition > oldPosition) {
      db.query(
        `UPDATE lists 
         SET position = position - 1, updated_at = CURRENT_TIMESTAMP
         WHERE board_id = ? AND position > ? AND position <= ? AND id != ?`,
        [boardId, oldPosition, newPosition, listId]
      );
    }

    db.query(
      `UPDATE lists 
       SET position = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [newPosition, listId]
    );
  }

  async delete(id: string): Promise<boolean> {
    const result = db.query('DELETE FROM lists WHERE id = ?', [id]);
    return result.rowCount !== null && result.rowCount > 0;
  }

  async getBoardIdByListId(listId: string): Promise<string | null> {
    const result = db.query(
      'SELECT board_id FROM lists WHERE id = ?',
      [listId]
    );
    return result.rows[0]?.board_id || null;
  }
}

export default new ListRepository();
