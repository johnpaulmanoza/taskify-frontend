import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Card as CardType } from '../../types';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { setCurrentCard } from '../../store/slices/cardsSlice';

interface CardProps {
  card: CardType;
  index: number;
}

const Card: React.FC<CardProps> = ({ card, index }) => {
  const dispatch = useAppDispatch();
  
  const handleCardClick = () => {
    dispatch(setCurrentCard(card));
  };
  
  return (
    <Draggable draggableId={`card-${card.id}`} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-white p-2 rounded shadow-sm mb-2 cursor-pointer ${
            snapshot.isDragging ? 'opacity-70' : ''
          }`}
          onClick={handleCardClick}
        >
          {/* Card labels */}
          {card.labels && card.labels.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {card.labels.map((label) => (
                <div
                  key={label.id}
                  className={`h-2 w-10 rounded-sm`}
                  style={{ backgroundColor: label.color }}
                  title={label.name}
                />
              ))}
            </div>
          )}
          
          {/* Card title */}
          <p className="text-sm font-medium">{card.title}</p>
          
          {/* Card description preview (if exists) */}
          {card.description && (
            <p className="text-xs text-gray-600 mt-1 line-clamp-2">
              {card.description}
            </p>
          )}
        </div>
      )}
    </Draggable>
  );
};

export default Card;