import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { addBoard } from '../../store/slices/boardsSlice';
import { boardService } from '../../services/boardService';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';

interface CreateBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateBoardModal: React.FC<CreateBoardModalProps> = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Board title is required');
      return;
    }
    
    if (!user) {
      setError('You must be logged in to create a board');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const newBoard = await boardService.createBoard({
        user_id: user.id,
        title: title.trim(),
        description: description.trim(),
      });
      
      dispatch(addBoard(newBoard));
      onClose();
      navigate(`/board/${newBoard.id}`);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create board">
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <Input
            label="Board title"
            id="board-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter board title"
            required
            fullWidth
            autoFocus
          />
          
          <Textarea
            label="Description (optional)"
            id="board-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a description"
            rows={3}
            fullWidth
          />
          
          {error && (
            <p className="text-red-600 text-sm">{error}</p>
          )}
          
          <div className="flex justify-end space-x-2 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isSubmitting}
            >
              Create
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default CreateBoardModal;