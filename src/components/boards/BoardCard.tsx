import React from 'react';
import { Link } from 'react-router-dom';
import { Board } from '../../types';

interface BoardCardProps {
  board: Board;
}

const BoardCard: React.FC<BoardCardProps> = ({ board }) => {
  return (
    <Link
      to={`/board/${board.id}`}
      className="block bg-sky-600 hover:bg-sky-700 text-white rounded-md shadow-md h-24 p-4 transition-all duration-200 hover:shadow-lg"
    >
      <h3 className="font-bold text-lg mb-1 truncate">{board.title}</h3>
      {board.description && (
        <p className="text-sm text-sky-100 line-clamp-2">{board.description}</p>
      )}
    </Link>
  );
};

export default BoardCard;