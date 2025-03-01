import React from 'react';
import { Kanban } from 'lucide-react';
import { Link } from 'react-router-dom';
import ForgotPasswordForm from '../components/auth/ForgotPasswordForm';

const ForgotPasswordPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex items-center justify-center">
          <Kanban className="h-12 w-12 text-sky-600" />
        </Link>
        <ForgotPasswordForm />
      </div>
    </div>
  );
};

export default ForgotPasswordPage;