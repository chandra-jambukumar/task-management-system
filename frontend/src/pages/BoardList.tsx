import { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { Board } from '../types';
import Modal from '../components/Modal';
import './BoardList.css';

const BoardList = () => {
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);
  const [boardName, setBoardName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
      setLoading(true);
      const response = await api.get('/boards');
      setBoards(response.data.boards);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch boards');
    } finally {
      setLoading(false);
    }
  };

  const handleBoardClick = (boardId: string) => {
    navigate(`/boards/${boardId}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleCreateBoard = async (e: FormEvent) => {
    e.preventDefault();
    if (!boardName.trim()) return;

    setSubmitting(true);
    try {
      const response = await api.post('/boards', { name: boardName.trim() });
      setBoards([...boards, response.data.board]);
      setShowCreateModal(false);
      setBoardName('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create board');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditBoard = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedBoard || !boardName.trim()) return;

    setSubmitting(true);
    try {
      const response = await api.put(`/boards/${selectedBoard.id}`, { name: boardName.trim() });
      setBoards(boards.map(b => b.id === selectedBoard.id ? response.data.board : b));
      setShowEditModal(false);
      setSelectedBoard(null);
      setBoardName('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update board');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBoard = async () => {
    if (!selectedBoard) return;

    setSubmitting(true);
    try {
      await api.delete(`/boards/${selectedBoard.id}`);
      setBoards(boards.filter(b => b.id !== selectedBoard.id));
      setShowDeleteModal(false);
      setSelectedBoard(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete board');
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (board: Board, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedBoard(board);
    setBoardName(board.name);
    setShowEditModal(true);
  };

  const openDeleteModal = (board: Board, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedBoard(board);
    setShowDeleteModal(true);
  };

  if (loading) {
    return (
      <div className="board-list-container">
        <div className="loading">Loading boards...</div>
      </div>
    );
  }

  return (
    <div className="board-list-container">
      <div className="board-list-header">
        <h1>My Boards</h1>
        <div className="header-actions">
          <span className="user-info">Welcome, {user?.name}</span>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="board-list-content">
        {error && <div className="error">{error}</div>}

        <div className="create-board-section">
          <button className="create-board-btn" onClick={() => setShowCreateModal(true)}>
            + Create New Board
          </button>
        </div>

        {boards.length === 0 ? (
          <div className="empty-state">
            <h2>No boards yet</h2>
            <p>Create your first board to get started!</p>
          </div>
        ) : (
          <div className="boards-grid">
            {boards.map((board) => (
              <div
                key={board.id}
                className="board-card"
                onClick={() => handleBoardClick(board.id)}
              >
                <h3>{board.name}</h3>
                <div className="board-card-meta">
                  {board.memberCount || 0} member{board.memberCount !== 1 ? 's' : ''}
                </div>
                <div className="board-card-actions">
                  <button
                    className="board-action-btn"
                    onClick={(e) => openEditModal(board, e)}
                  >
                    Edit
                  </button>
                  <button
                    className="board-action-btn delete"
                    onClick={(e) => openDeleteModal(board, e)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setBoardName('');
        }}
        title="Create New Board"
      >
        <form onSubmit={handleCreateBoard}>
          <div className="form-group">
            <label htmlFor="board-name">Board Name</label>
            <input
              id="board-name"
              type="text"
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
              required
              disabled={submitting}
              autoFocus
            />
          </div>
          <div className="modal-actions">
            <button type="submit" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Board'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowCreateModal(false);
                setBoardName('');
              }}
              disabled={submitting}
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedBoard(null);
          setBoardName('');
        }}
        title="Edit Board"
      >
        <form onSubmit={handleEditBoard}>
          <div className="form-group">
            <label htmlFor="edit-board-name">Board Name</label>
            <input
              id="edit-board-name"
              type="text"
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
              required
              disabled={submitting}
              autoFocus
            />
          </div>
          <div className="modal-actions">
            <button type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowEditModal(false);
                setSelectedBoard(null);
                setBoardName('');
              }}
              disabled={submitting}
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedBoard(null);
        }}
        title="Delete Board"
      >
        <p>Are you sure you want to delete "{selectedBoard?.name}"? This action cannot be undone.</p>
        <div className="modal-actions">
          <button
            className="delete-btn"
            onClick={handleDeleteBoard}
            disabled={submitting}
          >
            {submitting ? 'Deleting...' : 'Delete Board'}
          </button>
          <button
            onClick={() => {
              setShowDeleteModal(false);
              setSelectedBoard(null);
            }}
            disabled={submitting}
          >
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default BoardList;
