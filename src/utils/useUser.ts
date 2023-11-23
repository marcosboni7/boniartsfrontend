import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import authenticate from './authenticate';
import { User } from '@/types/user.type';

const useUser = (dependencies?: any[]) => {
  const [user, setUser] = useState<User | false>();

  const getUser = async () => {
    const token = Cookies.get('authorization');
    const user = await authenticate(token);

    setUser(user);
  };

  const logout = () => {
    Cookies.remove('authorization');
    window.location.href = '/';
  };

  useEffect(() => {
    getUser();
  }, dependencies ?? []);

  return {
    user,
    logout,
  };
};

export default useUser;
