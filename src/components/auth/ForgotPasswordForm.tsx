import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import Input from '../ui/Input';
import Button from '../ui/Button';

const ForgotPasswordForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const validateForm = () => {
    if (!email) {
      setError('Email is required');
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email is invalid');
      return false;
    }
    
    setError('');
    return true;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      await authService.resetPassword(email);
      setIsSubmitted(true);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isSubmitted) {
    return (
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Check your email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            We've sent a password reset link to {email}
          </p>
        </div>
        
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Didn't receive the email?{' '}
            <button
              onClick={() => setIsSubmitted(false)}
              className="font-medium text-sky-600 hover:text-sky-500"
            >
              Try again
            </button>
          </p>
        </div>
        
        <div className="text-center">
          <p className="text-sm text-gray-600">
            <Link to="/login" className="font-medium text-sky-600 hover:text-sky-500">
              Back to login
            </Link>
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-md w-full space-y-8">
      <div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Reset your password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Enter your email address and we'll send you a link to reset your password
        </p>
      </div>
      
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="rounded-md shadow-sm">
          <Input
            label="Email address"
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error}
            fullWidth
          />
        </div>
        
        <div>
          <Button
            type="submit"
            fullWidth
            size="lg"
            isLoading={isSubmitting}
          >
            Send reset link
          </Button>
        </div>
        
        <div className="text-center">
          <p className="text-sm text-gray-600">
            <Link to="/login" className="font-medium text-sky-600 hover:text-sky-500">
              Back to login
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;