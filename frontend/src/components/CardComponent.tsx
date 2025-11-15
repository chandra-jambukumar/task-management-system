import { Card } from '../types';
import './CardComponent.css';

interface CardComponentProps {
  card: Card;
  onDelete: () => void;
}

const CardComponent = ({ card, onDelete }: CardComponentProps) => {
  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return '#dc3545';
      case 'medium': return '#ffc107';
      case 'low': return '#28a745';
      default: return '#6c757d';
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h4>{card.title}</h4>
        <button className="card-delete-btn" onClick={onDelete}>
          ×
        </button>
      </div>

      {card.description && (
        <p className="card-description">{card.description}</p>
      )}

      <div className="card-footer">
        {card.priority && (
          <span
            className="card-priority"
            style={{ backgroundColor: getPriorityColor(card.priority) }}
          >
            {card.priority}
          </span>
        )}

        {card.assignedUsers && card.assignedUsers.length > 0 && (
          <div className="card-assigned-users">
            {card.assignedUsers.map(user => (
              <span key={user.id} className="user-avatar" title={user.name}>
                {user.name.charAt(0).toUpperCase()}
              </span>
            ))}
          </div>
        )}

        {card.commentCount !== undefined && card.commentCount > 0 && (
          <span className="card-comments">💬 {card.commentCount}</span>
        )}
      </div>
    </div>
  );
};

export default CardComponent;
