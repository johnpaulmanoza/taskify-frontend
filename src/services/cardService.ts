import { mockCards, mockCardLabels, mockLabels } from './mockData';
import { Card, Label } from '../types';

// Simulate API calls with promises and timeouts
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const cardService = {
  getCards: async (listId: number): Promise<Card[]> => {
    await delay(800); // Simulate network delay
    
    // Get cards for the list
    const cards = mockCards
      .filter(card => card.list_id === listId)
      .sort((a, b) => a.position - b.position);
    
    // Attach labels to each card
    return cards.map(card => {
      const labelIds = mockCardLabels
        .filter(cl => cl.card_id === card.id)
        .map(cl => cl.label_id);
      
      const cardLabels = mockLabels.filter(label => labelIds.includes(label.id));
      
      return {
        ...card,
        labels: cardLabels,
      };
    });
  },
  
  getCard: async (cardId: number): Promise<Card> => {
    await delay(500);
    
    const card = mockCards.find(c => c.id === cardId);
    
    if (!card) {
      throw new Error('Card not found');
    }
    
    // Attach labels to the card
    const labelIds = mockCardLabels
      .filter(cl => cl.card_id === card.id)
      .map(cl => cl.label_id);
    
    const cardLabels = mockLabels.filter(label => labelIds.includes(label.id));
    
    return {
      ...card,
      labels: cardLabels,
    };
  },
  
  createCard: async (card: Omit<Card, 'id' | 'created_at' | 'updated_at'>): Promise<Card> => {
    await delay(800);
    
    const newCard: Card = {
      ...card,
      id: Math.max(0, ...mockCards.map(c => c.id)) + 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    mockCards.push(newCard);
    return newCard;
  },
  
  updateCard: async (cardId: number, updates: Partial<Card>): Promise<Card> => {
    await delay(500);
    
    const index = mockCards.findIndex(c => c.id === cardId);
    
    if (index === -1) {
      throw new Error('Card not found');
    }
    
    const updatedCard = {
      ...mockCards[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    
    mockCards[index] = updatedCard;
    
    // Get labels for the card
    const labelIds = mockCardLabels
      .filter(cl => cl.card_id === cardId)
      .map(cl => cl.label_id);
    
    const cardLabels = mockLabels.filter(label => labelIds.includes(label.id));
    
    return {
      ...updatedCard,
      labels: cardLabels,
    };
  },
  
  deleteCard: async (cardId: number): Promise<void> => {
    await delay(500);
    
    const index = mockCards.findIndex(c => c.id === cardId);
    
    if (index === -1) {
      throw new Error('Card not found');
    }
    
    mockCards.splice(index, 1);
    
    // Remove card-label relationships
    const cardLabelIndices = mockCardLabels
      .map((cl, index) => cl.card_id === cardId ? index : -1)
      .filter(index => index !== -1)
      .sort((a, b) => b - a); // Sort in descending order to remove from end first
    
    cardLabelIndices.forEach(index => {
      mockCardLabels.splice(index, 1);
    });
  },
  
  reorderCards: async (cards: Pick<Card, 'id' | 'list_id' | 'position'>[]): Promise<Card[]> => {
    await delay(800);
    
    // Update positions of multiple cards
    cards.forEach(({ id, list_id, position }) => {
      const index = mockCards.findIndex(c => c.id === id);
      if (index !== -1) {
        mockCards[index].list_id = list_id;
        mockCards[index].position = position;
        mockCards[index].updated_at = new Date().toISOString();
      }
    });
    
    // Return all updated cards with their labels
    return cards.map(({ id }) => {
      const card = mockCards.find(c => c.id === id)!;
      
      // Get labels for the card
      const labelIds = mockCardLabels
        .filter(cl => cl.card_id === id)
        .map(cl => cl.label_id);
      
      const cardLabels = mockLabels.filter(label => labelIds.includes(label.id));
      
      return {
        ...card,
        labels: cardLabels,
      };
    });
  },
  
  addLabel: async (cardId: number, labelId: number): Promise<Label[]> => {
    await delay(500);
    
    // Check if card exists
    const cardExists = mockCards.some(c => c.id === cardId);
    if (!cardExists) {
      throw new Error('Card not found');
    }
    
    // Check if label exists
    const label = mockLabels.find(l => l.id === labelId);
    if (!label) {
      throw new Error('Label not found');
    }
    
    // Check if relationship already exists
    const relationshipExists = mockCardLabels.some(
      cl => cl.card_id === cardId && cl.label_id === labelId
    );
    
    if (!relationshipExists) {
      mockCardLabels.push({ card_id: cardId, label_id: labelId });
    }
    
    // Return all labels for the card
    const labelIds = mockCardLabels
      .filter(cl => cl.card_id === cardId)
      .map(cl => cl.label_id);
    
    return mockLabels.filter(label => labelIds.includes(label.id));
  },
  
  removeLabel: async (cardId: number, labelId: number): Promise<Label[]> => {
    await delay(500);
    
    // Find and remove the relationship
    const index = mockCardLabels.findIndex(
      cl => cl.card_id === cardId && cl.label_id === labelId
    );
    
    if (index !== -1) {
      mockCardLabels.splice(index, 1);
    }
    
    // Return all labels for the card
    const labelIds = mockCardLabels
      .filter(cl => cl.card_id === cardId)
      .map(cl => cl.label_id);
    
    return mockLabels.filter(label => labelIds.includes(label.id));
  }
};