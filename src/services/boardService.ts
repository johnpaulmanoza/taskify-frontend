import { mockBoards } from './mockData';
import { Board } from '../types';

// Simulate API calls with promises and timeouts
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const boardService = {
  getBoards: async (userId: number): Promise<Board[]> => {
    await delay(800); // Simulate network delay
    return mockBoards.filter(board => board.user_id === userId);
  },
  
  getBoard: async (boardId: number): Promise<Board> => {
    await delay(500);
    const board = mockBoards.find(b => b.id === boardId);
    
    if (!board) {
      throw new Error('Board not found');
    }
    
    return board;
  },
  
  createBoard: async (board: Omit<Board, 'id' | 'created_at' | 'updated_at'>): Promise<Board> => {
    await delay(1000);
    
    const newBoard: Board = {
      ...board,
      id: Math.max(0, ...mockBoards.map(b => b.id)) + 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    mockBoards.push(newBoard);
    return newBoard;
  },
  
  updateBoard: async (boardId: number, updates: Partial<Board>): Promise<Board> => {
    await delay(800);
    
    const index = mockBoards.findIndex(b => b.id === boardId);
    
    if (index === -1) {
      throw new Error('Board not found');
    }
    
    const updatedBoard = {
      ...mockBoards[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    
    mockBoards[index] = updatedBoard;
    return updatedBoard;
  },
  
  deleteBoard: async (boardId: number): Promise<void> => {
    await delay(800);
    
    const index = mockBoards.findIndex(b => b.id === boardId);
    
    if (index === -1) {
      throw new Error('Board not found');
    }
    
    mockBoards.splice(index, 1);
  }
};