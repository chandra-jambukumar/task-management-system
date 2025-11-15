import { Request, Response, NextFunction } from 'express';
import boardRepository from '../repositories/boardRepository';

export async function requireBoardAccess(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user?.userId;
    const boardId = req.params.id || req.params.boardId;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (!boardId) {
      res.status(400).json({ error: 'Board ID is required' });
      return;
    }

    const hasAccess = await boardRepository.hasMemberAccess(boardId, userId);
    if (!hasAccess) {
      res.status(403).json({ error: 'Access denied to this board' });
      return;
    }

    next();
  } catch (error) {
    console.error('Board access check error:', error);
    res.status(500).json({ error: 'Failed to verify board access' });
  }
}

export async function requireBoardOwner(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user?.userId;
    const boardId = req.params.id || req.params.boardId;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (!boardId) {
      res.status(400).json({ error: 'Board ID is required' });
      return;
    }

    const isOwner = await boardRepository.isOwner(boardId, userId);
    if (!isOwner) {
      res.status(403).json({ error: 'Only the board owner can perform this action' });
      return;
    }

    next();
  } catch (error) {
    console.error('Board owner check error:', error);
    res.status(500).json({ error: 'Failed to verify board ownership' });
  }
}
