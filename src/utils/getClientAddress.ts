import { headers } from 'next/headers';
import api from './api';

export const getClientAddress = async () => {
  'use server';
  const ip_address = headers().get('X-Forwarded-For');

  const { data } = await api.get<{ city: string; region: string }>(
    `http://ip-api.com/json/`
  );

  return {
    city: data.city,
    region: data.region,
  };
};
