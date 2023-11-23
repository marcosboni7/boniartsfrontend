import { User } from '@/types/user.type';
import api from './api';

const authenticate = async (
  token: string | undefined,
  admin: boolean = false
) => {
  if (!token) return false;

  try {
    const user: User = await (
      await fetch(
        `${api.defaults.baseURL}/auth/me`, 
        {
          headers: {
            Authorization: 'bearer ' + token,
          },
        }
      )
    ).json();

    if (admin && user.admin) {
      return user;
    } else if (!admin && user) {
      return user;
    }

    return false;
  } catch (err) {
    return false;
  }
};

export default authenticate;
