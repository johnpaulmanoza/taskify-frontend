import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { registerStart, registerSuccess, registerFailure } from '../../store/slices/authSlice';
import { authService } from '../../services/authService';
import Input from '../ui/Input';
import Button from '../ui/Button';

const RegisterForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const validateForm = () => {
    const newErrors: {
      username?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};
    let isValid = true;
    
    if (!username) {
      newErrors.username = 'Username is required';
      isValid = false;
    } else if (username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
      isValid = false;
    }
    
    if (!email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    dispatch(registerStart());
    
    try {
      const user = await authService.register(username, email, password);
      dispatch(registerSuccess(user));
      navigate('/boards');
    } catch (error) {
      dispatch(registerFailure((error as Error).message));
      if ((error as Error).message.includes('email')) {
        setErrors({ ...errors, email: (error as Error).message });
      } else if ((error as Error).message.includes('username')) {
        setErrors({ ...errors, username: (error as Error).message });
      } else {
        setErrors({ ...errors, password: (error as Error).message });
      }
    }
  };
  
  return (
    <div className="max-w-md w-full space-y-8">
      <div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
      </div>
      
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="rounded-md shadow-sm space-y-4">
          <Input
            label="Username"
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={errors.username}
            fullWidth
          />
          
          <Input
            label="Email address"
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            fullWidth
          />
          
          <Input
            label="Password"
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            fullWidth
          />
          
          <Input
            label="Confirm Password"
            id="confirm-password"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={errors.confirmPassword}
            fullWidth
          />
        </div>
        
        <div>
          <Button
            type="submit"
            fullWidth
            size="lg"
          >
            Sign up
          </Button>
        </div>
        
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-sky-600 hover:text-sky-500">
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;