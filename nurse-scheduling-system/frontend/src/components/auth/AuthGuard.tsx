import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import { RootState } from '../../store/store';
import { setUser } from '../../store/slices/authSlice';
import { authAPI } from '../../services/api';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const dispatch = useDispatch();
  const { user, token, isLoading } = useSelector((state: RootState) => state.auth);
  const [checking, setChecking] = React.useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (token && !user) {
        try {
          const userData = await authAPI.getProfile();
          dispatch(setUser(userData));
        } catch (error) {
          localStorage.removeItem('token');
        }
      }
      setChecking(false);
    };

    checkAuth();
  }, [token, user, dispatch]);

  if (checking || isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;