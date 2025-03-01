export interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
}

export interface Board {
  id: number;
  user_id: number;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface List {
  id: number;
  board_id: number;
  title: string;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface Card {
  id: number;
  list_id: number;
  title: string;
  description: string;
  position: number;
  created_at: string;
  updated_at: string;
  labels?: Label[];
}

export interface Label {
  id: number;
  name: string;
  color: string;
  created_at: string;
}

export interface CardLabel {
  card_id: number;
  label_id: number;
}