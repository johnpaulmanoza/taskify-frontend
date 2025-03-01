import { mockLists } from './mockData';
import { List } from '../types';

// Simulate API calls with promises and timeouts
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const listService = {
  getLists: async (boardId: number): Promise<List[]> => {
    await delay(800); // Simulate network delay
    return mockLists
      .filter(list => list.board_id === boardId)
      .sort((a, b) => a.position - b.position);
  },
  
  createList: async (list: Omit<List, 'id' | 'created_at' | 'updated_at'>): Promise<List> => {
    await delay(800);
    
    const newList: List = {
      ...list,
      id: Math.max(0, ...mockLists.map(l => l.id)) + 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    mockLists.push(newList);
    return newList;
  },
  
  updateList: async (listId: number, updates: Partial<List>): Promise<List> => {
    await delay(500);
    
    const index = mockLists.findIndex(l => l.id === listId);
    
    if (index === -1) {
      throw new Error('List not found');
    }
    
    const updatedList = {
      ...mockLists[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    
    mockLists[index] = updatedList;
    return updatedList;
  },
  
  deleteList: async (listId: number): Promise<void> => {
    await delay(500);
    
    const index = mockLists.findIndex(l => l.id === listId);
    
    if (index === -1) {
      throw new Error('List not found');
    }
    
    mockLists.splice(index, 1);
  },
  
  reorderLists: async (lists: Pick<List, 'id' | 'position'>[]): Promise<List[]> => {
    await delay(800);
    
    // Update positions of multiple lists
    lists.forEach(({ id, position }) => {
      const index = mockLists.findIndex(l => l.id === id);
      if (index !== -1) {
        mockLists[index].position = position;
        mockLists[index].updated_at = new Date().toISOString();
      }
    });
    
    // Return the updated lists for the board
    const boardId = mockLists.find(l => l.id === lists[0].id)?.board_id;
    return mockLists
      .filter(list => list.board_id === boardId)
      .sort((a, b) => a.position - b.position);
  }
};