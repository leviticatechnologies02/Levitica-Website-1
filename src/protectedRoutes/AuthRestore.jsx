// components/auth/AuthBootstrap.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useVerifyAuthQuery } from '@/Services/authService';
import { login, logout, setAuthChecked } from '@/features/authSlice';

const AuthBootstrap = () => {
  const dispatch = useDispatch();
  const { authChecked } = useSelector((state) => state.auth);

  // 🚀 Only run if not already checked
  const { data, isSuccess, isError } = useVerifyAuthQuery(undefined, {
    skip: authChecked,               // 🔥 prevents repeat calls
    refetchOnMountOrArgChange: false,
    refetchOnFocus: false,
    refetchOnReconnect: false,
  });

  useEffect(() => {
    if (isSuccess && data?.verified && data?.user) {
      dispatch(login({ user: data.user }));
      dispatch(setAuthChecked(true));
    } else if (isSuccess || isError) {
      dispatch(logout());
      dispatch(setAuthChecked(true));
    }
  }, [isSuccess, isError, data, dispatch]);

  return null;
};

export default AuthBootstrap;