import React from 'react';
import { Link } from 'react-router-dom';
import { Kanban } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link to="/" className="flex items-center">
              <Kanban className="h-6 w-6 text-sky-600" />
              <span className="ml-2 text-xl font-bold text-gray-800">Taskify</span>
            </Link>
            <p className="text-sm text-gray-600 mt-2">
              © {new Date().getFullYear()} Taskify. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;