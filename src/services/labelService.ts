import { mockLabels, mockCardLabels } from './mockData';
import { Label, CardLabel } from '../types';

// Simulate API calls with promises and timeouts
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const labelService = {
  getLabels: async (): Promise<Label[]> => {
    await delay(800); // Simulate network delay
    return [...mockLabels];
  },
  
  getCardLabels: async (): Promise<CardLabel[]> => {
    await delay(500);
    return [...mockCardLabels];
  },
  
  createLabel: async (label: Omit<Label, 'id' | 'created_at'>): Promise<Label> => {
    await delay(800);
    
    const newLabel: Label = {
      ...label,
      id: Math.max(0, ...mockLabels.map(l => l.id)) + 1,
      created_at: new Date().toISOString(),
    };
    
    mockLabels.push(newLabel);
    return newLabel;
  },
  
  updateLabel: async (labelId: number, updates: Partial<Label>): Promise<Label> => {
    await delay(500);
    
    const index = mockLabels.findIndex(l => l.id === labelId);
    
    if (index === -1) {
      throw new Error('Label not found');
    }
    
    const updatedLabel = {
      ...mockLabels[index],
      ...updates,
    };
    
    mockLabels[index] = updatedLabel;
    return updatedLabel;
  },
  
  deleteLabel: async (labelId: number): Promise<void> => {
    await delay(500);
    
    const index = mockLabels.findIndex(l => l.id === labelId);
    
    if (index === -1) {
      throw new Error('Label not found');
    }
    
    mockLabels.splice(index, 1);
    
    // Remove card-label relationships
    const cardLabelIndices = mockCardLabels
      .map((cl, index) => cl.label_id === labelId ? index : -1)
      .filter(index => index !== -1)
      .sort((a, b) => b - a); // Sort in descending order to remove from end first
    
    cardLabelIndices.forEach(index => {
      mockCardLabels.splice(index, 1);
    });
  }
};