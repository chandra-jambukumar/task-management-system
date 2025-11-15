import db from '../config/database';
import { Card, CardWithDetails, CreateCardDto, UpdateCardDto } from '../models/card';

const generateId = (): string => {
  return Array.from({ length: 32 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
};

const mapCard = (row: any): Card => ({
  id: row.id,
  listId: row.list_id,
  title: row.title,
  description: row.description,
  priority: row.priority,
  position: row.position,
  createdAt: new Date(row.created_at),
  updatedAt: new Date(row.updated_at)
});

export class CardRepository {
  async findById(id: string): Promise<Card | null> {
    const result = db.query(
      `SELECT id, list_id, title, description, priority, position, created_at, updated_at
       FROM cards WHERE id = ?`,
      [id]
    );
    return result.rows[0] ? mapCard(result.rows[0]) : null;
  }

  async findByIdWithDetails(id: string): Promise<CardWithDetails | null> {
    const cardResult = db.query(
      `SELECT id, list_id, title, description, priority, position, created_at, updated_at
       FROM cards WHERE id = ?`,
      [id]
    );
    
    if (!cardResult.rows[0]) return null;
    
    const card = mapCard(cardResult.rows[0]);
    
    const usersResult = db.query(
      `SELECT u.id, u.email, u.name, u.avatar_url as avatarUrl
       FROM card_assignments ca
       JOIN users u ON ca.user_id = u.id
       WHERE ca.card_id = ?`,
      [id]
    );
    
    const commentsResult = db.query(
      `SELECT COUNT(*) as count FROM comments WHERE card_id = ?`,
      [id]
    );
    
    return {
      ...card,
      assignedUsers: usersResult.rows.map((row: any) => ({
        id: row.id,
        email: row.email,
        name: row.name,
        avatarUrl: row.avatarUrl,
        createdAt: new Date(),
        updatedAt: new Date()
      })),
      commentCount: commentsResult.rows[0]?.count || 0
    };
  }

  async findByListId(listId: string): Promise<CardWithDetails[]> {
    const cardsResult = db.query(
      `SELECT id, list_id, title, description, priority, position, created_at, updated_at
       FROM cards
       WHERE list_id = ?
       ORDER BY position ASC`,
      [listId]
    );
    
    const cards: CardWithDetails[] = [];
    
    for (const row of cardsResult.rows) {
      const card = mapCard(row);
      
      const usersResult = db.query(
        `SELECT u.id, u.email, u.name, u.avatar_url as avatarUrl
         FROM card_assignments ca
         JOIN users u ON ca.user_id = u.id
         WHERE ca.card_id = ?`,
        [card.id]
      );
      
      const commentsResult = db.query(
        `SELECT COUNT(*) as count FROM comments WHERE card_id = ?`,
        [card.id]
      );
      
      cards.push({
        ...card,
        assignedUsers: usersResult.rows.map((row: any) => ({
          id: row.id,
          email: row.email,
          name: row.name,
          avatarUrl: row.avatarUrl,
          createdAt: new Date(),
          updatedAt: new Date()
        })),
        commentCount: commentsResult.rows[0]?.count || 0
      });
    }
    
    return cards;
  }

  async getNextPosition(listId: string): Promise<number> {
    const result = db.query(
      'SELECT COALESCE(MAX(position), -1) + 1 as next_position FROM cards WHERE list_id = ?',
      [listId]
    );
    return result.rows[0].next_position;
  }

  async create(cardData: CreateCardDto): Promise<Card> {
    const id = generateId();
    const position = await this.getNextPosition(cardData.listId);
    
    db.query(
      `INSERT INTO cards (id, list_id, title, description, priority, position)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, cardData.listId, cardData.title, cardData.description || null, cardData.priority || null, position]
    );
    return this.findById(id) as Promise<Card>;
  }

  async update(id: string, cardData: UpdateCardDto): Promise<Card | null> {
    const fields: string[] = [];
    const values: any[] = [];

    if (cardData.title !== undefined) {
      fields.push(`title = ?`);
      values.push(cardData.title);
    }

    if (cardData.description !== undefined) {
      fields.push(`description = ?`);
      values.push(cardData.description || null);
    }

    if (cardData.priority !== undefined) {
      fields.push(`priority = ?`);
      values.push(cardData.priority || null);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    db.query(
      `UPDATE cards SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    return this.findById(id);
  }

  async moveCard(cardId: string, targetListId: string, newPosition: number): Promise<Card | null> {
    const cardResult = db.query(
      'SELECT list_id, position FROM cards WHERE id = ?',
      [cardId]
    );

    if (cardResult.rows.length === 0) {
      return null;
    }

    const { list_id: sourceListId, position: oldPosition } = cardResult.rows[0];

    if (sourceListId === targetListId) {
      if (newPosition < oldPosition) {
        db.query(
          `UPDATE cards 
           SET position = position + 1, updated_at = CURRENT_TIMESTAMP
           WHERE list_id = ? AND position >= ? AND position < ? AND id != ?`,
          [targetListId, newPosition, oldPosition, cardId]
        );
      } else if (newPosition > oldPosition) {
        db.query(
          `UPDATE cards 
           SET position = position - 1, updated_at = CURRENT_TIMESTAMP
           WHERE list_id = ? AND position > ? AND position <= ? AND id != ?`,
          [targetListId, oldPosition, newPosition, cardId]
        );
      }
    } else {
      db.query(
        `UPDATE cards 
         SET position = position - 1, updated_at = CURRENT_TIMESTAMP
         WHERE list_id = ? AND position > ?`,
        [sourceListId, oldPosition]
      );

      db.query(
        `UPDATE cards 
         SET position = position + 1, updated_at = CURRENT_TIMESTAMP
         WHERE list_id = ? AND position >= ?`,
        [targetListId, newPosition]
      );
    }

    db.query(
      `UPDATE cards 
       SET list_id = ?, position = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [targetListId, newPosition, cardId]
    );

    return this.findById(cardId);
  }

  async delete(id: string): Promise<boolean> {
    const result = db.query('DELETE FROM cards WHERE id = ?', [id]);
    return result.rowCount !== null && result.rowCount > 0;
  }

  async getListIdByCardId(cardId: string): Promise<string | null> {
    const result = db.query(
      'SELECT list_id FROM cards WHERE id = ?',
      [cardId]
    );
    return result.rows[0]?.list_id || null;
  }

  async assignUser(cardId: string, userId: string): Promise<void> {
    try {
      db.query(
        `INSERT INTO card_assignments (card_id, user_id) VALUES (?, ?)`,
        [cardId, userId]
      );
    } catch (error: any) {
      if (!error.message?.includes('UNIQUE constraint')) {
        throw error;
      }
    }
  }

  async unassignUser(cardId: string, userId: string): Promise<boolean> {
    const result = db.query(
      'DELETE FROM card_assignments WHERE card_id = ? AND user_id = ?',
      [cardId, userId]
    );
    return result.rowCount !== null && result.rowCount > 0;
  }

  async getAssignedUsers(cardId: string): Promise<any[]> {
    const result = db.query(
      `SELECT u.id, u.email, u.name, u.avatar_url as avatarUrl
       FROM card_assignments ca
       JOIN users u ON ca.user_id = u.id
       WHERE ca.card_id = ?`,
      [cardId]
    );
    return result.rows;
  }
}

export default new CardRepository();
