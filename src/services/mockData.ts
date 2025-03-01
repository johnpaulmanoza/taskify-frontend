import { User, Board, List, Card, Label, CardLabel } from '../types';

// Mock user data
export const mockUsers: User[] = [
  {
    id: 1,
    username: 'johndoe',
    email: 'john@example.com',
    created_at: new Date().toISOString(),
  },
];

// Mock board data
export const mockBoards: Board[] = [
  {
    id: 1,
    user_id: 1,
    title: 'Project Alpha',
    description: 'Main project board for Alpha team',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    user_id: 1,
    title: 'Marketing Campaign',
    description: 'Q3 Marketing initiatives',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    user_id: 1,
    title: 'Personal Tasks',
    description: 'My personal to-do list',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Mock list data
export const mockLists: List[] = [
  {
    id: 1,
    board_id: 1,
    title: 'To Do',
    position: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    board_id: 1,
    title: 'In Progress',
    position: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    board_id: 1,
    title: 'Done',
    position: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Mock label data
export const mockLabels: Label[] = [
  {
    id: 1,
    name: 'Bug',
    color: 'red',
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    name: 'Feature',
    color: 'green',
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    name: 'Enhancement',
    color: 'blue',
    created_at: new Date().toISOString(),
  },
  {
    id: 4,
    name: 'Documentation',
    color: 'purple',
    created_at: new Date().toISOString(),
  },
  {
    id: 5,
    name: 'High Priority',
    color: 'orange',
    created_at: new Date().toISOString(),
  },
];

// Mock card data
export const mockCards: Card[] = [
  {
    id: 1,
    list_id: 1,
    title: 'Research API options',
    description: 'Look into REST vs GraphQL for our new service',
    position: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    list_id: 1,
    title: 'Design database schema',
    description: 'Create ERD for the new user management system',
    position: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    list_id: 2,
    title: 'Implement authentication',
    description: 'Add JWT authentication to the API',
    position: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 4,
    list_id: 3,
    title: 'Setup CI/CD pipeline',
    description: 'Configure GitHub Actions for automated testing and deployment',
    position: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Mock card-label relationships
export const mockCardLabels: CardLabel[] = [
  { card_id: 1, label_id: 2 },
  { card_id: 1, label_id: 4 },
  { card_id: 2, label_id: 2 },
  { card_id: 3, label_id: 1 },
  { card_id: 3, label_id: 5 },
  { card_id: 4, label_id: 3 },
];