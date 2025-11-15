import { useState } from 'react';
import { List, Card } from '../types';
import CardComponent from './CardComponent';
import './ListComponent.css';

interface ListComponentProps {
  list: List;
  cards: Card[];
  onAddCard: (listId: string, title: string) => void;
  onDeleteCard: (listId: string, cardId: string) => void;
  onDeleteList: (listId: string) => void;
}

const ListComponent = ({ list, cards, onAddCard, onDeleteCard, onDeleteList }: ListComponentProps) => {
  const [showAddCard, setShowAddCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');

  const handleAddCard = () => {
    if (!newCardTitle.trim()) return;
    onAddCard(list.id, newCardTitle.trim());
    setNewCardTitle('');
    setShowAddCard(false);
  };

  return (
    <div className="list">
      <div className="list-header">
        <h3>{list.name}</h3>
        <button
          className="list-delete-btn"
          onClick={() => {
            if (window.confirm(`Delete list "${list.name}"?`)) {
              onDeleteList(list.id);
            }
          }}
        >
          ×
        </button>
      </div>

      <div className="list-cards">
        {cards.map(card => (
          <CardComponent
            key={card.id}
            card={card}
            onDelete={() => onDeleteCard(list.id, card.id)}
          />
        ))}
      </div>

      {showAddCard ? (
        <div className="add-card-form">
          <textarea
            value={newCardTitle}
            onChange={(e) => setNewCardTitle(e.target.value)}
            placeholder="Enter card title..."
            autoFocus
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleAddCard();
              }
            }}
          />
          <div className="add-card-actions">
            <button onClick={handleAddCard}>Add Card</button>
            <button onClick={() => { setShowAddCard(false); setNewCardTitle(''); }}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button className="add-card-btn" onClick={() => setShowAddCard(true)}>
          + Add Card
        </button>
      )}
    </div>
  );
};

export default ListComponent;
