import listRepository from '../repositories/listRepository';
import boardRepository from '../repositories/boardRepository';
import { List, CreateListDto, UpdateListDto } from '../models/list';

export class ListService {
  async getListsByBoard(boardId: string, userId: string): Promise<List[]> {
    const hasAccess = await boardRepository.hasMemberAccess(boardId, userId);
    if (!hasAccess) {
      throw new Error('Access denied to this board');
    }
    return listRepository.findByBoardId(boardId);
  }

  async createList(listData: CreateListDto, userId: string): Promise<List> {
    const hasAccess = await boardRepository.hasMemberAccess(listData.boardId, userId);
    if (!hasAccess) {
      throw new Error('Access denied to this board');
    }
    return listRepository.create(listData);
  }

  async updateList(listId: string, userId: string, listData: UpdateListDto): Promise<List> {
    const boardId = await listRepository.getBoardIdByListId(listId);
    if (!boardId) {
      throw new Error('List not found');
    }

    const hasAccess = await boardRepository.hasMemberAccess(boardId, userId);
    if (!hasAccess) {
      throw new Error('Access denied to this board');
    }

    if (listData.position !== undefined) {
      const currentList = await listRepository.findById(listId);
      if (currentList && currentList.position !== listData.position) {
        await listRepository.reorderLists(boardId, listId, currentList.position, listData.position);
        return (await listRepository.findById(listId))!;
      }
    }

    const list = await listRepository.update(listId, listData);
    if (!list) {
      throw new Error('List not found');
    }
    return list;
  }

  async deleteList(listId: string, userId: string): Promise<void> {
    const boardId = await listRepository.getBoardIdByListId(listId);
    if (!boardId) {
      throw new Error('List not found');
    }

    const hasAccess = await boardRepository.hasMemberAccess(boardId, userId);
    if (!hasAccess) {
      throw new Error('Access denied to this board');
    }

    const deleted = await listRepository.delete(listId);
    if (!deleted) {
      throw new Error('List not found');
    }
  }
}

export default new ListService();
