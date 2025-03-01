import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { addList } from '../../store/slices/listsSlice';
import { listService } from '../../services/listService';
import Button from '../ui/Button';

interface AddListProps {
  boardId: number;
  listsCount: number;
}

const AddList: React.FC<AddListProps> = ({ boardId, listsCount }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const dispatch = useAppDispatch();
  
  const handleAddClick = () => {
    setIsAdding(true);
  };
  
  const handleCancel = () => {
    setIsAdding(false);
    setTitle('');
  };
  
  const handleSubmit = async () => {
    if (title.trim()) {
      setIsSubmitting(true);
      
      try {
        const newList = await listService.createList({
          board_id: boardId,
          title: title.trim(),
          position: listsCount,
        });
        
        dispatch(addList(newList));
        setTitle('');
        setIsAdding(false);
      } catch (error) {
        console.error('Failed to add list:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };
  
  if (isAdding) {
    return (
      <div className="bg-gray-100 rounded-md w-72 p-2 flex-shrink-0">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter list title..."
          className="w-full p-2 border rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
        />
        <div className="flex items-center">
          <Button
            size="sm"
            onClick={handleSubmit}
            isLoading={isSubmitting}
          >
            Add list
          </Button>
          <button
            className="ml-2 p-1 text-gray-500 hover:text-gray-700 rounded"
            onClick={handleCancel}
          >
            <X size={16} />
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-72 flex-shrink-0">
      <button
        className="w-full bg-gray-100 bg-opacity-80 hover:bg-gray-200 text-gray-700 p-2 rounded-md flex items-center"
        onClick={handleAddClick}
      >
        <Plus size={16} className="mr-1" />
        <span>{listsCount === 0 ? 'Add a list' : 'Add another list'}</span>
      </button>
    </div>
  );
};

export default AddList;