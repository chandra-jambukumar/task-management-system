import { Router, Request, Response } from 'express';
import cardService from '../services/cardService';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/lists/:listId/cards', async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const cards = await cardService.getCardsByList(req.params.listId, userId);
    res.json({ cards });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Access denied to this board') {
        return res.status(403).json({ error: error.message });
      }
      if (error.message === 'List not found') {
        return res.status(404).json({ error: error.message });
      }
    }
    console.error('Get cards error:', error);
    res.status(500).json({ error: 'Failed to fetch cards' });
  }
});

router.post('/lists/:listId/cards', async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { title, description, priority } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Card title is required' });
    }

    if (priority && !['high', 'medium', 'low'].includes(priority)) {
      return res.status(400).json({ error: 'Invalid priority value' });
    }

    const card = await cardService.createCard(
      {
        listId: req.params.listId,
        title: title.trim(),
        description: description?.trim(),
        priority
      },
      userId
    );
    res.status(201).json({ card });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Access denied to this board') {
        return res.status(403).json({ error: error.message });
      }
      if (error.message === 'List not found') {
        return res.status(404).json({ error: error.message });
      }
    }
    console.error('Create card error:', error);
    res.status(500).json({ error: 'Failed to create card' });
  }
});

router.get('/cards/:id', async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const card = await cardService.getCardById(req.params.id, userId);
    if (!card) {
      return res.status(404).json({ error: 'Card not found' });
    }

    res.json({ card });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Access denied to this board') {
        return res.status(403).json({ error: error.message });
      }
      if (error.message === 'Card not found') {
        return res.status(404).json({ error: error.message });
      }
    }
    console.error('Get card error:', error);
    res.status(500).json({ error: 'Failed to fetch card' });
  }
});

router.put('/cards/:id', async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { title, description, priority } = req.body;
    const updateData: any = {};

    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({ error: 'Card title cannot be empty' });
      }
      updateData.title = title.trim();
    }

    if (description !== undefined) {
      updateData.description = description?.trim() || null;
    }

    if (priority !== undefined) {
      if (priority && !['high', 'medium', 'low'].includes(priority)) {
        return res.status(400).json({ error: 'Invalid priority value' });
      }
      updateData.priority = priority || null;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'No update data provided' });
    }

    const card = await cardService.updateCard(req.params.id, userId, updateData);
    res.json({ card });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Access denied to this board') {
        return res.status(403).json({ error: error.message });
      }
      if (error.message === 'Card not found') {
        return res.status(404).json({ error: error.message });
      }
    }
    console.error('Update card error:', error);
    res.status(500).json({ error: 'Failed to update card' });
  }
});

router.put('/cards/:id/move', async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { targetListId, position } = req.body;
    if (!targetListId) {
      return res.status(400).json({ error: 'Target list ID is required' });
    }

    if (position === undefined || typeof position !== 'number' || position < 0) {
      return res.status(400).json({ error: 'Valid position is required' });
    }

    const card = await cardService.moveCard(req.params.id, userId, { targetListId, position });
    res.json({ card });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Access denied to this board') {
        return res.status(403).json({ error: error.message });
      }
      if (error.message === 'Card not found' || error.message === 'List not found') {
        return res.status(404).json({ error: error.message });
      }
      if (error.message === 'Cannot move card between different boards') {
        return res.status(400).json({ error: error.message });
      }
    }
    console.error('Move card error:', error);
    res.status(500).json({ error: 'Failed to move card' });
  }
});

router.delete('/cards/:id', async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await cardService.deleteCard(req.params.id, userId);
    res.json({ message: 'Card deleted successfully' });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Access denied to this board') {
        return res.status(403).json({ error: error.message });
      }
      if (error.message === 'Card not found') {
        return res.status(404).json({ error: error.message });
      }
    }
    console.error('Delete card error:', error);
    res.status(500).json({ error: 'Failed to delete card' });
  }
});

router.post('/cards/:id/assignments', async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { userId: assigneeId } = req.body;
    if (!assigneeId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    await cardService.assignUser(req.params.id, userId, assigneeId);
    res.status(201).json({ message: 'User assigned successfully' });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Access denied to this board') {
        return res.status(403).json({ error: error.message });
      }
      if (error.message === 'User does not have access to this board') {
        return res.status(400).json({ error: error.message });
      }
      if (error.message === 'Card not found') {
        return res.status(404).json({ error: error.message });
      }
    }
    console.error('Assign user error:', error);
    res.status(500).json({ error: 'Failed to assign user' });
  }
});

router.delete('/cards/:id/assignments/:userId', async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await cardService.unassignUser(req.params.id, userId, req.params.userId);
    res.json({ message: 'User unassigned successfully' });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Access denied to this board') {
        return res.status(403).json({ error: error.message });
      }
      if (error.message === 'Card not found') {
        return res.status(404).json({ error: error.message });
      }
      if (error.message === 'User is not assigned to this card') {
        return res.status(404).json({ error: error.message });
      }
    }
    console.error('Unassign user error:', error);
    res.status(500).json({ error: 'Failed to unassign user' });
  }
});

export default router;
