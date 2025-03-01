import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { logout } from '../../store/slices/authSlice';
import { authService } from '../../services/authService';
import { Kanban, Search, User } from 'lucide-react';
import Button from '../ui/Button';

const Header: React.FC = () => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      await authService.logout();
      dispatch(logout());
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  
  return (
    <header className="bg-sky-600 text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Left section */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center">
              <Kanban className="h-6 w-6" />
              <span className="ml-2 text-xl font-bold">Taskify</span>
            </Link>
            
            {isAuthenticated && (
              <>
                <Link to="/boards" className="text-sm font-medium hover:bg-sky-700 px-3 py-1 rounded">
                  Boards
                </Link>
              </>
            )}
          </div>
          
          {/* Right section */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search"
                    className="bg-sky-500 text-white placeholder-sky-200 rounded px-3 py-1 w-40 focus:w-60 transition-all duration-300 focus:outline-none focus:bg-white focus:text-gray-900 focus:placeholder-gray-500"
                  />
                  <Search className="absolute right-2 top-1.5 h-4 w-4 text-sky-200 pointer-events-none" />
                </div>
                
                <div className="relative group">
                  <button className="bg-sky-700 hover:bg-sky-800 rounded-full h-8 w-8 flex items-center justify-center">
                    <User className="h-5 w-5" />
                  </button>
                  
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                      <p className="font-medium">{user?.username}</p>
                      <p className="text-gray-500">{user?.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="space-x-2">
                <Link to="/login">
                  <Button variant="secondary" size="sm">
                    Log in
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">
                    Sign up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;