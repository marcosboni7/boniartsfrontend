'use client';
import {
  Basket,
  Code,
  CreditCard,
  Cube,
  FacebookLogo,
  QrCode,
  WhatsappLogo,
  User,
  Money,
  HandPointing,
  Percent,
  Ticket,
} from '@/icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import type { FC } from 'react';

const items = [
  {
    icon: ({ size }: { size: number }) => <Cube size={size} />,
    href: '/admin/dashboard',
    label: 'Painel',
  },
  {
    icon: ({ size }: { size: number }) => <Code size={size} />,
    href: '/admin/pixel',
    label: 'Pixel',
  },
  {
    icon: ({ size }: { size: number }) => <QrCode size={size} />,
    href: '/admin/pix',
    label: 'PIX',
  },
  {
    icon: ({ size }: { size: number }) => <WhatsappLogo size={size} />,
    href: '/admin/whatsapp',
    label: 'Whatsapp',
  },
  {
    icon: ({ size }: { size: number }) => <CreditCard size={size} />,
    href: '/admin/cards',
    label: 'Cartões',
  },
  {
    icon: ({ size }: { size: number }) => <Basket size={size} />,
    href: '/admin/products',
    label: 'Produtos',
  },
  {
    icon: ({ size }: { size: number }) => <Basket size={size} />,
    href: '/admin/categories',
    label: 'Categorias',
  },
  {
    icon: ({ size }: { size: number }) => <HandPointing size={size} />,
    href: '/admin/products-clicks',
    label: 'Cliques produtos',
  },
  {
    icon: ({ size }: { size: number }) => <User size={size} />,
    href: '/admin/users',
    label: 'Usuários',
  },
  {
    icon: ({ size }: { size: number }) => <FacebookLogo size={size} />,
    href: '/admin/facebooks',
    label: 'Facebook',
  },
  {
    icon: ({ size }: { size: number }) => <Money size={size} />,
    href: '/admin/payments',
    label: 'Pagamentos',
  },
  {
    icon: ({ size }: { size: number }) => <Ticket size={size} />,
    href: '/admin/banners',
    label: 'Banners',
  },
  {
    icon: ({ size }: { size: number }) => <Percent size={size} />,
    href: '/admin/service-tax',
    label: 'Taxa de serviço',
  },
];

const Sidebar: FC = () => {
  const pathname = usePathname();

  return (
    <aside className="h-full w-[250px] bg-white shadow-lg flex-shrink-0">
      <ul className="px-5 py-4">
        {items.map((item) => (
          <li
            key={item.label}
            className={`${
              pathname === item.href ? 'bg-gray-100' : ''
            } text-primary opacity-70 hover:opacity-100 hover:bg-gray-50 rounded-md cursor-pointer`}
          >
            <Link
              href={item.href}
              className="hover:translate-x-4 flex items-center gap-2 py-3 px-4 transition-transform duration-200"
            >
              <item.icon size={20} />
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
