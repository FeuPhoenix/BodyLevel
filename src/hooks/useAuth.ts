import { useSelector, useDispatch } from 'react-redux';
import { 
  selectIsAuthenticated, 
  selectUser, 
  selectAuthLoading,
  selectAuthError,
  getCurrentUser,
  logout,
  clearError
} from '../features/auth/authSlice';
import { AppDispatch } from '../features/store';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const isLoading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  
  // Manual check function that can be called when needed
  const checkAuth = () => {
    dispatch(getCurrentUser());
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  return {
    isAuthenticated,
    isLoading,
    user,
    error,
    checkAuth,
    logout: handleLogout,
    clearError: handleClearError,
  };
}; 