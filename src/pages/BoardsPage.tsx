import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useAppSelector } from '../hooks/useAppSelector';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { fetchBoardsStart, fetchBoardsSuccess, fetchBoardsFailure } from '../store/slices/boardsSlice';
import { boardService } from '../services/boardService';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import BoardCard from '../components/boards/BoardCard';
import CreateBoardModal from '../components/boards/CreateBoardModal';

const BoardsPage: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const { user } = useAppSelector((state) => state.auth);
  const { boards, loading, error } = useAppSelector((state) => state.boards);
  
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    const fetchBoards = async () => {
      dispatch(fetchBoardsStart());
      
      try {
        const userBoards = await boardService.getBoards(user.id);
        dispatch(fetchBoardsSuccess(userBoards));
      } catch (error) {
        dispatch(fetchBoardsFailure((error as Error).message));
      }
    };
    
    fetchBoards();
  }, [dispatch, user, navigate]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Your boards</h1>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <p>{error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {boards.map((board) => (
                <BoardCard key={board.id} board={board} />
              ))}
              
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-gray-100 hover:bg-gray-200 rounded-md h-24 p-4 flex items-center justify-center text-gray-700 transition-colors duration-200"
              >
                <Plus className="mr-2" />
                <span>Create new board</span>
              </button>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
      
      <CreateBoardModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};

export default BoardsPage;