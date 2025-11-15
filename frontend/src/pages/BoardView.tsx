import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { Board, List, Card } from '../types';
import ListComponent from '../components/ListComponent';
import './BoardView.css';

const BoardView = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const [board, setBoard] = useState<Board | null>(null);
  const [lists, setLists] = useState<List[]>([]);
  const [cards, setCards] = useState<Record<string, Card[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddList, setShowAddList] = useState(false);
  const [newListName, setNewListName] = useState('');
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (boardId) {
      fetchBoardData();
    }
  }, [boardId]);

  const fetchBoardData = async () => {
    try {
      setLoading(true);
      const [boardRes, listsRes] = await Promise.all([
        api.get(`/boards/${boardId}`),
        api.get(`/boards/${boardId}/lists`)
      ]);

      setBoard(boardRes.data.board);
      setLists(listsRes.data.lists);

      const cardsData: Record<string, Card[]> = {};
      for (const list of listsRes.data.lists) {
        const cardsRes = await api.get(`/lists/${list.id}/cards`);
        cardsData[list.id] = cardsRes.data.cards;
      }
      setCards(cardsData);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch board data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddList = async () => {
    if (!newListName.trim() || !boardId) return;

    try {
      const response = await api.post(`/boards/${boardId}/lists`, { name: newListName.trim() });
      setLists([...lists, response.data.list]);
      setCards({ ...cards, [response.data.list.id]: [] });
      setNewListName('');
      setShowAddList(false);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create list');
    }
  };

  const handleDeleteList = async (listId: string) => {
    try {
      await api.delete(`/lists/${listId}`);
      setLists(lists.filter(l => l.id !== listId));
      const newCards = { ...cards };
      delete newCards[listId];
      setCards(newCards);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete list');
    }
  };

  const handleAddCard = async (listId: string, title: string) => {
    try {
      const response = await api.post(`/lists/${listId}/cards`, { title });
      setCards({
        ...cards,
        [listId]: [...(cards[listId] || []), response.data.card]
      });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create card');
    }
  };

  const handleDeleteCard = async (listId: string, cardId: string) => {
    try {
      await api.delete(`/cards/${cardId}`);
      setCards({
        ...cards,
        [listId]: cards[listId].filter(c => c.id !== cardId)
      });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete card');
    }
  };

  if (loading) {
    return (
      <div className="board-view-container">
        <div className="loading">Loading board...</div>
      </div>
    );
  }

  if (!board) {
    return (
      <div className="board-view-container">
        <div className="error">Board not found</div>
      </div>
    );
  }

  return (
    <div className="board-view-container">
      <div className="board-header">
        <div className="board-header-left">
          <button className="back-btn" onClick={() => navigate('/boards')}>
            ← Back to Boards
          </button>
          <h1>{board.name}</h1>
        </div>
        <button className="logout-btn" onClick={() => { logout(); navigate('/login'); }}>
          Logout
        </button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="board-content">
        <div className="lists-container">
          {lists.map(list => (
            <ListComponent
              key={list.id}
              list={list}
              cards={cards[list.id] || []}
              onAddCard={handleAddCard}
              onDeleteCard={handleDeleteCard}
              onDeleteList={handleDeleteList}
            />
          ))}

          {showAddList ? (
            <div className="add-list-form">
              <input
                type="text"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="Enter list name..."
                autoFocus
                onKeyPress={(e) => e.key === 'Enter' && handleAddList()}
              />
              <div className="add-list-actions">
                <button onClick={handleAddList}>Add List</button>
                <button onClick={() => { setShowAddList(false); setNewListName(''); }}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button className="add-list-btn" onClick={() => setShowAddList(true)}>
              + Add List
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BoardView;
