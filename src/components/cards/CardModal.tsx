import React, { useState, useEffect } from 'react';
import { AlignLeft, Tag, X } from 'lucide-react';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { updateCard, deleteCard, setCurrentCard } from '../../store/slices/cardsSlice';
import { addCardLabel, removeCardLabel } from '../../store/slices/labelsSlice';
import { cardService } from '../../services/cardService';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Textarea from '../ui/Textarea';

const CardModal: React.FC = () => {
  const { currentCard } = useAppSelector((state) => state.cards);
  const { labels } = useAppSelector((state) => state.labels);
  const { lists } = useAppSelector((state) => state.lists);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [showLabelPicker, setShowLabelPicker] = useState(false);
  
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    if (currentCard) {
      setTitle(currentCard.title);
      setDescription(currentCard.description);
    }
  }, [currentCard]);
  
  if (!currentCard) return null;
  
  const list = lists.find((l) => l.id === currentCard.list_id);
  
  const handleClose = () => {
    dispatch(setCurrentCard(null));
  };
  
  const handleTitleChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTitle(e.target.value);
  };
  
  const handleTitleBlur = async () => {
    if (title.trim() !== currentCard.title) {
      try {
        const updatedCard = await cardService.updateCard(currentCard.id, { title: title.trim() });
        dispatch(updateCard(updatedCard));
      } catch (error) {
        console.error('Failed to update card title:', error);
        setTitle(currentCard.title);
      }
    }
  };
  
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };
  
  const handleSaveDescription = async () => {
    try {
      const updatedCard = await cardService.updateCard(currentCard.id, { description: description.trim() });
      dispatch(updateCard(updatedCard));
      setIsEditingDescription(false);
    } catch (error) {
      console.error('Failed to update card description:', error);
      setDescription(currentCard.description);
    }
  };
  
  const handleCancelDescription = () => {
    setDescription(currentCard.description);
    setIsEditingDescription(false);
  };
  
  const handleDeleteCard = async () => {
    if (window.confirm('Are you sure you want to delete this card?')) {
      try {
        await cardService.deleteCard(currentCard.id);
        dispatch(deleteCard(currentCard.id));
        handleClose();
      } catch (error) {
        console.error('Failed to delete card:', error);
      }
    }
  };
  
  const handleToggleLabel = async (labelId: number) => {
    try {
      const hasLabel = currentCard.labels?.some((label) => label.id === labelId);
      
      if (hasLabel) {
        await cardService.removeLabel(currentCard.id, labelId);
        dispatch(removeCardLabel({ card_id: currentCard.id, label_id: labelId }));
      } else {
        await cardService.addLabel(currentCard.id, labelId);
        dispatch(addCardLabel({ card_id: currentCard.id, label_id: labelId }));
      }
      
      // Refresh the card to get updated labels
      const updatedCard = await cardService.getCard(currentCard.id);
      dispatch(updateCard(updatedCard));
    } catch (error) {
      console.error('Failed to toggle label:', error);
    }
  };
  
  return (
    <Modal isOpen={!!currentCard} onClose={handleClose} title="" size="lg">
      <div className="space-y-4">
        {/* Card title */}
        <div>
          <Textarea
            value={title}
            onChange={handleTitleChange}
            onBlur={handleTitleBlur}
            className="text-xl font-bold resize-none"
            fullWidth
          />
          <p className="text-sm text-gray-600 mt-1">
            in list <span className="font-medium">{list?.title}</span>
          </p>
        </div>
        
        {/* Card labels */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Labels</h4>
          <div className="flex flex-wrap gap-2 mb-2">
            {currentCard.labels && currentCard.labels.length > 0 ? (
              currentCard.labels.map((label) => (
                <div
                  key={label.id}
                  className="px-2 py-1 rounded text-white text-xs flex items-center"
                  style={{ backgroundColor: label.color }}
                >
                  {label.name}
                  <button
                    className="ml-1 opacity-70 hover:opacity-100"
                    onClick={() => handleToggleLabel(label.id)}
                  >
                    <X size={12} />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No labels</p>
            )}
          </div>
          
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setShowLabelPicker(!showLabelPicker)}
          >
            <Tag size={14} className="mr-1" />
            {showLabelPicker ? 'Hide labels' : 'Add label'}
          </Button>
          
          {showLabelPicker && (
            <div className="mt-2 p-2 bg-gray-50 rounded">
              <h5 className="text-sm font-medium mb-2">Available labels</h5>
              <div className="space-y-1">
                {labels.map((label) => {
                  const isSelected = currentCard.labels?.some((l) => l.id === label.id);
                  return (
                    <div
                      key={label.id}
                      className={`px-2 py-1 rounded cursor-pointer flex items-center ${
                        isSelected ? 'ring-2 ring-blue-500' : 'hover:bg-gray-100'
                      }`}
                      onClick={() => handleToggleLabel(label.id)}
                    >
                      <div
                        className="w-8 h-2 rounded-sm mr-2"
                        style={{ backgroundColor: label.color }}
                      />
                      <span className="text-sm">{label.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        
        {/* Card description */}
        <div>
          <div className="flex items-center mb-2">
            <AlignLeft size={16} className="mr-2" />
            <h4 className="text-sm font-medium text-gray-700">Description</h4>
          </div>
          
          {isEditingDescription ? (
            <div>
              <Textarea
                value={description}
                onChange={handleDescriptionChange}
                placeholder="Add a more detailed description..."
                rows={4}
                fullWidth
                autoFocus
              />
              <div className="flex mt-2 space-x-2">
                <Button size="sm" onClick={handleSaveDescription}>
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleCancelDescription}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div
              className="p-2 bg-gray-50 rounded min-h-[80px] cursor-pointer hover:bg-gray-100"
              onClick={() => setIsEditingDescription(true)}
            >
              {description ? (
                <p className="text-sm whitespace-pre-wrap">{description}</p>
              ) : (
                <p className="text-sm text-gray-500">Add a more detailed description...</p>
              )}
            </div>
          )}
        </div>
        
        {/* Actions */}
        <div className="pt-4 border-t border-gray-200">
          <Button
            variant="danger"
            size="sm"
            onClick={handleDeleteCard}
          >
            Delete card
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CardModal;