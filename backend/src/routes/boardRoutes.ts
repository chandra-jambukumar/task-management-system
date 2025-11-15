import { Router, Request, Response } from 'express';
import boardService from '../services/boardService';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const boards = await boardService.getAllBoards(userId);
    res.json({ boards });
  } catch (error) {
    console.error('Get boards error:', error);
    res.status(500).json({ error: 'Failed to fetch boards' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Board name is required' });
    }

    const board = await boardService.createBoard({ name: name.trim(), ownerId: userId });
    res.status(201).json({ board });
  } catch (error) {
    console.error('Create board error:', error);
    res.status(500).json({ error: 'Failed to create board' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const board = await boardService.getBoardById(req.params.id, userId);
    if (!board) {
      return res.status(404).json({ error: 'Board not found' });
    }

    res.json({ board });
  } catch (error) {
    if (error instanceof Error && error.message === 'Access denied to this board') {
      return res.status(403).json({ error: error.message });
    }
    console.error('Get board error:', error);
    res.status(500).json({ error: 'Failed to fetch board' });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Board name is required' });
    }

    const board = await boardService.updateBoard(req.params.id, userId, { name: name.trim() });
    res.json({ board });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Access denied to this board') {
        return res.status(403).json({ error: error.message });
      }
      if (error.message === 'Board not found') {
        return res.status(404).json({ error: error.message });
      }
    }
    console.error('Update board error:', error);
    res.status(500).json({ error: 'Failed to update board' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await boardService.deleteBoard(req.params.id, userId);
    res.json({ message: 'Board deleted successfully' });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Only the board owner can delete the board') {
        return res.status(403).json({ error: error.message });
      }
      if (error.message === 'Board not found') {
        return res.status(404).json({ error: error.message });
      }
    }
    console.error('Delete board error:', error);
    res.status(500).json({ error: 'Failed to delete board' });
  }
});

router.get('/:id/members', async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const members = await boardService.getBoardMembers(req.params.id, userId);
    res.json({ members });
  } catch (error) {
    if (error instanceof Error && error.message === 'Access denied to this board') {
      return res.status(403).json({ error: error.message });
    }
    console.error('Get board members error:', error);
    res.status(500).json({ error: 'Failed to fetch board members' });
  }
});

router.post('/:id/members', async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { userId: memberUserId } = req.body;
    if (!memberUserId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    await boardService.addBoardMember(req.params.id, userId, memberUserId);
    res.status(201).json({ message: 'Member added successfully' });
  } catch (error) {
    if (error instanceof Error && error.message === 'Only the board owner can add members') {
      return res.status(403).json({ error: error.message });
    }
    console.error('Add board member error:', error);
    res.status(500).json({ error: 'Failed to add board member' });
  }
});

router.delete('/:id/members/:userId', async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await boardService.removeBoardMember(req.params.id, userId, req.params.userId);
    res.json({ message: 'Member removed successfully' });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Only the board owner can remove members' || 
          error.message === 'Cannot remove the board owner') {
        return res.status(403).json({ error: error.message });
      }
      if (error.message === 'Member not found on this board') {
        return res.status(404).json({ error: error.message });
      }
    }
    console.error('Remove board member error:', error);
    res.status(500).json({ error: 'Failed to remove board member' });
  }
});

export default router;
