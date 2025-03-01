import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { loginSuccess } from './store/slices/authSlice';
import { mockUsers } from './services/mockData';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import BoardsPage from './pages/BoardsPage';
import BoardPage from './pages/BoardPage';

// Protected route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = store.getState().auth.isAuthenticated;
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

function App() {
  useEffect(() => {
    // Auto-login with the first mock user for demo purposes
    // In a real app, this would check for a stored token and validate it
    const user = mockUsers[0];
    if (user) {
      store.dispatch(loginSuccess(user));
    }
  }, []);
  
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          
          <Route 
            path="/boards" 
            element={
              <ProtectedRoute>
                <BoardsPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/board/:boardId" 
            element={
              <ProtectedRoute>
                <BoardPage />
              </ProtectedRoute>
            } 
          />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;