'use client';
import api from '@/utils/api';
import useAPI from '@/utils/useAPI';
import { usePathname, useSearchParams } from 'next/navigation';
import { FC, ReactNode, useEffect, useState } from 'react';
import ReactPixel from 'react-facebook-pixel';

const WrapperAccess: FC<{ children: ReactNode }> = ({ children }) => {
  const { data: pixels } = useAPI<{ token: string }[]>('pixels');
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [reactPixel, setReactPixel] = useState<any>(null);

  const saveAccess = async (pathname: string) => {
    await api.patch('/accesses', { action: pathname });
  };

  const registerFbPixel = (token: string) => {
    if (reactPixel) reactPixel.init(token);
  };

  const handleFbPixel = () => {
    if (reactPixel) reactPixel.pageView();
  };

  useEffect(() => {
    import('react-facebook-pixel')
      .then((module) => module.default)
      .then((ReactPixel) => {
        ReactPixel.init('your-pixel-code');
        ReactPixel.pageView();
      });
    if (typeof window !== 'undefined')
      pixels?.forEach((pixel) => {
        import('react-facebook-pixel')
          .then((module) => module.default)
          .then((ReactPixel) => {
            ReactPixel.init(pixel.token);
            setReactPixel(ReactPixel);
          });
      });
  }, [pixels]);

  useEffect(() => {
    saveAccess(pathname);

    if (typeof window !== 'undefined') handleFbPixel();
  }, [reactPixel, pathname, searchParams]);

  return children;
};

export default WrapperAccess;
