import cardRepository from '../repositories/cardRepository';
import listRepository from '../repositories/listRepository';
import boardRepository from '../repositories/boardRepository';
import { Card, CardWithDetails, CreateCardDto, UpdateCardDto, MoveCardDto } from '../models/card';

export class CardService {
  async getCardsByList(listId: string, userId: string): Promise<CardWithDetails[]> {
    const boardId = await listRepository.getBoardIdByListId(listId);
    if (!boardId) {
      throw new Error('List not found');
    }

    const hasAccess = await boardRepository.hasMemberAccess(boardId, userId);
    if (!hasAccess) {
      throw new Error('Access denied to this board');
    }

    return cardRepository.findByListId(listId);
  }

  async getCardById(cardId: string, userId: string): Promise<CardWithDetails | null> {
    const listId = await cardRepository.getListIdByCardId(cardId);
    if (!listId) {
      throw new Error('Card not found');
    }

    const boardId = await listRepository.getBoardIdByListId(listId);
    if (!boardId) {
      throw new Error('List not found');
    }

    const hasAccess = await boardRepository.hasMemberAccess(boardId, userId);
    if (!hasAccess) {
      throw new Error('Access denied to this board');
    }

    return cardRepository.findByIdWithDetails(cardId);
  }

  async createCard(cardData: CreateCardDto, userId: string): Promise<Card> {
    const boardId = await listRepository.getBoardIdByListId(cardData.listId);
    if (!boardId) {
      throw new Error('List not found');
    }

    const hasAccess = await boardRepository.hasMemberAccess(boardId, userId);
    if (!hasAccess) {
      throw new Error('Access denied to this board');
    }

    return cardRepository.create(cardData);
  }

  async updateCard(cardId: string, userId: string, cardData: UpdateCardDto): Promise<Card> {
    const listId = await cardRepository.getListIdByCardId(cardId);
    if (!listId) {
      throw new Error('Card not found');
    }

    const boardId = await listRepository.getBoardIdByListId(listId);
    if (!boardId) {
      throw new Error('List not found');
    }

    const hasAccess = await boardRepository.hasMemberAccess(boardId, userId);
    if (!hasAccess) {
      throw new Error('Access denied to this board');
    }

    const card = await cardRepository.update(cardId, cardData);
    if (!card) {
      throw new Error('Card not found');
    }
    return card;
  }

  async moveCard(cardId: string, userId: string, moveData: MoveCardDto): Promise<Card> {
    const listId = await cardRepository.getListIdByCardId(cardId);
    if (!listId) {
      throw new Error('Card not found');
    }

    const sourceBoardId = await listRepository.getBoardIdByListId(listId);
    const targetBoardId = await listRepository.getBoardIdByListId(moveData.targetListId);

    if (!sourceBoardId || !targetBoardId) {
      throw new Error('List not found');
    }

    if (sourceBoardId !== targetBoardId) {
      throw new Error('Cannot move card between different boards');
    }

    const hasAccess = await boardRepository.hasMemberAccess(sourceBoardId, userId);
    if (!hasAccess) {
      throw new Error('Access denied to this board');
    }

    const card = await cardRepository.moveCard(cardId, moveData.targetListId, moveData.position);
    if (!card) {
      throw new Error('Card not found');
    }
    return card;
  }

  async deleteCard(cardId: string, userId: string): Promise<void> {
    const listId = await cardRepository.getListIdByCardId(cardId);
    if (!listId) {
      throw new Error('Card not found');
    }

    const boardId = await listRepository.getBoardIdByListId(listId);
    if (!boardId) {
      throw new Error('List not found');
    }

    const hasAccess = await boardRepository.hasMemberAccess(boardId, userId);
    if (!hasAccess) {
      throw new Error('Access denied to this board');
    }

    const deleted = await cardRepository.delete(cardId);
    if (!deleted) {
      throw new Error('Card not found');
    }
  }

  async assignUser(cardId: string, userId: string, assigneeId: string): Promise<void> {
    const listId = await cardRepository.getListIdByCardId(cardId);
    if (!listId) {
      throw new Error('Card not found');
    }

    const boardId = await listRepository.getBoardIdByListId(listId);
    if (!boardId) {
      throw new Error('List not found');
    }

    const hasAccess = await boardRepository.hasMemberAccess(boardId, userId);
    if (!hasAccess) {
      throw new Error('Access denied to this board');
    }

    const assigneeHasAccess = await boardRepository.hasMemberAccess(boardId, assigneeId);
    if (!assigneeHasAccess) {
      throw new Error('User does not have access to this board');
    }

    await cardRepository.assignUser(cardId, assigneeId);
  }

  async unassignUser(cardId: string, userId: string, assigneeId: string): Promise<void> {
    const listId = await cardRepository.getListIdByCardId(cardId);
    if (!listId) {
      throw new Error('Card not found');
    }

    const boardId = await listRepository.getBoardIdByListId(listId);
    if (!boardId) {
      throw new Error('List not found');
    }

    const hasAccess = await boardRepository.hasMemberAccess(boardId, userId);
    if (!hasAccess) {
      throw new Error('Access denied to this board');
    }

    const unassigned = await cardRepository.unassignUser(cardId, assigneeId);
    if (!unassigned) {
      throw new Error('User is not assigned to this card');
    }
  }
}

export default new CardService();
