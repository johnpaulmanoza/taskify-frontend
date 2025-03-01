import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { Star, MoreHorizontal } from 'lucide-react';
import { useAppSelector } from '../hooks/useAppSelector';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { setCurrentBoard } from '../store/slices/boardsSlice';
import { fetchListsStart, fetchListsSuccess, fetchListsFailure, reorderLists } from '../store/slices/listsSlice';
import { fetchCardsStart, fetchCardsSuccess, fetchCardsFailure, reorderCards } from '../store/slices/cardsSlice';
import { fetchLabelsStart, fetchLabelsSuccess, fetchLabelsFailure, fetchCardLabelsSuccess } from '../store/slices/labelsSlice';
import { boardService } from '../services/boardService';
import { listService } from '../services/listService';
import { cardService } from '../services/cardService';
import { labelService } from '../services/labelService';
import Header from '../components/layout/Header';
import List from '../components/lists/List';
import AddList from '../components/lists/AddList';
import CardModal from '../components/cards/CardModal';

const BoardPage: React.FC = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { currentBoard } = useAppSelector((state) => state.boards);
  const { lists } = useAppSelector((state) => state.lists);
  const { cards } = useAppSelector((state) => state.cards);
  
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchBoardData = async () => {
      if (!boardId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Fetch board details
        const board = await boardService.getBoard(parseInt(boardId));
        dispatch(setCurrentBoard(board));
        
        // Fetch lists for the board
        dispatch(fetchListsStart());
        const boardLists = await listService.getLists(board.id);
        dispatch(fetchListsSuccess(boardLists));
        
        // Fetch cards for all lists
        dispatch(fetchCardsStart());
        const allCards = await Promise.all(
          boardLists.map(list => cardService.getCards(list.id))
        );
        dispatch(fetchCardsSuccess(allCards.flat()));
        
        // Fetch labels and card-label relationships
        dispatch(fetchLabelsStart());
        const labels = await labelService.getLabels();
        dispatch(fetchLabelsSuccess(labels));
        
        const cardLabels = await labelService.getCardLabels();
        dispatch(fetchCardLabelsSuccess(cardLabels));
        
        setLoading(false);
      } catch (err) {
        setError((err as Error).message);
        dispatch(fetchListsFailure((err as Error).message));
        dispatch(fetchCardsFailure((err as Error).message));
        dispatch(fetchLabelsFailure((err as Error).message));
        setLoading(false);
      }
    };
    
    fetchBoardData();
  }, [boardId, dispatch]);
  
  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId, type } = result;
    
    // If dropped outside a droppable area
    if (!destination) return;
    
    // If dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    
    // Handle list reordering
    if (type === 'LIST') {
      const listId = parseInt(draggableId.replace('list-', ''));
      const newLists = [...lists];
      const [movedList] = newLists.splice(source.index, 1);
      newLists.splice(destination.index, 0, movedList);
      
      // Update positions
      const updatedLists = newLists.map((list, index) => ({
        ...list,
        position: index,
      }));
      
      // Optimistically update UI
      dispatch(reorderLists(updatedLists));
      
      // Update in backend
      try {
        await listService.reorderLists(
          updatedLists.map(list => ({ id: list.id, position: list.position }))
        );
      } catch (error) {
        console.error('Failed to reorder lists:', error);
        // Revert to original order if failed
        dispatch(reorderLists(lists));
      }
      
      return;
    }
    
    // Handle card reordering
    if (type === 'CARD') {
      const cardId = parseInt(draggableId.replace('card-', ''));
      const sourceListId = parseInt(source.droppableId.replace('list-', ''));
      const destinationListId = parseInt(destination.droppableId.replace('list-', ''));
      
      // Get cards from source and destination lists
      const sourceCards = cards.filter(card => card.list_id === sourceListId)
        .sort((a, b) => a.position - b.position);
      
      const destinationCards = sourceListId === destinationListId
        ? sourceCards
        : cards.filter(card => card.list_id === destinationListId)
            .sort((a, b) => a.position - b.position);
      
      // Create a copy of all cards
      const newCards = [...cards];
      
      // Find the moved card
      const movedCardIndex = newCards.findIndex(card => card.id === cardId);
      const movedCard = { ...newCards[movedCardIndex] };
      
      // Update the moved card's list_id if moving between lists
      if (sourceListId !== destinationListId) {
        movedCard.list_id = destinationListId;
      }
      
      // Remove the card from its original position
      newCards.splice(movedCardIndex, 1);
      
      // Find where to insert the card in the destination list
      let insertIndex = newCards.findIndex(card => 
        card.list_id === destinationListId && card.position >= destination.index
      );
      
      if (insertIndex === -1) {
        // If no card found at or after the destination index, append to the end
        insertIndex = newCards.length;
      }
      
      // Insert the card at the new position
      newCards.splice(insertIndex, 0, movedCard);
      
      // Update positions for all affected cards
      const updatedCards = newCards.map((card, index) => {
        if (card.list_id === sourceListId || card.list_id === destinationListId) {
          const listCards = newCards.filter(c => c.list_id === card.list_id)
            .sort((a, b) => newCards.indexOf(a) - newCards.indexOf(b));
          
          const newPosition = listCards.findIndex(c => c.id === card.id);
          
          return {
            ...card,
            position: newPosition,
          };
        }
        return card;
      });
      
      // Optimistically update UI
      dispatch(reorderCards(updatedCards));
      
      // Update in backend
      try {
        const cardsToUpdate = updatedCards.filter(
          card => card.list_id === sourceListId || card.list_id === destinationListId
        );
        
        await cardService.reorderCards(
          cardsToUpdate.map(card => ({
            id: card.id,
            list_id: card.list_id,
            position: card.position,
          }))
        );
      } catch (error) {
        console.error('Failed to reorder cards:', error);
        // Revert to original order if failed
        dispatch(reorderCards(cards));
      }
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }
  
  if (error || !currentBoard) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
            <p className="font-bold">Error</p>
            <p>{error || 'Board not found'}</p>
            <button
              className="mt-2 text-blue-600 hover:underline"
              onClick={() => navigate('/boards')}
            >
              Back to boards
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // Create sorted lists array to avoid mutating the original array
  const sortedLists = [...lists].sort((a, b) => a.position - b.position);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-blue-100 flex flex-col">
        {/* Board header */}
        <div className="bg-blue-50 border-b border-blue-200 p-4">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900 mr-3">
                {currentBoard.title}
              </h1>
              <button className="text-gray-500 hover:text-yellow-500">
                <Star size={20} />
              </button>
            </div>
            
            <div>
              <button className="flex items-center text-gray-700 hover:bg-gray-200 px-3 py-1 rounded">
                <MoreHorizontal size={16} className="mr-1" />
                <span>Show menu</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Board content */}
        <div className="flex-grow p-4 overflow-x-auto">
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="all-lists" direction="horizontal" type="LIST">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex items-start h-full"
                >
                  {sortedLists.map((list, index) => {
                    // Create a sorted cards array for this list
                    const listCards = [...cards]
                      .filter(card => card.list_id === list.id)
                      .sort((a, b) => a.position - b.position);
                    
                    return (
                      <List
                        key={list.id}
                        list={list}
                        cards={listCards}
                        index={index}
                      />
                    );
                  })}
                  {provided.placeholder}
                  
                  <AddList boardId={currentBoard.id} listsCount={lists.length} />
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </main>
      
      {/* Card modal for editing */}
      <CardModal />
    </div>
  );
};

export default BoardPage;