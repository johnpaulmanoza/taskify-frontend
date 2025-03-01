import React, { useState } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { MoreHorizontal, Plus, X } from 'lucide-react';
import { List as ListType, Card as CardType } from '../../types';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { updateList, deleteList } from '../../store/slices/listsSlice';
import { addCard } from '../../store/slices/cardsSlice';
import { listService } from '../../services/listService';
import { cardService } from '../../services/cardService';
import Card from '../cards/Card';
import Button from '../ui/Button';

interface ListProps {
  list: ListType;
  cards: CardType[];
  index: number;
}

const List: React.FC<ListProps> = ({ list, cards, index }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(list.title);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  
  const dispatch = useAppDispatch();
  
  const handleTitleClick = () => {
    setIsEditing(true);
  };
  
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };
  
  const handleTitleBlur = async () => {
    if (title.trim() !== list.title) {
      try {
        const updatedList = await listService.updateList(list.id, { title: title.trim() });
        dispatch(updateList(updatedList));
      } catch (error) {
        console.error('Failed to update list title:', error);
        setTitle(list.title);
      }
    }
    setIsEditing(false);
  };
  
  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    } else if (e.key === 'Escape') {
      setTitle(list.title);
      setIsEditing(false);
    }
  };
  
  const handleAddCardClick = () => {
    setIsAddingCard(true);
  };
  
  const handleAddCardCancel = () => {
    setIsAddingCard(false);
    setNewCardTitle('');
  };
  
  const handleAddCardSubmit = async () => {
    if (newCardTitle.trim()) {
      try {
        const newCard = await cardService.createCard({
          list_id: list.id,
          title: newCardTitle.trim(),
          description: '',
          position: cards.length,
        });
        
        dispatch(addCard(newCard));
        setNewCardTitle('');
        setIsAddingCard(false);
      } catch (error) {
        console.error('Failed to add card:', error);
      }
    }
  };
  
  const handleDeleteList = async () => {
    if (window.confirm(`Are you sure you want to delete the list "${list.title}"?`)) {
      try {
        await listService.deleteList(list.id);
        dispatch(deleteList(list.id));
      } catch (error) {
        console.error('Failed to delete list:', error);
      }
    }
    setShowMenu(false);
  };
  
  return (
    <Draggable draggableId={`list-${list.id}`} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="bg-gray-100 rounded-md w-72 flex-shrink-0 max-h-full flex flex-col"
        >
          <div
            {...provided.dragHandleProps}
            className="p-2 flex items-center justify-between"
          >
            {isEditing ? (
              <input
                type="text"
                value={title}
                onChange={handleTitleChange}
                onBlur={handleTitleBlur}
                onKeyDown={handleTitleKeyDown}
                className="font-bold px-2 py-1 w-full bg-white rounded border border-blue-500 focus:outline-none"
                autoFocus
              />
            ) : (
              <h3
                className="font-bold px-2 py-1 cursor-pointer"
                onClick={handleTitleClick}
              >
                {list.title}
              </h3>
            )}
            
            <div className="relative">
              <button
                className="p-1 text-gray-500 hover:text-gray-700 rounded"
                onClick={() => setShowMenu(!showMenu)}
              >
                <MoreHorizontal size={16} />
              </button>
              
              {showMenu && (
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10">
                  <div className="py-1">
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={handleDeleteList}
                    >
                      Delete list
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <Droppable droppableId={`list-${list.id}`} type="CARD">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`flex-grow overflow-y-auto p-2 ${
                  snapshot.isDraggingOver ? 'bg-gray-200' : ''
                }`}
                style={{ minHeight: '50px' }}
              >
                {cards.map((card, index) => (
                  <Card key={card.id} card={card} index={index} />
                ))}
                {provided.placeholder}
                
                {isAddingCard && (
                  <div className="bg-white p-2 rounded shadow-sm mb-2">
                    <textarea
                      value={newCardTitle}
                      onChange={(e) => setNewCardTitle(e.target.value)}
                      placeholder="Enter a title for this card..."
                      className="w-full p-2 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      autoFocus
                    />
                    <div className="flex items-center mt-2">
                      <Button
                        size="sm"
                        onClick={handleAddCardSubmit}
                      >
                        Add card
                      </Button>
                      <button
                        className="ml-2 p-1 text-gray-500 hover:text-gray-700 rounded"
                        onClick={handleAddCardCancel}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </Droppable>
          
          {!isAddingCard && (
            <div className="p-2">
              <button
                className="w-full flex items-center p-2 text-gray-600 hover:bg-gray-200 rounded"
                onClick={handleAddCardClick}
              >
                <Plus size={16} className="mr-1" />
                <span>Add a card</span>
              </button>
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
};

export default List;