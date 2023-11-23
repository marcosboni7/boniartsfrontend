import Sidebar from '@/components/Admin/Sidebar';
import authenticate from '@/utils/authenticate';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Painel — Visão Geral',
  description: 'Painel visão geral',
};

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const jwt_token = cookies().get('authorization')?.value;

  if (!jwt_token || !(await authenticate(jwt_token, true))) redirect('/');

  return (
    <div className="flex h-full">
      <Sidebar />
      <main className="flex-grow p-6 overflow-y-scroll">{children}</main>
    </div>
  );
};

export default RootLayout;
