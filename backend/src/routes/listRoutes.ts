import { Router, Request, Response } from 'express';
import listService from '../services/listService';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/boards/:boardId/lists', async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const lists = await listService.getListsByBoard(req.params.boardId, userId);
    res.json({ lists });
  } catch (error) {
    if (error instanceof Error && error.message === 'Access denied to this board') {
      return res.status(403).json({ error: error.message });
    }
    console.error('Get lists error:', error);
    res.status(500).json({ error: 'Failed to fetch lists' });
  }
});

router.post('/boards/:boardId/lists', async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'List name is required' });
    }

    const list = await listService.createList(
      { boardId: req.params.boardId, name: name.trim() },
      userId
    );
    res.status(201).json({ list });
  } catch (error) {
    if (error instanceof Error && error.message === 'Access denied to this board') {
      return res.status(403).json({ error: error.message });
    }
    console.error('Create list error:', error);
    res.status(500).json({ error: 'Failed to create list' });
  }
});

router.put('/lists/:id', async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { name, position } = req.body;
    const updateData: any = {};
    
    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({ error: 'List name cannot be empty' });
      }
      updateData.name = name.trim();
    }
    
    if (position !== undefined) {
      if (typeof position !== 'number' || position < 0) {
        return res.status(400).json({ error: 'Invalid position value' });
      }
      updateData.position = position;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'No update data provided' });
    }

    const list = await listService.updateList(req.params.id, userId, updateData);
    res.json({ list });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Access denied to this board') {
        return res.status(403).json({ error: error.message });
      }
      if (error.message === 'List not found') {
        return res.status(404).json({ error: error.message });
      }
    }
    console.error('Update list error:', error);
    res.status(500).json({ error: 'Failed to update list' });
  }
});

router.delete('/lists/:id', async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await listService.deleteList(req.params.id, userId);
    res.json({ message: 'List deleted successfully' });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Access denied to this board') {
        return res.status(403).json({ error: error.message });
      }
      if (error.message === 'List not found') {
        return res.status(404).json({ error: error.message });
      }
    }
    console.error('Delete list error:', error);
    res.status(500).json({ error: 'Failed to delete list' });
  }
});

export default router;
